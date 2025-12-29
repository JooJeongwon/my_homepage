import { Project } from '@/domain/models/project.model';
import { ProjectRepository } from '@/domain/ports/project.repository';

export class GetAllProjectsUseCase {
    constructor(private readonly projectRepository: ProjectRepository) {}

    async execute(): Promise<Project[]> {
        return await this.projectRepository.getAllProjects();
    }
}
