import { ContributionCalendar, ContributionWeek, ContributionDay } from '@/core/models/contribution.model';

/**
 * 외부 API 실패 시 SSG 빌드 중단 없이 안정적으로 기본 UI를 렌더링하기 위한 Fallback Calendar 생성기
 */
export function createFallbackContributionCalendar(): ContributionCalendar {
    const weeks: ContributionWeek[] = [];
    const today = new Date();

    // 53주 전 일요일부터 시작
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - (52 * 7 + today.getDay()));

    const currentDate = new Date(startDate);

    for (let w = 0; w < 53; w++) {
        const contributionDays: ContributionDay[] = [];
        for (let d = 0; d < 7; d++) {
            const dateStr = currentDate.toISOString().split('T')[0];
            contributionDays.push({
                date: dateStr,
                count: 0,
                level: 0
            });
            currentDate.setDate(currentDate.getDate() + 1);
        }
        weeks.push({ contributionDays });
    }

    return {
        totalContributions: 0,
        weeks
    };
}

export interface IContributionRepository {
    getContributions(username: string): Promise<ContributionCalendar>;
}

export class ContributionService {
    constructor(private readonly contributionRepository: IContributionRepository) {}

    /**
     * 특정 사용자의 기여도 데이터를 조회해 반환합니다.
     * 에러 발생 시 Fallback 데이터를 반환하여 UI가 중단되지 않도록 방어합니다.
     */
    async getContributions(username: string): Promise<ContributionCalendar> {
        try {
            return await this.contributionRepository.getContributions(username);
        } catch (error) {
            console.error('[ContributionService] 기여도 데이터 로딩 실패. Fallback 반환:', error);
            return createFallbackContributionCalendar();
        }
    }

    /**
     * 기여도 데이터를 조회하되 실패 시 예외를 던져 상위 계층(Cloudflare SWR/캐시)에서 에러를 제어할 수 있도록 합니다.
     */
    async getContributionsStrict(username: string): Promise<ContributionCalendar> {
        return await this.contributionRepository.getContributions(username);
    }
}
