import { Post } from '@/domain/models/post.model';

export interface PostRepository {
    // 모든 글 목록 가져오기
    getAllPosts(): Promise<Post[]>;

    // 특정 글 하나 가져오기 (없으면 null)
    getPostBySlug(slug: string): Promise<Post | null>;
}