import { getGetAllPostsUseCase } from '@/di/post.module';
import SearchablePostList from '@/components/ui/SearchablePostList';

export default async function BlogPage() {
    // 1. Use Case 가져오기
    const useCase = getGetAllPostsUseCase();

    // 2. Use Case 실행
    const posts = await useCase.execute();

    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <SearchablePostList posts={posts} />
        </div>
    );
}