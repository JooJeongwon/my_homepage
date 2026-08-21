import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { onRequest, onRequestOptions } from '../../../../../../../functions/api/github/users/[username]/contributions';

interface MockContext {
    request: Request;
    params: { username?: string };
    env: { GITHUB_PAT?: string };
    waitUntil: (promise: Promise<unknown>) => void;
}

describe('contributions API 자원 URI 식별화 및 보안/기능 테스트', () => {
    let mockContext: MockContext;
    const originalFetch = global.fetch;
    const originalCaches = (globalThis as Record<string, unknown>).caches;

    beforeEach(() => {
        vi.useFakeTimers({ shouldAdvanceTime: true });
        vi.setSystemTime(new Date('2026-07-30T00:00:00.000Z'));

        vi.restoreAllMocks();
        vi.clearAllMocks();
        vi.resetAllMocks();
        
        // global fetch 모킹
        global.fetch = vi.fn().mockImplementation(() => {
            return Promise.resolve(new Response(JSON.stringify({
                data: {
                    user: {
                        contributionsCollection: {
                            contributionCalendar: {
                                totalContributions: 100,
                                weeks: [
                                    {
                                        contributionDays: [
                                            {
                                                date: '2026-06-09',
                                                contributionCount: 5,
                                                contributionLevel: 'FIRST_QUARTILE'
                                            }
                                        ]
                                    }
                                ]
                            }
                        }
                    }
                }
            }), { status: 200 }));
        });

        // global caches mock
        const mockCache = {
            match: vi.fn().mockResolvedValue(null),
            put: vi.fn().mockResolvedValue(undefined)
        };
        (globalThis as Record<string, unknown>).caches = {
            default: mockCache
        };

        mockContext = {
            request: new Request('http://localhost:3000/api/github/users/JooJeongwon/contributions', {
                headers: {
                    'Origin': 'http://localhost:3000'
                }
            }),
            params: {
                username: 'JooJeongwon'
            },
            env: {
                GITHUB_PAT: 'mock_token'
            },
            waitUntil: vi.fn()
        };
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.restoreAllMocks();
        vi.clearAllMocks();
        vi.resetAllMocks();

        global.fetch = originalFetch;
        if (originalCaches !== undefined) {
            (globalThis as Record<string, unknown>).caches = originalCaches;
        } else {
            delete (globalThis as Record<string, unknown>).caches;
        }
    });


    it('RESTful 자원 URI 경로와 정상적인 Origin으로 유효한 username 요청 시 기여 정보를 정상 반환한다', async () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response = await onRequest(mockContext as any);
        expect(response.status).toBe(200);

        const data = await response.json() as { totalContributions?: number };
        expect(data).toHaveProperty('totalContributions', 100);
        
        // 보안 응답 헤더 탑재 여부 검증
        expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
        expect(response.headers.get('X-Frame-Options')).toBe('DENY');
        expect(response.headers.get('Content-Security-Policy')).toBe("default-src 'none'; sandbox;");
        expect(response.headers.get('Referrer-Policy')).toBe('strict-origin-when-cross-origin');
        expect(response.headers.get('Access-Control-Allow-Origin')).toBe('http://localhost:3000');
    });

    it('CORS Preflight (OPTIONS) 요청 시 허용된 Origin에 대해 204 No Content와 적절한 CORS 헤더를 반환한다', async () => {
        mockContext.request = new Request('http://localhost:3000/api/github/users/JooJeongwon/contributions', {
            method: 'OPTIONS',
            headers: {
                'Origin': 'http://localhost:3000',
                'Access-Control-Request-Method': 'GET'
            }
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response = await onRequest(mockContext as any);
        expect(response.status).toBe(204);
        expect(response.headers.get('Access-Control-Allow-Origin')).toBe('http://localhost:3000');
        expect(response.headers.get('Access-Control-Allow-Methods')).toBe('GET, OPTIONS');
        expect(response.headers.get('Access-Control-Allow-Headers')).toBe('Content-Type');
        expect(response.headers.get('Access-Control-Max-Age')).toBe('86400');
    });

    it('CORS Preflight (OPTIONS) 요청 시 허용되지 않은 Origin인 경우 403 Forbidden을 반환한다', async () => {
        mockContext.request = new Request('http://localhost:3000/api/github/users/JooJeongwon/contributions', {
            method: 'OPTIONS',
            headers: {
                'Origin': 'http://malicious-site.com'
            }
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response = await onRequestOptions(mockContext as any);
        expect(response.status).toBe(403);
        expect(response.headers.get('Access-Control-Allow-Origin')).toBeNull();
    });

    it('허용되지 않은 Origin인 경우 403 Forbidden을 반환하고 요청을 차단한다', async () => {
        mockContext.request = new Request('http://localhost:3000/api/github/users/JooJeongwon/contributions', {
            headers: {
                'Origin': 'http://malicious.com'
            }
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response = await onRequest(mockContext as any);
        expect(response.status).toBe(403);

        const data = await response.json() as { error?: string };
        expect(data.error).toContain('허용되지 않은 접근 경로입니다');
        
        // CORS 헤더가 malicious.com으로 설정되지 않았거나 차단되는지 확인
        expect(response.headers.get('Access-Control-Allow-Origin')).toBeNull();
    });

    it('허용되지 않은 username 패턴(인젝션 시도 또는 화이트리스트 외)인 경우 403 Forbidden을 반환한다', async () => {
        mockContext.request = new Request('http://localhost:3000/api/github/users/bad_user$/contributions', {
            headers: {
                'Origin': 'http://localhost:3000'
            }
        });
        mockContext.params = { username: 'bad_user$' };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response = await onRequest(mockContext as any);
        expect(response.status).toBe(403);

        const data = await response.json() as { error?: string };
        expect(data.error).toContain('허용되지 않거나 올바르지 않은 사용자 이름입니다');
    });

    it('GitHub API 에러 발생 시 상세 에러가 응답 바디에 직접 노출되지 않고 정제된 에러를 반환한다', async () => {
        // Fetch가 에러 상태코드 500을 반환하도록 재모킹
        global.fetch = vi.fn().mockImplementation(() => {
            return Promise.resolve(new Response('Internal Server GraphQL Error Detail', { status: 500 }));
        });

        // console.error 모킹하여 콘솔 출력이 조용하게 만듬
        const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response = await onRequest(mockContext as any);
        // 에러 시 502 Bad Gateway 리턴 확인
        expect(response.status).toBe(502);

        const data = await response.json() as { error?: string; details?: unknown };
        // 실제 에러 메시지(Internal Server GraphQL Error Detail)는 드러나지 않고 일반적인 에러 리턴 확인
        expect(data.error).toBe('GitHub API 연동 중 문제가 발생했습니다.');
        expect(data.details).toBeUndefined(); // details 노출 없음

        errorSpy.mockRestore();
    });

    it('캐시 응답이 1시간을 초과하고 1시간 10분 이내인 경우 X-Cache-Status: STALE을 반환하고 백그라운드 갱신을 수행한다', async () => {
        const pastDate = new Date(Date.now() - 65 * 60 * 1000).toUTCString();
        
        // 캐시된 응답 모킹
        const mockCacheResponse = new Response(JSON.stringify({
            totalContributions: 100,
            weeks: []
        }), {
            status: 200,
            headers: {
                'Date': pastDate,
                'Cache-Control': 'public, max-age=3600, stale-while-revalidate=600'
            }
        });

        const mockCache = {
            match: vi.fn().mockResolvedValue(mockCacheResponse),
            put: vi.fn().mockResolvedValue(undefined)
        };
        (globalThis as Record<string, unknown>).caches = {
            default: mockCache
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response = await onRequest(mockContext as any);
        expect(response.status).toBe(200);
        expect(response.headers.get('X-Cache-Status')).toBe('STALE');

        const data = await response.json() as { totalContributions?: number };
        expect(data).toHaveProperty('totalContributions', 100);

        // revalidateCache 태스크가 waitUntil로 예약되었는지 검증
        expect(mockContext.waitUntil).toHaveBeenCalled();
    });

    it('GraphQL 호출 실패 시 기존 캐시가 매치된다면 X-Cache-Status: FALLBACK 헤더와 함께 200 OK 응답을 서빙한다', async () => {
        // Fetch 실패 모킹
        global.fetch = vi.fn().mockImplementation(() => {
            return Promise.reject(new Error('GitHub GraphQL Connection Timeout'));
        });

        // 콘솔 에러 및 경고 모킹하여 깨끗한 테스트 출력 보장
        const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

        // 캐시된 응답 모킹 (1시간 10분이 지난 만료된 캐시로 설정하여 실제 API 호출을 유도)
        const mockCacheResponse = new Response(JSON.stringify({
            totalContributions: 80,
            weeks: []
        }), {
            status: 200,
            headers: {
                'Date': new Date(Date.now() - 120 * 60 * 1000).toUTCString(),
                'Cache-Control': 'public, max-age=3600'
            }
        });

        const mockCache = {
            match: vi.fn().mockResolvedValue(mockCacheResponse),
            put: vi.fn().mockResolvedValue(undefined)
        };
        (globalThis as Record<string, unknown>).caches = {
            default: mockCache
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response = await onRequest(mockContext as any);
        expect(response.status).toBe(200);
        expect(response.headers.get('X-Cache-Status')).toBe('FALLBACK');
        expect(response.headers.get('X-Cache-Fallback')).toBe('true');

        const data = await response.json() as { totalContributions?: number };
        expect(data).toHaveProperty('totalContributions', 80);

        errorSpy.mockRestore();
        warnSpy.mockRestore();
    });
});
