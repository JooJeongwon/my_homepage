import { getGetRecentPostsUseCase } from '@/di/post.module';
import PostCard from '@/components/ui/PostCard';
import { AlignedGrid } from '@/components/ui/AlignedGrid';

export default async function RecentPosts() {
  const getRecentPosts = getGetRecentPostsUseCase();
  const posts = await getRecentPosts.execute(4);

  return (
    <AlignedGrid>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}

      {posts.length === 0 && (
        <div className="col-span-2 text-center py-20 text-neutral-500">
          아직 작성된 글이 없습니다.
        </div>
      )}
    </AlignedGrid>
  );
}
