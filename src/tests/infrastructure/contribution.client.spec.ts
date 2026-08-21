import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ContributionApiClient } from '@/infrastructure/github/contribution.client';
import { ContributionCalendar } from '@/core/models/contribution.model';

describe('ContributionApiClient (FIRST Principle Infrastructure Test)', () => {
    let client: ContributionApiClient;
    const mockCalendar: ContributionCalendar = {
        totalContributions: 42,
        weeks: [
            {
                contributionDays: [
                    { date: '2026-01-01', count: 5, level: 2 }
                ]
            }
        ]
    };

    beforeEach(() => {
        client = new ContributionApiClient();
        vi.stubGlobal('fetch', vi.fn());
        delete (process.env as Record<string, string | undefined>).NEXT_PUBLIC_MOCK_CONTRIBUTIONS;
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.unstubAllGlobals();
    });

    it('NEXT_PUBLIC_MOCK_CONTRIBUTIONS가 true일 때 모의 기여도 데이터를 반환해야 한다', async () => {
        process.env.NEXT_PUBLIC_MOCK_CONTRIBUTIONS = 'true';

        const result = await client.getContributions('JooJeongwon');

        expect(result).toBeDefined();
        expect(result.weeks.length).toBe(53);
        expect(result.totalContributions).toBeGreaterThanOrEqual(0);
    });

    it('API 호출 성공 시 정상 파싱된 ContributionCalendar를 반환해야 한다', async () => {
        vi.mocked(fetch).mockResolvedValueOnce(
            new Response(JSON.stringify(mockCalendar), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            })
        );

        const result = await client.getContributions('JooJeongwon');

        expect(result).toEqual(mockCalendar);
        expect(fetch).toHaveBeenCalledWith(
            '/api/github/users/JooJeongwon/contributions',
            expect.any(Object)
        );
    });

    it('localhost 환경에서 로컬 API가 404일 경우 프로덕션 API(jwjoo.com)로 fallback 호출하여 데이터를 반환해야 한다', async () => {
        // window.location mocking
        vi.stubGlobal('window', {
            location: {
                hostname: 'localhost'
            }
        });

        // 1차 로컬 호출: 404
        vi.mocked(fetch).mockResolvedValueOnce(
            new Response('Not Found', { status: 404 })
        );

        // 2차 프로덕션 fallback 호출: 200 성공
        vi.mocked(fetch).mockResolvedValueOnce(
            new Response(JSON.stringify(mockCalendar), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            })
        );

        const result = await client.getContributions('JooJeongwon');

        expect(result).toEqual(mockCalendar);
        expect(fetch).toHaveBeenNthCalledWith(
            1,
            '/api/github/users/JooJeongwon/contributions',
            expect.any(Object)
        );
        expect(fetch).toHaveBeenNthCalledWith(
            2,
            'https://jwjoo.com/api/github/users/JooJeongwon/contributions',
            expect.any(Object)
        );
    });

    it('모든 API 호출이 실패할 경우 Fallback 데이터를 반환해야 한다', async () => {
        vi.mocked(fetch).mockRejectedValue(new Error('Network error'));

        const result = await client.getContributions('JooJeongwon');

        expect(result).toBeDefined();
        expect(result.totalContributions).toBe(0);
        expect(result.weeks.length).toBe(53);
    });
});
