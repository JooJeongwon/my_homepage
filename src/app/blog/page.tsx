import { getGetAllPostsUseCase } from '@/di/post.module';
import PostCard from '@/components/ui/PostCard';
import { AlignedGrid } from '@/components/ui/AlignedGrid';

export default async function BlogPage() {
    // 1. Use Case 가져오기
    const useCase = getGetAllPostsUseCase();

    // 2. Use Case 실행
    const posts = await useCase.execute();

    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2 text-neutral-900 dark:text-neutral-200">All Posts</h1>
                <p className="text-neutral-500 dark:text-neutral-400">총 {posts.length}개의 글이 작성되었습니다.</p>
            </div>

            <AlignedGrid alignSelectors={['.js-align-title', '.js-align-desc']}>
                {posts.map((post) => (
                    <PostCard key={post.slug} post={post} />
                ))}
            </AlignedGrid>
        </div>
    );
}