import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ContributionService, createFallbackContributionCalendar } from '@/core/services/contribution.service';
import { IContributionRepository } from '@/infrastructure/github/github-graphql.repository';
import { ContributionCalendar, ContributionCalendarSchema } from '@/core/models/contribution.model';

describe('createFallbackContributionCalendar', () => {
    it('53주(371일)의 0 기여도 기본 캘린더 데이터를 올바르게 생성하고 스키마를 통과한다', () => {
        const fallback = createFallbackContributionCalendar();

        expect(fallback.totalContributions).toBe(0);
        expect(fallback.weeks).toHaveLength(53);
        expect(fallback.weeks.every((w) => w.contributionDays.length === 7)).toBe(true);

        const parseResult = ContributionCalendarSchema.safeParse(fallback);
        expect(parseResult.success).toBe(true);
    });
});

describe('ContributionService', () => {
    beforeEach(() => {
        vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('레포지토리 실패 시 SSG 빌드 안전을 위해 fallback 캘린더를 반환한다', async () => {
        const mockRepo: IContributionRepository = {
            getContributions: vi.fn().mockRejectedValue(new Error('GitHub GraphQL API 호출 실패'))
        };

        const service = new ContributionService(mockRepo);
        const calendar = await service.getContributions('JooJeongwon');

        expect(calendar).toBeDefined();
        expect(calendar.totalContributions).toBe(0);
        expect(calendar.weeks).toHaveLength(53);
    });

    it('레포지토리 성공 시 실제 캘린더 데이터를 반환한다', async () => {
        const mockData: ContributionCalendar = {
            totalContributions: 42,
            weeks: []
        };
        const mockRepo: IContributionRepository = {
            getContributions: vi.fn().mockResolvedValue(mockData)
        };

        const service = new ContributionService(mockRepo);
        const calendar = await service.getContributions('JooJeongwon');

        expect(calendar.totalContributions).toBe(42);
    });

    it('getContributionsStrict()는 실패 시 예외를 던진다', async () => {
        const mockRepo: IContributionRepository = {
            getContributions: vi.fn().mockRejectedValue(new Error('API Failure'))
        };

        const service = new ContributionService(mockRepo);
        await expect(service.getContributionsStrict('JooJeongwon')).rejects.toThrow('API Failure');
    });
});
