import { postService } from '@/infrastructure/mdx/mdx-post.repository';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { extractHeadings } from '@/lib/toc';
import { TableOfContents } from '@/components/mdx/TableOfContents';
import { MdxRenderer } from '@/components/mdx/MdxRenderer';
import { formatKoreanDate } from '@/lib/date';

export async function generateMetadata({
    params
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const post = await postService.getPostBySlug(slug);

    if (!post) {
        return {
            title: 'Post Not Found',
            description: '요청하신 포스트를 찾을 수 없습니다.',
        };
    }

    const title = post.title;
    const description = post.description || post.content?.slice(0, 160) || '';
    const url = `/blog/${slug}`;
    const images = post.thumbnail ? [{ url: post.thumbnail, alt: post.title }] : undefined;

    return {
        title,
        description,
        keywords: post.tags,
        alternates: {
            canonical: url,
        },
        openGraph: {
            title,
            description,
            url,
            siteName: 'jwjoo Dev Log',
            locale: 'ko_KR',
            type: 'article',
            publishedTime: post.date,
            authors: ['jwjoo'],
            tags: post.tags,
            images,
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: post.thumbnail ? [post.thumbnail] : undefined,
        },
    };
}

export async function generateStaticParams() {
    const posts = await postService.getAllPosts();

    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export default async function BlogPostPage({
    params
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params;
    const post = await postService.getPostBySlug(slug);

    if (!post) {
        return notFound();
    }

    const headings = extractHeadings(post.content ?? "");

    return (
        <div className="relative w-full max-w-6xl mx-auto px-4 py-10">
            {/* TOC is fixed positioned, so placement in DOM matters less, but keeping it here */}
            <TableOfContents headings={headings} />

            <article className="max-w-3xl min-w-0 w-full sm:w-[75%] sm:ml-[10%] lg:w-[70%] lg:ml-[8%] xl:w-full xl:mx-auto">
                <header className="mb-10 text-left">
                    <div className="mb-6">
                        <Link href="/blog" className="group inline-flex items-center gap-1 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Back to Blog
                        </Link>
                    </div>
                    <h1 className="text-4xl font-bold mb-4 text-neutral-800 dark:text-neutral-200">{post.title}</h1>
                    <time dateTime={post.date} className="block text-neutral-600 dark:text-neutral-400 mb-4">
                        {formatKoreanDate(post.date)}
                    </time>
                    <div className="flex justify-start gap-2 flex-wrap">
                        {post.tags.map((tag) => (
                            <span key={tag} className="px-2.5 py-0.5 rounded-md text-xs font-medium
                                bg-neutral-100 text-neutral-700 border border-neutral-200
                                dark:bg-neutral-800 dark:text-neutral-200 dark:border-neutral-700">
                                {tag}
                            </span>
                        ))}
                    </div>
                </header>

                <MdxRenderer source={post.content ?? ""} />
            </article>
        </div>
    );
}