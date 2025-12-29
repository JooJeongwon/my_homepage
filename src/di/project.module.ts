import { ProjectRepository } from '@/domain/ports/project.repository';
import { ProjectMdxRepository } from '@/adapters/outbound/mdx/project-mdx.repository';
import { GetAllProjectsUseCase } from '@/application/use-cases/project/get-all-projects.use-case';
import { GetProjectDetailUseCase } from '@/application/use-cases/project/get-project-detail.use-case';

let projectRepositoryInstance: ProjectRepository | null = null;

export function getProjectRepository(): ProjectRepository {
    if (projectRepositoryInstance) {
        return projectRepositoryInstance;
    }
    projectRepositoryInstance = new ProjectMdxRepository();
    return projectRepositoryInstance;
}

export function getGetAllProjectsUseCase(): GetAllProjectsUseCase {
    return new GetAllProjectsUseCase(getProjectRepository());
}

export function getGetProjectDetailUseCase(): GetProjectDetailUseCase {
    return new GetProjectDetailUseCase(getProjectRepository());
}
