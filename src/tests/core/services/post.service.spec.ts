import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { PostService, IPostRepository } from '@/core/services/post.service';
import { Post } from '@/core/models/post.model';

describe('PostService', () => {
    let mockRepo: IPostRepository;
    let service: PostService;

    const samplePosts: Post[] = [
        {
            id: '1',
            slug: 'post-1',
            title: '첫 번째 포스트',
            date: '2026-03-01T00:00:00.000Z',
            description: '설명 1',
            tags: ['React'],
            content: '본문 1'
        },
        {
            id: '2',
            slug: 'post-2',
            title: '두 번째 포스트',
            date: '2026-02-15T00:00:00.000Z',
            description: '설명 2',
            tags: ['Next.js'],
            content: '본문 2'
        },
        {
            id: '3',
            slug: 'post-3',
            title: '세 번째 포스트',
            date: '2026-01-10T00:00:00.000Z',
            description: '설명 3',
            tags: ['TypeScript'],
            content: '본문 3'
        }
    ];

    beforeEach(() => {
        mockRepo = {
            getAllPosts: vi.fn().mockResolvedValue(samplePosts),
            getPostBySlug: vi.fn().mockImplementation((slug: string) => {
                const found = samplePosts.find((p) => p.slug === slug);
                return Promise.resolve(found || null);
            })
        };
        service = new PostService(mockRepo);
        vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('getAllPosts', () => {
        it('전체 포스트 목록을 반환한다', async () => {
            const posts = await service.getAllPosts();
            expect(posts).toEqual(samplePosts);
            expect(mockRepo.getAllPosts).toHaveBeenCalledTimes(1);
        });

        it('레포지토리 실패 시 빈 배열을 반환한다', async () => {
            mockRepo.getAllPosts = vi.fn().mockRejectedValue(new Error('I/O error'));
            const posts = await service.getAllPosts();
            expect(posts).toEqual([]);
        });
    });

    describe('getPostBySlug', () => {
        it('존재하는 slug 조회 시 해당 포스트를 반환한다', async () => {
            const post = await service.getPostBySlug('post-2');
            expect(post?.title).toBe('두 번째 포스트');
            expect(mockRepo.getPostBySlug).toHaveBeenCalledWith('post-2');
        });

        it('존재하지 않는 slug 조회 시 null을 반환한다', async () => {
            const post = await service.getPostBySlug('unknown');
            expect(post).toBeNull();
        });

        it('레포지토리 실패 시 null을 반환한다', async () => {
            mockRepo.getPostBySlug = vi.fn().mockRejectedValue(new Error('Read error'));
            const post = await service.getPostBySlug('post-1');
            expect(post).toBeNull();
        });
    });

    describe('getRecentPosts', () => {
        it('지정한 limit 개수만큼 최신 포스트를 반환한다 (기본값 4개)', async () => {
            const recent = await service.getRecentPosts(2);
            expect(recent).toHaveLength(2);
            expect(recent[0].slug).toBe('post-1');
            expect(recent[1].slug).toBe('post-2');
        });
    });

    describe('filterPosts', () => {
        it('검색 필터 유틸을 통해 검색된 포스트를 반환한다', () => {
            const result = service.filterPosts(samplePosts, 'Next.js');
            expect(result).toHaveLength(1);
            expect(result[0].slug).toBe('post-2');
        });
    });
});
