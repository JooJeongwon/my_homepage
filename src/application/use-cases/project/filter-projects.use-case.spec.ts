import { describe, it, expect } from 'vitest';
import { FilterProjectsUseCase } from './filter-projects.use-case';
import { Project } from '@/domain/models/project.model';

const MOCK_PROJECTS: Project[] = [
    {
        id: '1',
        slug: 'project-1',
        title: 'JW Dev Platform',
        date: '2023.01 - 2023.03',
        description: 'Next.js based personal website with Hexagonal Architecture',
        tags: ['nextjs', 'typescript', 'architecture'],
        content: 'Mainly used React 19 and Tailwind CSS v4.'
    },
    {
        id: '2',
        slug: 'project-2',
        title: 'Movie Recommendation App',
        date: '2023.04 - 2023.06',
        description: 'AI recommendation service for movie lovers',
        tags: ['python', 'ai', 'nextjs'],
        content: 'Collaborated with movie recommendation systems.'
    }
];

describe('FilterProjectsUseCase', () => {
    const useCase = new FilterProjectsUseCase();

    it('should return all projects if query is empty', () => {
        expect(useCase.execute(MOCK_PROJECTS, '')).toEqual(MOCK_PROJECTS);
    });

    it('should filter projects by title', () => {
        const result = useCase.execute(MOCK_PROJECTS, 'Movie');
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe('2');
    });

    it('should ignore incomplete Korean jamo at the end of query to prevent flashing no-results UI', () => {
        const result = useCase.execute(MOCK_PROJECTS, 'Movieㄹ');
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe('2');
    });

    it('should filter projects by description', () => {
        const result = useCase.execute(MOCK_PROJECTS, 'hexagonal');
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe('1');
    });

    it('should filter projects by tags', () => {
        const result = useCase.execute(MOCK_PROJECTS, 'typescript');
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe('1');
    });

    it('should filter projects by content', () => {
        const result = useCase.execute(MOCK_PROJECTS, 'Tailwind');
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe('1');
    });

    it('should return empty list if no matches found', () => {
        const result = useCase.execute(MOCK_PROJECTS, 'rust');
        expect(result).toHaveLength(0);
    });
});
