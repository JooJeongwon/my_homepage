import { getGetAllPostsUseCase } from '@/di/post.module'; // ★ DI 모듈에서 가져옴
import PostCard from '@/components/ui/PostCard';

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

            <div className="grid gap-6 md:grid-cols-2">
                {/* 여기서 post가 any로 뜨던 이유는 repository 인터페이스가 반환 타입을 
           제대로 못 잡아줘서 그렇습니다. 1단계 수정을 하면 해결됩니다. 
        */}
                {posts.map((post) => (
                    <PostCard key={post.slug} post={post} />
                ))}
            </div>
        </div>
    );
}