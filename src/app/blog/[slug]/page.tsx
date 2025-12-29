import { getPostRepository } from '@/di/post.module';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypeHighlight from 'rehype-highlight'; // ★ 플러그인 추가
import 'highlight.js/styles/github-dark.css'; // ★ 코드 블록 스타일(테마) 추가

export default async function BlogPostPage({
    params
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params;
    const repository = getPostRepository();
    const post = await repository.getPostBySlug(slug);

    if (!post) {
        return notFound();
    }

    return (
        <article className="max-w-3xl mx-auto py-10 px-4">
            <header className="mb-10 text-center">
                <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
                <div className="text-gray-500 mb-4">{post.date}</div>
                <div className="flex justify-center gap-2">
                    {post.tags.map((tag) => (
                        <span key={tag} className="text-blue-500">#{tag}</span>
                    ))}
                </div>
            </header>

            <div className="prose dark:prose-invert max-w-none">
                <MDXRemote
                    source={post.content ?? ""}
                    options={{
                        mdxOptions: {
                            // ★ 여기에 하이라이팅 플러그인을 연결합니다.
                            rehypePlugins: [rehypeHighlight],
                        },
                    }}
                />
            </div>
        </article>
    );
}