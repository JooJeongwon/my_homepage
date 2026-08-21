import { postService } from '@/infrastructure/mdx/mdx-post.repository';
import PostCard from '@/components/post/PostCard';
import { AlignedGrid } from '@/components/common/AlignedGrid';

export default async function RecentPosts() {
  const posts = await postService.getRecentPosts(4);

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
