import { describe, it, expect, vi } from 'vitest';
import { GetPostDetailUseCase } from './get-post-detail.use-case';
import { PostRepository } from '@/domain/ports/post.repository';
import { Post } from '@/domain/models/post.model';

const MOCK_POST: Post = { 
    id: '1', slug: 'target-post', title: 'Target Post', date: '2023-01-01', description: 'Desc', tags: [] 
};

const mockPostRepository: PostRepository = {
    getAllPosts: vi.fn(),
    getPostBySlug: vi.fn(async (slug: string) => {
        if (slug === 'target-post') return MOCK_POST;
        return null;
    }),
};

describe('GetPostDetailUseCase', () => {
    it('should return the post if found', async () => {
        // Arrange
        const useCase = new GetPostDetailUseCase(mockPostRepository);

        // Act
        const result = await useCase.execute('target-post');

        // Assert
        expect(mockPostRepository.getPostBySlug).toHaveBeenCalledWith('target-post');
        expect(result).toEqual(MOCK_POST);
    });

    it('should return null if post is not found', async () => {
        // Arrange
        const useCase = new GetPostDetailUseCase(mockPostRepository);

        // Act
        const result = await useCase.execute('unknown-post');

        // Assert
        expect(result).toBeNull();
    });
});
