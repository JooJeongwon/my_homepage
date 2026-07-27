import { Post } from '@/domain/models/post.model';
import { PostRepository } from '@/domain/ports/post.repository';
import { Result } from '@/domain/common/result';

export class GetAllPostsUseCase {
    constructor(private readonly postRepository: PostRepository) {}

    async execute(): Promise<Post[]> {
        try {
            return await this.postRepository.getAllPosts();
        } catch (error) {
            console.error('[GetAllPostsUseCase] 포스트 목록 로딩 실패:', error);
            return [];
        }
    }

    async executeResult(): Promise<Result<Post[]>> {
        return Result.wrapAsync(() => this.postRepository.getAllPosts());
    }
}

