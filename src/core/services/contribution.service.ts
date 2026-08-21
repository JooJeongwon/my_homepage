import { ContributionCalendar, createFallbackContributionCalendar } from '@/core/models/contribution.model';

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
