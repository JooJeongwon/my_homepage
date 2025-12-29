import { describe, it, expect, vi } from 'vitest';
import { GetAllPostsUseCase } from './get-all-posts.use-case';
import { PostRepository } from '@/domain/ports/post.repository';
import { Post } from '@/domain/models/post.model';

// Mock Data
const MOCK_POSTS: Post[] = [
    { id: '1', slug: 'post-1', title: 'Post 1', date: '2023-01-01', description: 'Desc 1', tags: [] },
    { id: '2', slug: 'post-2', title: 'Post 2', date: '2023-01-02', description: 'Desc 2', tags: [] },
];

// Mock Repository
const mockPostRepository: PostRepository = {
    getAllPosts: vi.fn(async () => MOCK_POSTS),
    getPostBySlug: vi.fn(),
};

describe('GetAllPostsUseCase', () => {
    it('should return all posts from the repository', async () => {
        // Arrange
        const useCase = new GetAllPostsUseCase(mockPostRepository);

        // Act
        const result = await useCase.execute();

        // Assert
        expect(mockPostRepository.getAllPosts).toHaveBeenCalled();
        expect(result).toHaveLength(2);
        expect(result).toEqual(MOCK_POSTS);
    });
});
