import { Project } from '@/domain/models/project.model';
import { ProjectRepository } from '@/domain/ports/project.repository';
import { Result } from '@/domain/common/result';

export class GetAllProjectsUseCase {
    constructor(private readonly projectRepository: ProjectRepository) {}

    async execute(): Promise<Project[]> {
        try {
            return await this.projectRepository.getAllProjects();
        } catch (error) {
            console.error('[GetAllProjectsUseCase] 프로젝트 목록 로딩 실패:', error);
            return [];
        }
    }

    async executeResult(): Promise<Result<Project[]>> {
        return Result.wrapAsync(() => this.projectRepository.getAllProjects());
    }
}

