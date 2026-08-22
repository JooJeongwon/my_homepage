import type { Metadata } from 'next';
import { postService } from '@/infrastructure/mdx/mdx-post.repository';
import SearchablePostList from '@/components/post/SearchablePostList';

export const metadata: Metadata = {
    title: 'Blog',
    description: '개발 경험과 기술적 고민, 학습한 내용을 기록하는 블로그입니다.',
    alternates: {
        canonical: '/blog',
    },
    openGraph: {
        title: 'Blog | jwjoo Dev Log',
        description: '개발 경험과 기술적 고민, 학습한 내용을 기록하는 블로그입니다.',
        url: '/blog',
        siteName: 'jwjoo Dev Log',
        locale: 'ko_KR',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Blog | jwjoo Dev Log',
        description: '개발 경험과 기술적 고민, 학습한 내용을 기록하는 블로그입니다.',
    },
};

export default async function BlogPage() {
    const posts = await postService.getAllPosts();

    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <SearchablePostList posts={posts} />
        </div>
    );
}