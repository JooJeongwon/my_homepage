import { describe, it, expect, vi, afterEach } from 'vitest';
import { MdxPostRepository } from '@/adapters/outbound/mdx/mdx.repository';
import fs from 'fs';

describe('MdxPostRepository (FIRST Principle Infrastructure Adapter Test)', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('getAllPosts 호출 시 예외를 던지지 않고 Post 배열을 반환해야 한다.', async () => {
        const repo = new MdxPostRepository();
        const posts = await repo.getAllPosts();

        expect(Array.isArray(posts)).toBe(true);
        if (posts.length > 0) {
            expect(posts[0]).toHaveProperty('id');
            expect(posts[0]).toHaveProperty('slug');
            expect(posts[0]).toHaveProperty('title');
            expect(posts[0]).toHaveProperty('readingTime');
            expect(typeof posts[0].readingTime).toBe('number');
        }
    });

    it('getAllPosts는 최신 날짜 순(내림차순)으로 글을 정렬해야 한다.', async () => {
        const repo = new MdxPostRepository();
        const posts = await repo.getAllPosts();

        if (posts.length >= 2) {
            const time1 = new Date(posts[0].date).getTime();
            const time2 = new Date(posts[1].date).getTime();
            expect(time1).toBeGreaterThanOrEqual(time2);
        }
    });

    it('존재하지 않는 slug로 getPostBySlug 조회 시 null을 반환하고 throw하지 않아야 한다.', async () => {
        const repo = new MdxPostRepository();
        const post = await repo.getPostBySlug('non-existent-slug-123456');

        expect(post).toBeNull();
    });

    it('존재하는 slug 조회 시 본문 content가 포함된 Post 객체를 반환해야 한다.', async () => {
        const repo = new MdxPostRepository();
        const posts = await repo.getAllPosts();

        if (posts.length > 0) {
            const slug = posts[0].slug;
            const postDetail = await repo.getPostBySlug(slug);

            expect(postDetail).not.toBeNull();
            expect(postDetail?.slug).toBe(slug);
            expect(postDetail?.content).toBeDefined();
        }
    });

    it('content 디렉터리가 존재하지 않는 경우 빈 배열을 반환하고 안심하게 fallback되어야 한다.', async () => {
        vi.spyOn(fs, 'existsSync').mockReturnValue(false);

        const repo = new MdxPostRepository();
        const posts = await repo.getAllPosts();

        expect(posts).toEqual([]);
    });

    it('MDX 파싱 중 에러 발생 시 해당 포스트를 제외(null)하고 빈 배열을 반환해야 한다.', async () => {
        vi.spyOn(fs, 'existsSync').mockReturnValue(true);
        vi.spyOn(fs, 'readdirSync').mockReturnValue(['invalid.mdx' as unknown as import('fs').Dirent]);
        vi.spyOn(fs, 'readFileSync').mockImplementation(() => {
            throw new Error('File read error');
        });

        const repo = new MdxPostRepository();
        const posts = await repo.getAllPosts();

        expect(posts).toEqual([]);
    });
});
