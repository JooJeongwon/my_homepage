import { describe, it, expect } from 'vitest';
import { FilterPostsUseCase } from './filter-posts.use-case';
import { Post } from '@/domain/models/post.model';

const MOCK_POSTS: Post[] = [
    { id: '1', slug: 'post-1', title: 'React Guide', date: '2023-01-01', description: 'Learn React.js step by step', tags: ['react', 'frontend'], content: 'This is a detailed post about React and Javascript.' },
    { id: '2', slug: 'post-2', title: 'Hexagonal Architecture', date: '2023-01-02', description: 'Clean architecture patterns', tags: ['architecture', 'design-pattern'], content: 'Separation of concerns is key.' },
    { id: '3', slug: 'post-3', title: 'Tailwind CSS Tips', date: '2023-01-03', description: 'Utility-first CSS styling', tags: ['css', 'tailwind'], content: 'Speed up UI development with Tailwind.' },
];

describe('FilterPostsUseCase', () => {
    const useCase = new FilterPostsUseCase();

    it('should return all posts if query is empty or whitespace', () => {
        expect(useCase.execute(MOCK_POSTS, '')).toEqual(MOCK_POSTS);
        expect(useCase.execute(MOCK_POSTS, '   ')).toEqual(MOCK_POSTS);
    });

    it('should filter posts by title', () => {
        const result = useCase.execute(MOCK_POSTS, 'react');
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe('1');
    });

    it('should ignore incomplete Korean jamo at the end of query to prevent flashing no-results UI', () => {
        const result = useCase.execute(MOCK_POSTS, 'reactㅇ');
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe('1');
    });

    it('should filter posts by description (case-insensitive)', () => {
        const result = useCase.execute(MOCK_POSTS, 'CLEAN');
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe('2');
    });

    it('should filter posts by tags', () => {
        const result = useCase.execute(MOCK_POSTS, 'tailwind');
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe('3');
    });

    it('should filter posts by content', () => {
        const result = useCase.execute(MOCK_POSTS, 'Javascript');
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe('1');
    });

    it('should return empty list if nothing matches', () => {
        const result = useCase.execute(MOCK_POSTS, 'python');
        expect(result).toHaveLength(0);
    });
});
