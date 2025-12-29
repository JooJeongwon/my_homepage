import { Post } from '@/domain/models/post.model';
import { PostRepository } from '@/domain/ports/post.repository';

export class GetRecentPostsUseCase {
    constructor(private readonly postRepository: PostRepository) {}

    async execute(limit: number = 4): Promise<Post[]> {
        const allPosts = await this.postRepository.getAllPosts();
        // 이미 Repository에서 날짜순 정렬이 되어 있다고 가정하지만, 
        // 비즈니스 로직의 안전을 위해 여기서 한 번 더 정렬하거나 필터링 할 수도 있음.
        return allPosts.slice(0, limit);
    }
}
