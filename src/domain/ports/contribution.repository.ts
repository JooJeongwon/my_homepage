import { ContributionCalendar } from '../models/contribution.model';

export interface ContributionRepository {
    /**
     * 특정 GitHub 유저의 기여도 잔디 데이터를 조회합니다.
     * @param username GitHub 사용자명
     */
    getContributions(username: string): Promise<ContributionCalendar>;
}
