import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { onRequest, onRequestOptions } from '../../../../../../../functions/api/github/users/[username]/contributions';

interface MockContext {
    request: Request;
    params: { username?: string };
    env: { GITHUB_PAT?: string };
    waitUntil: (promise: Promise<unknown>) => void;
}

describe('GitHub Contributions API Route', () => {
    let mockContext: MockContext;
    const originalFetch = global.fetch;
    const originalCaches = (globalThis as Record<string, unknown>).caches;

    beforeEach(() => {
        vi.useFakeTimers({ shouldAdvanceTime: true });
        vi.setSystemTime(new Date('2026-07-30T00:00:00.000Z'));

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

        const mockCache = {
            match: vi.fn().mockResolvedValue(null),
            put: vi.fn().mockResolvedValue(undefined)
        };
        (globalThis as Record<string, unknown>).caches = {
            default: mockCache
        };

        mockContext = {
            request: new Request('http://localhost:3000/api/github/users/JooJeongwon/contributions', {
                headers: { 'Origin': 'http://localhost:3000' }
            }),
            params: { username: 'JooJeongwon' },
            env: { GITHUB_PAT: 'mock_token' },
            waitUntil: vi.fn()
        };

        vi.spyOn(console, 'error').mockImplementation(() => {});
        vi.spyOn(console, 'warn').mockImplementation(() => {});
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.restoreAllMocks();
        global.fetch = originalFetch;
        if (originalCaches !== undefined) {
            (globalThis as Record<string, unknown>).caches = originalCaches;
        } else {
            delete (globalThis as Record<string, unknown>).caches;
        }
    });

    it('유효한 요청 시 기여도 데이터와 보안 헤더를 반환한다', async () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response = await onRequest(mockContext as any);
        expect(response.status).toBe(200);

        const data = await response.json() as { totalContributions?: number };
        expect(data).toHaveProperty('totalContributions', 100);
        expect(response.headers.get('Access-Control-Allow-Origin')).toBe('http://localhost:3000');
        expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
    });

    it('OPTIONS preflight 요청에 대해 204 No Content를 반환한다', async () => {
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
    });

    it('허용되지 않은 Origin의 OPTIONS 요청 시 403 Forbidden을 반환한다', async () => {
        mockContext.request = new Request('http://localhost:3000/api/github/users/JooJeongwon/contributions', {
            method: 'OPTIONS',
            headers: { 'Origin': 'http://malicious-site.com' }
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response = await onRequestOptions(mockContext as any);
        expect(response.status).toBe(403);
    });

    it('허용되지 않은 Origin 요청 시 403 Forbidden을 반환한다', async () => {
        mockContext.request = new Request('http://localhost:3000/api/github/users/JooJeongwon/contributions', {
            headers: { 'Origin': 'http://malicious.com' }
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response = await onRequest(mockContext as any);
        expect(response.status).toBe(403);
    });

    it('유효하지 않은 username 형식 요청 시 403 Forbidden을 반환한다', async () => {
        mockContext.request = new Request('http://localhost:3000/api/github/users/bad_user$/contributions', {
            headers: { 'Origin': 'http://localhost:3000' }
        });
        mockContext.params = { username: 'bad_user$' };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response = await onRequest(mockContext as any);
        expect(response.status).toBe(403);
    });

    it('GitHub API 에러 시 502 Bad Gateway와 정제된 에러 메시지를 반환한다', async () => {
        global.fetch = vi.fn().mockImplementation(() => {
            return Promise.resolve(new Response('GraphQL Error', { status: 500 }));
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response = await onRequest(mockContext as any);
        expect(response.status).toBe(502);

        const data = await response.json() as { error?: string };
        expect(data.error).toBe('GitHub API 연동 중 문제가 발생했습니다.');
    });

    it('STALE 캐시 만료 시 X-Cache-Status: STALE 헤더와 함께 백그라운드 갱신을 예약한다', async () => {
        const pastDate = new Date(Date.now() - 65 * 60 * 1000).toUTCString();
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
        (globalThis as Record<string, unknown>).caches = { default: mockCache };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response = await onRequest(mockContext as any);
        expect(response.status).toBe(200);
        expect(response.headers.get('X-Cache-Status')).toBe('STALE');
        expect(mockContext.waitUntil).toHaveBeenCalled();
    });

    it('API 호출 실패 시 만료된 캐시가 있으면 Fallback으로 서빙한다', async () => {
        global.fetch = vi.fn().mockRejectedValue(new Error('Connection Timeout'));

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
        (globalThis as Record<string, unknown>).caches = { default: mockCache };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response = await onRequest(mockContext as any);
        expect(response.status).toBe(200);
        expect(response.headers.get('X-Cache-Status')).toBe('FALLBACK');
    });
});
