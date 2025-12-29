import { Project } from '@/domain/models/project.model';
import { ProjectRepository } from '@/domain/ports/project.repository';

export class GetProjectDetailUseCase {
    constructor(private readonly projectRepository: ProjectRepository) {}

    async execute(slug: string): Promise<Project | null> {
        return await this.projectRepository.getProjectBySlug(slug);
    }
}
