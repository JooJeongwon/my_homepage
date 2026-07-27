import { describe, it, expect, vi } from 'vitest';
import { GetContributionsUseCase } from '@/application/use-cases/contribution/get-contributions.use-case';
import { ContributionRepository } from '@/domain/ports/contribution.repository';
import { ContributionCalendar } from '@/domain/models/contribution.model';

describe('GetContributionsUseCase Fallback & Result Pattern', () => {
    it('레포지토리 실패 시 execute()는 SSG 빌드가 중단되지 않도록 Fallback Calendar를 반환해야 한다.', async () => {
        const mockRepo: ContributionRepository = {
            getContributions: vi.fn().mockRejectedValue(new Error('GitHub GraphQL API 호출 실패'))
        };

        const useCase = new GetContributionsUseCase(mockRepo);
        const calendar = await useCase.execute('JooJeongwon');

        expect(calendar).toBeDefined();
        expect(calendar.totalContributions).toBe(0);
        expect(calendar.weeks.length).toBe(53);
    });

    it('레포지토리 성공 시 execute()는 실제 데이터를 반환해야 한다.', async () => {
        const mockData: ContributionCalendar = {
            totalContributions: 42,
            weeks: []
        };
        const mockRepo: ContributionRepository = {
            getContributions: vi.fn().mockResolvedValue(mockData)
        };

        const useCase = new GetContributionsUseCase(mockRepo);
        const calendar = await useCase.execute('JooJeongwon');

        expect(calendar.totalContributions).toBe(42);
    });

    it('executeResult()는 실패 시 Failure 객체를 반환해야 한다.', async () => {
        const mockRepo: ContributionRepository = {
            getContributions: vi.fn().mockRejectedValue(new Error('API Failure'))
        };

        const useCase = new GetContributionsUseCase(mockRepo);
        const result = await useCase.executeResult('JooJeongwon');

        expect(result.isFailure).toBe(true);
        if (result.isFailure) {
            expect(result.error.message).toBe('API Failure');
        }
    });
});
