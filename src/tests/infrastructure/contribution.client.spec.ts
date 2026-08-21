import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ContributionApiClient } from '@/infrastructure/github/contribution.client';
import { ContributionCalendar } from '@/core/models/contribution.model';

describe('ContributionApiClient', () => {
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
        vi.useFakeTimers();
        client = new ContributionApiClient();
        vi.stubGlobal('fetch', vi.fn());
        vi.spyOn(console, 'warn').mockImplementation(() => {});
        vi.spyOn(console, 'error').mockImplementation(() => {});
        vi.spyOn(console, 'info').mockImplementation(() => {});
        delete (process.env as Record<string, string | undefined>).NEXT_PUBLIC_MOCK_CONTRIBUTIONS;
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.restoreAllMocks();
        vi.unstubAllGlobals();
    });

    it('NEXT_PUBLIC_MOCK_CONTRIBUTIONS 설정 시 모의 데이터를 반환한다', async () => {
        process.env.NEXT_PUBLIC_MOCK_CONTRIBUTIONS = 'true';

        const promise = client.getContributions('JooJeongwon');
        await vi.advanceTimersByTimeAsync(800);
        const result = await promise;

        expect(result.weeks).toHaveLength(53);
        expect(result.totalContributions).toBeGreaterThanOrEqual(0);
    });

    it('API 호출 성공 시 파싱된 캘린더 데이터를 반환한다', async () => {
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

    it('로컬 엔드포인트 404 시 프로덕션 API로 fallback 호출한다', async () => {
        vi.stubGlobal('window', {
            location: {
                hostname: 'localhost'
            }
        });

        vi.mocked(fetch)
            .mockResolvedValueOnce(new Response('Not Found', { status: 404 }))
            .mockResolvedValueOnce(new Response(JSON.stringify(mockCalendar), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            }));

        const result = await client.getContributions('JooJeongwon');

        expect(result).toEqual(mockCalendar);
        expect(fetch).toHaveBeenNthCalledWith(1, '/api/github/users/JooJeongwon/contributions', expect.any(Object));
        expect(fetch).toHaveBeenNthCalledWith(2, 'https://jwjoo.com/api/github/users/JooJeongwon/contributions', expect.any(Object));
    });

    it('모든 API 재시도 실패 시 fallback 캘린더를 반환한다', async () => {
        vi.mocked(fetch).mockRejectedValue(new Error('Network error'));

        const promise = client.getContributions('JooJeongwon');
        // backoff 타이머를 가속 진행
        await vi.runAllTimersAsync();
        const result = await promise;

        expect(result.totalContributions).toBe(0);
        expect(result.weeks).toHaveLength(53);
    });
});
