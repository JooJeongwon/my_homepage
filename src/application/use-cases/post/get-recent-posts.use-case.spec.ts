import { describe, it, expect, vi } from 'vitest';
import { GetRecentPostsUseCase } from './get-recent-posts.use-case';
import { PostRepository } from '@/domain/ports/post.repository';
import { Post } from '@/domain/models/post.model';

// Mock Data (날짜 순서 섞어서 정의해봄 - 하지만 Repository가 이미 정렬해서 준다고 가정)
// Use Case 로직상 Repository 결과의 앞부분을 자르는지 확인
const MOCK_POSTS: Post[] = [
    { id: '5', slug: 'post-5', title: 'Post 5', date: '2023-01-05', description: 'Desc 5', tags: [] },
    { id: '4', slug: 'post-4', title: 'Post 4', date: '2023-01-04', description: 'Desc 4', tags: [] },
    { id: '3', slug: 'post-3', title: 'Post 3', date: '2023-01-03', description: 'Desc 3', tags: [] },
    { id: '2', slug: 'post-2', title: 'Post 2', date: '2023-01-02', description: 'Desc 2', tags: [] },
    { id: '1', slug: 'post-1', title: 'Post 1', date: '2023-01-01', description: 'Desc 1', tags: [] },
];

const mockPostRepository: PostRepository = {
    getAllPosts: vi.fn(async () => MOCK_POSTS),
    getPostBySlug: vi.fn(),
};

describe('GetRecentPostsUseCase', () => {
    it('should return specified number of recent posts', async () => {
        // Arrange
        const useCase = new GetRecentPostsUseCase(mockPostRepository);
        const limit = 3;

        // Act
        const result = await useCase.execute(limit);

        // Assert
        expect(mockPostRepository.getAllPosts).toHaveBeenCalled();
        expect(result).toHaveLength(limit);
        expect(result[0].id).toBe('5'); // 최신글
        expect(result[2].id).toBe('3');
    });

    it('should return all posts if limit is greater than total posts', async () => {
        // Arrange
        const useCase = new GetRecentPostsUseCase(mockPostRepository);
        const limit = 10;

        // Act
        const result = await useCase.execute(limit);

        // Assert
        expect(result).toHaveLength(MOCK_POSTS.length);
    });
});
