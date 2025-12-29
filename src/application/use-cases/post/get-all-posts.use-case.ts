import { Post } from '@/domain/models/post.model';
import { PostRepository } from '@/domain/ports/post.repository';

export class GetAllPostsUseCase {
    constructor(private readonly postRepository: PostRepository) {}

    async execute(): Promise<Post[]> {
        return await this.postRepository.getAllPosts();
    }
}
