import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PostService, IPostRepository } from '@/core/services/post.service';
import { Post } from '@/core/models/post.model';

describe('PostService Domain Service Unit Tests', () => {
    let mockPostRepository: IPostRepository;
    let postService: PostService;

    const mockPosts: Post[] = [
        {
            id: '1',
            slug: 'first-post',
            title: '첫 번째 포스트 - React 기초 가이드',
            date: '2026-03-01T00:00:00.000Z',
            description: '리액트 시작하기 설명글',
            tags: ['React', 'Frontend'],
            thumbnail: '/thumb1.png',
            content: '리액트 컴포넌트 기초 내용 본문입니다.',
            readingTime: 2
        },
        {
            id: '2',
            slug: 'second-post',
            title: '두 번째 포스트 - Next.js 아키텍처',
            date: '2026-02-15T00:00:00.000Z',
            description: '클린 아키텍처와 Next.js 16',
            tags: ['Next.js', 'Clean Architecture'],
            content: '클린 아키텍처 설계와 관련된 상세 본문입니다.',
            readingTime: 4
        },
        {
            id: '3',
            slug: 'third-post',
            title: '세 번째 포스트 - TypeScript 심화',
            date: '2026-01-10T00:00:00.000Z',
            description: '타입 안전성을 위한 고급 기법',
            tags: ['TypeScript'],
            content: '조건부 타입 및 템플릿 리터럴 타입 가이드',
            readingTime: 3
        },
        {
            id: '4',
            slug: 'fourth-post',
            title: '네 번째 포스트 - CSS Subgrid 활용법',
            date: '2025-12-01T00:00:00.000Z',
            description: '모던 CSS 서브그리드 레이아웃',
            tags: ['CSS', 'Tailwind'],
            content: 'Subgrid를 활용한 카드 높이 맞춤 기법',
            readingTime: 1
        },
        {
            id: '5',
            slug: 'fifth-post',
            title: '다섯 번째 포스트 - Tailwind v4 마이그레이션',
            date: '2025-11-01T00:00:00.000Z',
            description: 'Tailwind CSS v4 신규 기능',
            tags: ['Tailwind', 'CSS'],
            content: 'v4 전환 가이드',
            readingTime: 2
        }
    ];

    beforeEach(() => {
        mockPostRepository = {
            getAllPosts: vi.fn().mockResolvedValue(mockPosts),
            getPostBySlug: vi.fn().mockImplementation((slug: string) => {
                const found = mockPosts.find((p) => p.slug === slug);
                return Promise.resolve(found || null);
            })
        };
        postService = new PostService(mockPostRepository);
    });

    describe('getAllPosts', () => {
        it('모든 포스트 목록을 정상적으로 반환해야 한다', async () => {
            const posts = await postService.getAllPosts();
            expect(posts).toHaveLength(5);
            expect(posts[0].slug).toBe('first-post');
            expect(mockPostRepository.getAllPosts).toHaveBeenCalledTimes(1);
        });

        it('레포지토리에서 예외가 발생할 경우 빈 배열을 반환해야 한다', async () => {
            const errorRepo: IPostRepository = {
                getAllPosts: vi.fn().mockRejectedValue(new Error('Disk failure')),
                getPostBySlug: vi.fn().mockRejectedValue(new Error('Disk failure'))
            };
            const errorService = new PostService(errorRepo);
            const posts = await errorService.getAllPosts();
            expect(posts).toEqual([]);
        });
    });

    describe('getPostBySlug', () => {
        it('존재하는 slug로 조회 시 해당 포스트를 반환해야 한다', async () => {
            const post = await postService.getPostBySlug('second-post');
            expect(post).not.toBeNull();
            expect(post?.title).toBe('두 번째 포스트 - Next.js 아키텍처');
            expect(mockPostRepository.getPostBySlug).toHaveBeenCalledWith('second-post');
        });

        it('존재하지 않는 slug로 조회 시 null을 반환해야 한다', async () => {
            const post = await postService.getPostBySlug('non-existing');
            expect(post).toBeNull();
        });

        it('레포지토리 에러 발생 시 null을 반환해야 한다', async () => {
            const errorRepo: IPostRepository = {
                getAllPosts: vi.fn().mockRejectedValue(new Error('Read error')),
                getPostBySlug: vi.fn().mockRejectedValue(new Error('Read error'))
            };
            const errorService = new PostService(errorRepo);
            const post = await errorService.getPostBySlug('first-post');
            expect(post).toBeNull();
        });
    });

    describe('getRecentPosts', () => {
        it('최신 포스트를 지정된 개수(기본값 4개)만큼 반환해야 한다', async () => {
            const recent = await postService.getRecentPosts();
            expect(recent).toHaveLength(4);
            expect(recent[0].slug).toBe('first-post');
            expect(recent[3].slug).toBe('fourth-post');
        });

        it('지정된 limit 파라미터 개수만큼 반환해야 한다', async () => {
            const recent = await postService.getRecentPosts(2);
            expect(recent).toHaveLength(2);
            expect(recent[0].slug).toBe('first-post');
            expect(recent[1].slug).toBe('second-post');
        });
    });

    describe('filterPosts (IME 및 다차원 검색)', () => {
        it('검색어가 비어있거나 공백인 경우 원본 포스트 배열을 그대로 반환해야 한다', () => {
            expect(postService.filterPosts(mockPosts, '')).toEqual(mockPosts);
            expect(postService.filterPosts(mockPosts, '   ')).toEqual(mockPosts);
        });

        it('제목(title)에 포함된 키워드로 대소문자 무관하게 검색할 수 있어야 한다', () => {
            const result = postService.filterPosts(mockPosts, 'typescript');
            expect(result).toHaveLength(1);
            expect(result[0].slug).toBe('third-post');
        });

        it('설명(description)에 포함된 키워드로 검색할 수 있어야 한다', () => {
            const result = postService.filterPosts(mockPosts, '설명글');
            expect(result).toHaveLength(1);
            expect(result[0].slug).toBe('first-post');
        });

        it('태그(tags)에 포함된 키워드로 검색할 수 있어야 한다', () => {
            const result = postService.filterPosts(mockPosts, 'Architecture');
            expect(result).toHaveLength(1);
            expect(result[0].slug).toBe('second-post');
        });

        it('본문(content)에 포함된 키워드로 검색할 수 있어야 한다', () => {
            const result = postService.filterPosts(mockPosts, '조건부 타입');
            expect(result).toHaveLength(1);
            expect(result[0].slug).toBe('third-post');
        });

        it('한글 입력기(IME) 조합 중 끝에 미완성 자모가 붙었을 때(예: "리액트ㄱ") 보정되어 검색되어야 한다', () => {
            const result = postService.filterPosts(mockPosts, '리액트ㄱ');
            expect(result).toHaveLength(1);
            expect(result[0].slug).toBe('first-post');
        });

        it('매칭되는 포스트가 없으면 빈 배열을 반환해야 한다', () => {
            const result = postService.filterPosts(mockPosts, '없는검색어');
            expect(result).toEqual([]);
        });
    });
});
