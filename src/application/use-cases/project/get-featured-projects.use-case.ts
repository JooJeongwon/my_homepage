import { Project } from '@/domain/models/project.model';
import { ProjectRepository } from '@/domain/ports/project.repository';

export class GetFeaturedProjectsUseCase {
    constructor(private readonly projectRepository: ProjectRepository) {}

    async execute(limit: number = 2): Promise<Project[]> {
        const allProjects = await this.projectRepository.getAllProjects();
        return allProjects.slice(0, limit);
    }
}
