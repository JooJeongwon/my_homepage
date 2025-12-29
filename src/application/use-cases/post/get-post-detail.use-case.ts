import { Post } from '@/domain/models/post.model';
import { PostRepository } from '@/domain/ports/post.repository';

export class GetPostDetailUseCase {
    constructor(private readonly postRepository: PostRepository) {}

    async execute(slug: string): Promise<Post | null> {
        return await this.postRepository.getPostBySlug(slug);
    }
}
