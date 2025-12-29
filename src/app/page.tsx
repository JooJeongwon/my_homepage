import { getPostRepository } from '@/di/post.module';
import PostCard from '@/components/ui/PostCard';

export default async function Home() {
  // 1. DI(의존성 주입)를 통해 데이터를 가져옵니다.
  // 이 페이지는 데이터가 파일에서 오는지 노션에서 오는지 전혀 모릅니다. (관심사의 분리)
  const repository = getPostRepository();
  const posts = await repository.getAllPosts();

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-slate-100">

      {/* 헤더 섹션 (임시) */}
      <header className="max-w-4xl mx-auto py-20 px-6">
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">
          JW's Dev Log <span className="text-blue-500">.</span>
        </h1>
        <p className="text-xl text-slate-500">
          백엔드 개발자 주정원의 트러블슈팅 & 학습 기록 저장소
        </p>
      </header>

      {/* 포스트 리스트 섹션 */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <div className="grid gap-6 md:grid-cols-2">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}

          {/* 글이 없을 경우 안내 메시지 */}
          {posts.length === 0 && (
            <div className="col-span-2 text-center py-20 text-slate-500">
              아직 작성된 글이 없습니다.
            </div>
          )}
        </div>
      </section>

    </main>
  );
}