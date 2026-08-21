import { z } from 'zod';
import { ContributionCalendar } from '@/core/models/contribution.model';

export interface IContributionRepository {
    getContributions(username: string): Promise<ContributionCalendar>;
}

// GitHub API 응답 데이터 검증을 위한 Zod 스키마 정의
const GithubContributionDaySchema = z.object({
    date: z.string(),
    contributionCount: z.number(),
    contributionLevel: z.string(),
});

const GithubContributionWeekSchema = z.object({
    contributionDays: z.array(GithubContributionDaySchema),
});

const GithubCalendarSchema = z.object({
    totalContributions: z.number(),
    weeks: z.array(GithubContributionWeekSchema),
});

const GithubGraphQLResponseSchema = z.object({
    data: z.object({
        user: z.object({
            contributionsCollection: z.object({
                contributionCalendar: GithubCalendarSchema,
            }),
        }).nullable(),
    }).nullable().optional(),
    errors: z.array(z.object({
        message: z.string(),
    })).optional(),
});

export class GithubGraphqlRepository implements IContributionRepository {
    private readonly query = `
        query($username: String!) {
            user(login: $username) {
                contributionsCollection {
                    contributionCalendar {
                        totalContributions
                        weeks {
                            contributionDays {
                                date
                                contributionCount
                                contributionLevel
                            }
                        }
                    }
                }
            }
        }
    `;

    constructor(private readonly token: string) {}

    async getContributions(username: string): Promise<ContributionCalendar> {
        if (!this.token) {
            throw new Error('GitHub Token이 설정되지 않았습니다.');
        }

        const response = await fetch('https://api.github.com/graphql', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json',
                'User-Agent': 'cloudflare-pages-function-jw-homepage'
            },
            body: JSON.stringify({
                query: this.query,
                variables: { username }
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`GitHub GraphQL API 호출 실패. Status: ${response.status}, Details: ${errorText}`);
        }

        const json = await response.json();

        // Zod를 활용한 API 응답 스펙 검증
        const parsed = GithubGraphQLResponseSchema.safeParse(json);
        if (!parsed.success) {
            console.error('[GithubGraphqlRepository] 응답 파싱 실패:', parsed.error.format());
            throw new Error('GitHub 데이터 처리에 실패했습니다. (스키마 검증 에러)');
        }

        const resultData = parsed.data;

        if (resultData.errors && resultData.errors.length > 0) {
            console.error('[GithubGraphqlRepository] GraphQL 에러 발생:', resultData.errors);
            throw new Error('GitHub API 쿼리 오류가 발생했습니다.');
        }

        const calendar = resultData.data?.user?.contributionsCollection?.contributionCalendar;
        if (!calendar) {
            console.error('[GithubGraphqlRepository] calendar 데이터를 찾을 수 없음:', resultData);
            throw new Error('사용자 기여 정보를 찾을 수 없습니다.');
        }

        // GitHub contributionLevel 문자열 값을 0~4 정수로 매핑
        const mapLevel = (levelStr: string): number => {
            switch (levelStr) {
                case 'FIRST_QUARTILE': return 1;
                case 'SECOND_QUARTILE': return 2;
                case 'THIRD_QUARTILE': return 3;
                case 'FOURTH_QUARTILE': return 4;
                case 'NONE':
                default:
                    return 0;
            }
        };

        return {
            totalContributions: calendar.totalContributions,
            weeks: calendar.weeks.map((week) => ({
                contributionDays: week.contributionDays.map((day) => ({
                    date: day.date,
                    count: day.contributionCount,
                    level: mapLevel(day.contributionLevel)
                }))
            }))
        };
    }
}

import { ContributionService } from '@/core/services/contribution.service';

/**
 * GitHub Token을 주입받아 GraphQL을 직접 호출하는 서버리스용 서비스 팩토리
 */
export function createServerContributionService(token: string): ContributionService {
    return new ContributionService(new GithubGraphqlRepository(token));
}
