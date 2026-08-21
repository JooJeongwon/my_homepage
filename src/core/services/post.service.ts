import { Post } from '@/core/models/post.model';

export interface IPostRepository {
    getAllPosts(): Promise<Post[]>;
    getPostBySlug(slug: string): Promise<Post | null>;
}

import { filterPosts } from '@/lib/search';

export { filterPosts };

export class PostService {
    constructor(private readonly postRepository: IPostRepository) {}

    /**
     * 모든 블로그 포스트 목록을 조회합니다.
     */
    async getAllPosts(): Promise<Post[]> {
        try {
            return await this.postRepository.getAllPosts();
        } catch (error) {
            console.error('[PostService] 포스트 목록 로딩 실패:', error);
            return [];
        }
    }

    /**
     * 특정 slug에 해당하는 포스트 상세 정보를 조회합니다.
     */
    async getPostBySlug(slug: string): Promise<Post | null> {
        try {
            return await this.postRepository.getPostBySlug(slug);
        } catch (error) {
            console.error(`[PostService] 포스트 상세 조회 실패 (${slug}):`, error);
            return null;
        }
    }

    /**
     * 최신 포스트 목록을 지정된 개수만큼 조회합니다.
     */
    async getRecentPosts(limit: number = 4): Promise<Post[]> {
        const posts = await this.getAllPosts();
        return posts.slice(0, limit);
    }

    /**
     * 포스트 필터링 위임 메서드
     */
    filterPosts(posts: Post[], query: string): Post[] {
        return filterPosts(posts, query);
    }
}
