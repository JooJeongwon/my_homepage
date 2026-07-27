import { ContributionCalendar, createFallbackContributionCalendar } from '@/domain/models/contribution.model';
import { ContributionRepository } from '@/domain/ports/contribution.repository';
import { Result } from '@/domain/common/result';

export class GetContributionsUseCase {
    constructor(
        private readonly contributionRepository: ContributionRepository
    ) {}

    /**
     * 특정 사용자의 기여도 데이터를 조회해 반환합니다.
     * 예외 발생 시 SSG 빌드가 중단되지 않고 Fallback 데이터가 보장됩니다.
     * @param username GitHub 사용자명
     */
    async execute(username: string): Promise<ContributionCalendar> {
        try {
            return await this.contributionRepository.getContributions(username);
        } catch (error) {
            console.error('[GetContributionsUseCase] 기여도 데이터 로딩 실패. Fallback 반환:', error);
            return createFallbackContributionCalendar();
        }
    }

    /**
     * Result Pattern을 이용해 성공/실패 여부를 명시적으로 다룰 수 있는 메서드입니다.
     */
    async executeResult(username: string): Promise<Result<ContributionCalendar>> {
        return Result.wrapAsync(() => this.contributionRepository.getContributions(username));
    }
}

