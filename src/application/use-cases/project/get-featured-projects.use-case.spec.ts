import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetFeaturedProjectsUseCase } from './get-featured-projects.use-case';
import { ProjectRepository } from '@/domain/ports/project.repository';
import { Project } from '@/domain/models/project.model';

const MOCK_PROJECTS: Project[] = [
    { id: '3', slug: 'project-3', title: 'Project 3', date: '2023.07 - 2023.12', description: 'Desc 3', tags: [] },
    { id: '2', slug: 'project-2', title: 'Project 2', date: '2023.01 - 2023.06', description: 'Desc 2', tags: [] },
    { id: '1', slug: 'project-1', title: 'Project 1', date: '2022.06 - 2022.12', description: 'Desc 1', tags: [] },
];

describe('GetFeaturedProjectsUseCase', () => {
    let mockProjectRepository: ProjectRepository;

    beforeEach(() => {
        mockProjectRepository = {
            getAllProjects: vi.fn(async () => MOCK_PROJECTS),
            getProjectBySlug: vi.fn(),
        };
    });

    it('should return specified number of featured projects', async () => {
        const useCase = new GetFeaturedProjectsUseCase(mockProjectRepository);
        const limit = 2;

        const result = await useCase.execute(limit);

        expect(mockProjectRepository.getAllProjects).toHaveBeenCalled();
        expect(result).toHaveLength(limit);
        expect(result[0].id).toBe('3');
        expect(result[1].id).toBe('2');
    });

    it('should return all projects if limit is greater than total projects', async () => {
        const useCase = new GetFeaturedProjectsUseCase(mockProjectRepository);
        const limit = 5;

        const result = await useCase.execute(limit);

        expect(result).toHaveLength(MOCK_PROJECTS.length);
    });
});
