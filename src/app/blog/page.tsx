import { getPostRepository } from '@/di/post.module'; // ★ DI 모듈에서 가져옴
import PostCard from '@/components/ui/PostCard';

export default async function BlogPage() {
    // 1. 저장소(Repository) 가져오기
    const repository = getPostRepository();

    // 2. 메서드 호출 (이름을 getAllPosts로 수정)
    const posts = await repository.getAllPosts();

    return (
        <div className="container mx-auto px-4 py-10">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">All Posts 📝</h1>
                <p className="text-gray-600">총 {posts.length}개의 글이 작성되었습니다.</p>
            </div>

            <div className="grid gap-4">
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