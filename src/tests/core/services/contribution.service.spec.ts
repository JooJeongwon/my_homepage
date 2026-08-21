import { describe, it, expect, vi } from 'vitest';
import { ContributionService } from '@/core/services/contribution.service';
import { IContributionRepository } from '@/infrastructure/github/github-graphql.repository';
import { ContributionCalendar } from '@/core/models/contribution.model';

describe('ContributionService Fallback & Strict Mode Unit Tests', () => {
    it('레포지토리 실패 시 getContributions()는 SSG 빌드가 중단되지 않도록 Fallback Calendar를 반환해야 한다.', async () => {
        const mockRepo: IContributionRepository = {
            getContributions: vi.fn().mockRejectedValue(new Error('GitHub GraphQL API 호출 실패'))
        };

        const service = new ContributionService(mockRepo);
        const calendar = await service.getContributions('JooJeongwon');

        expect(calendar).toBeDefined();
        expect(calendar.totalContributions).toBe(0);
        expect(calendar.weeks.length).toBe(53);
    });

    it('레포지토리 성공 시 getContributions()는 실제 데이터를 반환해야 한다.', async () => {
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

    it('getContributionsStrict()는 실패 시 예외를 상위로 전파해야 한다.', async () => {
        const mockRepo: IContributionRepository = {
            getContributions: vi.fn().mockRejectedValue(new Error('API Failure'))
        };

        const service = new ContributionService(mockRepo);
        await expect(service.getContributionsStrict('JooJeongwon')).rejects.toThrow('API Failure');
    });
});
