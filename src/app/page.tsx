import { getGetRecentPostsUseCase } from '@/di/post.module';
import PostCard from '@/components/ui/PostCard';
import Hero from '@/components/home/Hero';

export default async function Home() {
  // 1. DI(의존성 주입)를 통해 Use Case를 가져옵니다.
  const useCase = getGetRecentPostsUseCase();
  // 2. Use Case를 실행하여 데이터를 가져옵니다. (최신글 4개)
  const posts = await useCase.execute(4);

  return (
    <div className="max-w-4xl mx-auto">
      {/* 히어로 섹션 */}
      <Hero />

      {/* 포스트 리스트 섹션 */}
      <section className="px-6 pb-20">
        <div className="grid gap-6 md:grid-cols-2">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}

          {/* 글이 없을 경우 안내 메시지 */}
          {posts.length === 0 && (
            <div className="col-span-2 text-center py-20 text-neutral-500">
              아직 작성된 글이 없습니다.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
