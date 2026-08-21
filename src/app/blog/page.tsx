import { postService } from '@/infrastructure/mdx/mdx-post.repository';
import SearchablePostList from '@/components/post/SearchablePostList';

export default async function BlogPage() {
    const posts = await postService.getAllPosts();

    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <SearchablePostList posts={posts} />
        </div>
    );
}