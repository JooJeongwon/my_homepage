/// <reference types="@cloudflare/workers-types" />

import { getGithubContributionsUseCase } from '../../../src/di/contribution.module';

interface Env {
    GITHUB_PAT: string;
}

// 조회 허용된 유저 목록 (화이트리스트)
const ALLOWED_USERNAMES = ['JooJeongwon'];

// GitHub 사용자 이름 유효성 검증 정규식 (영문자/숫자 시작, 최대 39자, 하이픈이 연속되거나 시작/끝에 올 수 없음)
const GITHUB_USERNAME_REGEX = /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/;

// 허용할 Origin 패턴 리스트 (정규표현식)
const ALLOWED_ORIGIN_PATTERNS = [
    /^https:\/\/jwjoo\.com$/,
    /^https:\/\/www\.jwjoo\.com$/,
    /^https:\/\/[a-zA-Z0-9-]+\.pages\.dev$/, // Cloudflare Pages Preview
    /^http:\/\/localhost:\d+$/,            // 로컬 개발 환경
    /^http:\/\/127\.0\.0\.1:\d+$/
];

const isAllowedOrigin = (origin: string | null): boolean => {
    if (!origin) return false;
    return ALLOWED_ORIGIN_PATTERNS.some(pattern => pattern.test(origin));
};

/**
 * 백그라운드 캐시 재검증 비동기 함수 (SWR)
 */
async function revalidateCache(
    cacheKey: Request,
    cache: Cache,
    username: string,
    token: string,
    securityHeaders: Record<string, string>
): Promise<void> {
    try {
        console.log(`[SWR] 백그라운드 캐시 재검증 시작 (User: ${username})`);
        const getContributionsUseCase = getGithubContributionsUseCase(token);
        const formattedData = await getContributionsUseCase.execute(username);

        const responseHeaders: Record<string, string> = {
            ...securityHeaders,
            'Cache-Control': 'public, max-age=3600, stale-while-revalidate=600',
            'Cloudflare-CDN-Cache-Control': 'max-age=3600, stale-while-revalidate=600',
            'Date': new Date().toUTCString()
        };

        const freshResponse = new Response(JSON.stringify(formattedData), {
            status: 200,
            headers: responseHeaders
        });

        await cache.put(cacheKey, freshResponse);
        console.log(`[SWR] 백그라운드 캐시 재검증 성공 (User: ${username})`);
    } catch (err) {
        console.error('[SWR] 백그라운드 캐시 재검증 실패:', err);
    }
}

