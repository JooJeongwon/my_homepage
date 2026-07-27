import { describe, it, expect } from 'vitest';
import { MdxPostRepository } from '@/adapters/outbound/mdx/mdx.repository';

describe('MdxPostRepository Failure Resiliency', () => {
    it('getAllPosts 호출 시 예외를 던지지 않고 Post 배열을 반환해야 한다.', async () => {
        const repo = new MdxPostRepository();
        const posts = await repo.getAllPosts();

        expect(Array.isArray(posts)).toBe(true);
    });

    it('존재하지 않는 slug로 getPostBySlug 조회 시 null을 반환하고 throw하지 않아야 한다.', async () => {
        const repo = new MdxPostRepository();
        const post = await repo.getPostBySlug('non-existent-slug-123456');

        expect(post).toBeNull();
    });
});
