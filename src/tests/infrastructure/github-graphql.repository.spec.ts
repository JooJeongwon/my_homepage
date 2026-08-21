import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { GithubGraphqlRepository } from '@/infrastructure/github/github-graphql.repository';

describe('GithubGraphqlRepository', () => {
    const originalFetch = global.fetch;

    beforeEach(() => {
        vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        global.fetch = originalFetch;
        vi.restoreAllMocks();
    });

    it('토큰이 비어있는 경우 예외를 발생시킨다', async () => {
        const repo = new GithubGraphqlRepository('');
        await expect(repo.getContributions('testuser')).rejects.toThrow('GitHub Token이 설정되지 않았습니다.');
    });

    it('GraphQL API HTTP 500 에러 시 예외를 발생시킨다', async () => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: false,
            status: 500,
            text: async () => 'Internal Server Error'
        } as Response);

        const repo = new GithubGraphqlRepository('fake-token');
        await expect(repo.getContributions('testuser')).rejects.toThrow('GitHub GraphQL API 호출 실패');
    });

    it('네트워크 fetch 실패 시 예외를 전파한다', async () => {
        global.fetch = vi.fn().mockRejectedValue(new Error('Network Connection Refused'));

        const repo = new GithubGraphqlRepository('fake-token');
        await expect(repo.getContributions('testuser')).rejects.toThrow('Network Connection Refused');
    });

    it('정상적인 GraphQL 응답을 ContributionCalendar 모델로 파싱 및 레벨 매핑한다', async () => {
        const mockResponse = {
            data: {
                user: {
                    contributionsCollection: {
                        contributionCalendar: {
                            totalContributions: 5,
                            weeks: [
                                {
                                    contributionDays: [
                                        { date: '2026-01-01', contributionCount: 0, contributionLevel: 'NONE' },
                                        { date: '2026-01-02', contributionCount: 1, contributionLevel: 'FIRST_QUARTILE' },
                                        { date: '2026-01-03', contributionCount: 3, contributionLevel: 'SECOND_QUARTILE' },
                                        { date: '2026-01-04', contributionCount: 5, contributionLevel: 'THIRD_QUARTILE' },
                                        { date: '2026-01-05', contributionCount: 10, contributionLevel: 'FOURTH_QUARTILE' },
                                    ]
                                }
                            ]
                        }
                    }
                }
            }
        };

        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => mockResponse
        } as Response);

        const repo = new GithubGraphqlRepository('valid-token');
        const calendar = await repo.getContributions('testuser');

        expect(calendar.totalContributions).toBe(5);
        expect(calendar.weeks).toHaveLength(1);
        const days = calendar.weeks[0].contributionDays;
        expect(days.map((d) => d.level)).toEqual([0, 1, 2, 3, 4]);
    });

    it('GraphQL 응답 내 errors 필드가 포함되어 있을 경우 예외를 던진다', async () => {
        const mockErrorResponse = {
            data: null,
            errors: [{ message: 'Could not resolve to a User with the username of invaliduser.' }]
        };

        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => mockErrorResponse
        } as Response);

        const repo = new GithubGraphqlRepository('valid-token');
        await expect(repo.getContributions('invaliduser')).rejects.toThrow('GitHub API 쿼리 오류가 발생했습니다.');
    });

    it('잘못된 스키마 형식의 응답 수신 시 스키마 검증 예외를 던진다', async () => {
        const mockInvalidSchemaResponse = {
            data: {
                user: {
                    contributionsCollection: {
                        invalidCalendarStructure: {}
                    }
                }
            }
        };

        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => mockInvalidSchemaResponse
        } as Response);

        const repo = new GithubGraphqlRepository('valid-token');
        await expect(repo.getContributions('testuser')).rejects.toThrow('GitHub 데이터 처리에 실패했습니다. (스키마 검증 에러)');
    });
});
