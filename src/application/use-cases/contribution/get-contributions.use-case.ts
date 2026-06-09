import { ContributionCalendar } from '@/domain/models/contribution.model';
import { ContributionRepository } from '@/domain/ports/contribution.repository';

export class GetContributionsUseCase {
    constructor(
        private readonly contributionRepository: ContributionRepository
    ) {}

    /**
     * 특정 사용자의 기여도 데이터를 조회해 반환합니다.
     * @param username GitHub 사용자명
     */
    async execute(username: string): Promise<ContributionCalendar> {
        return this.contributionRepository.getContributions(username);
    }
}