export const onRequest: PagesFunction<Env> = async (context) => {
    const url = new URL(context.request.url);
    const username = url.searchParams.get('username') || 'JooJeongwon';
    const token = context.env.GITHUB_PAT;

    // Origin 및 Referer 교차 검증
    const origin = context.request.headers.get('Origin');
    const referer = context.request.headers.get('Referer');
    
    let requestOrigin = origin;
    if (!requestOrigin && referer) {
        try {
            requestOrigin = new URL(referer).origin;
        } catch {
            requestOrigin = null;
        }
    }

    const isOriginValid = isAllowedOrigin(requestOrigin);

    // 공통 보안 응답 헤더 구성
    const securityHeaders: Record<string, string> = {
        'Content-Type': 'application/json;charset=UTF-8',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'Content-Security-Policy': "default-src 'none'; sandbox;",
        'Referrer-Policy': 'strict-origin-when-cross-origin'
    };

    if (isOriginValid && requestOrigin) {
        securityHeaders['Access-Control-Allow-Origin'] = requestOrigin;
    }

    // 1. 허용되지 않은 Origin 차단 (CORS 방어 강화)
    if (!isOriginValid) {
        return new Response(
            JSON.stringify({ error: '허용되지 않은 접근 경로입니다. (Invalid Origin)' }),
            {
                status: 403,
                headers: securityHeaders
            }
        );
    }

    // 2. 유저 유효성 및 화이트리스트 검증
    if (!GITHUB_USERNAME_REGEX.test(username) || !ALLOWED_USERNAMES.includes(username)) {
        return new Response(
            JSON.stringify({ error: '허용되지 않거나 올바르지 않은 사용자 이름입니다.' }),
            {
                status: 403,
                headers: securityHeaders
            }
        );
    }

    if (!token) {
        console.error('환경 변수 GITHUB_PAT 누락');
        return new Response(
            JSON.stringify({ error: '서버 내부 설정 오류가 발생했습니다.' }),
            {
                status: 500,
                headers: securityHeaders
            }
        );
    }

    // 3. Cloudflare Edge Cache 조회 설정 및 SWR 처리
    const cacheKey = new Request(url.toString(), {
        method: 'GET',
        headers: context.request.headers,
    });
    const cache = (caches as unknown as { default: Cache }).default;

    const MAX_AGE = 3600; // 1시간 (유효한 캐시 시간)
    const SWR_AGE = 600;  // 10분 (stale-while-revalidate 가능 기간)

    try {
        const cachedResponse = await cache.match(cacheKey);
        if (cachedResponse) {
            const dateHeader = cachedResponse.headers.get('Date');
            if (dateHeader) {
                const age = (Date.now() - new Date(dateHeader).getTime()) / 1000;
                
                // 3.1. 캐시가 완전히 유효한 경우 (HIT)
                if (age < MAX_AGE) {
                    const newHeaders = new Headers(cachedResponse.headers);
                    Object.entries(securityHeaders).forEach(([key, val]) => {
                        newHeaders.set(key, val);
                    });
                    newHeaders.set('X-Cache-Status', 'HIT');
                    return new Response(cachedResponse.body, {
                        status: cachedResponse.status,
                        statusText: cachedResponse.statusText,
                        headers: newHeaders
                    });
                }
                
                // 3.2. 캐시가 만료되었으나 SWR 유효기간 내에 있는 경우 (STALE)
                if (age >= MAX_AGE && age < MAX_AGE + SWR_AGE) {
                    const newHeaders = new Headers(cachedResponse.headers);
                    Object.entries(securityHeaders).forEach(([key, val]) => {
                        newHeaders.set(key, val);
                    });
                    newHeaders.set('X-Cache-Status', 'STALE');

                    // 백그라운드 재검증 태스크 등록 (클라이언트는 대기 없이 캐시 즉시 수신)
                    context.waitUntil(
                        revalidateCache(cacheKey, cache, username, token, securityHeaders)
                    );

                    return new Response(cachedResponse.body, {
                        status: cachedResponse.status,
                        statusText: cachedResponse.statusText,
                        headers: newHeaders
                    });
                }
            }
        }
    } catch (cacheErr) {
        console.warn('Cache API 사용 불가 또는 에러:', cacheErr);
    }

    try {
        // UseCase 및 Repository Port & Adapter를 활용하여 기여도 데이터 조회
        const getContributionsUseCase = getGithubContributionsUseCase(token);
        const formattedData = await getContributionsUseCase.execute(username);

        // 4. 응답 구성 및 Edge/Browser 캐시 헤더 주입
        const responseHeaders: Record<string, string> = {
            ...securityHeaders,
            'Cache-Control': 'public, max-age=3600, stale-while-revalidate=600',
            'Cloudflare-CDN-Cache-Control': 'max-age=3600, stale-while-revalidate=600',
            'Date': new Date().toUTCString()
        };

        const formattedResponse = new Response(JSON.stringify(formattedData), {
            status: 200,
            headers: responseHeaders
        });

        // Cloudflare Edge Cache에 비동기로 저장
        try {
            context.waitUntil(cache.put(cacheKey, formattedResponse.clone()));
        } catch (cachePutErr) {
            console.warn('Cache API 저장 실패:', cachePutErr);
        }

        return formattedResponse;

    } catch (err: any) {
        console.error('서버리스 내부 처리 에러:', err);
        
        // 5. Stale-If-Error 및 캐시 폴백 처리
        try {
            const cachedResponse = await cache.match(cacheKey);
            if (cachedResponse) {
                console.warn(`[Resilience] API 호출 실패로 인해 이전 캐시 데이터로 폴백 응답 서빙 (User: ${username})`);
                const newHeaders = new Headers(cachedResponse.headers);
                Object.entries(securityHeaders).forEach(([key, val]) => {
                    newHeaders.set(key, val);
                });
                newHeaders.set('X-Cache-Fallback', 'true');
                newHeaders.set('X-Cache-Status', 'FALLBACK');
                
                return new Response(cachedResponse.body, {
                    status: 200,
                    headers: newHeaders
                });
            }
        } catch (cacheErr) {
            console.error('캐시 폴백 조회 실패:', cacheErr);
        }

        // GitHub API 연동 중 발생한 에러인지 체크하여 알맞은 상태 코드 및 메시지 제공
        const isGithubError = err.message && err.message.includes('GitHub GraphQL API 호출 실패');
        const status = isGithubError ? 502 : 500;
        const errorMessage = isGithubError 
            ? 'GitHub API 연동 중 문제가 발생했습니다.' 
            : '서버 내부 오류가 발생했습니다.';

        return new Response(
            JSON.stringify({ error: errorMessage }),
            {
                status: status,
                headers: securityHeaders
            }
        );
    }
};

