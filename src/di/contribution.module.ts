import { ContributionRepository } from '../domain/ports/contribution.repository';
import { ContributionMockRepository } from '../adapters/outbound/contribution/contribution-mock.repository';
import { ContributionApiRepository } from '../adapters/outbound/contribution/contribution-api.repository';
import { GithubGraphqlRepository } from '../adapters/outbound/contribution/github-graphql.repository';
import { GetContributionsUseCase } from '@/application/use-cases/contribution/get-contributions.use-case';

let contributionRepositoryInstance: ContributionRepository | null = null;

export function getContributionRepository(): ContributionRepository {
    if (contributionRepositoryInstance) {
        return contributionRepositoryInstance;
    }

    // 개발 모드와 배포 모드를 분기하여 어댑터 구현체 결정
    if (process.env.NODE_ENV === 'development') {
        contributionRepositoryInstance = new ContributionMockRepository();
    } else {
        contributionRepositoryInstance = new ContributionApiRepository();
    }

    return contributionRepositoryInstance;
}

export function getGetContributionsUseCase(): GetContributionsUseCase {
    return new GetContributionsUseCase(getContributionRepository());
}

// 서버사이드(Cloudflare Pages Function 등) 환경에서 호출할 수 있는 UseCase 팩토리
export function getGithubContributionsUseCase(token: string): GetContributionsUseCase {
    const repository = new GithubGraphqlRepository(token);
    return new GetContributionsUseCase(repository);
}

