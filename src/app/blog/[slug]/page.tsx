import { getGetPostDetailUseCase } from '@/di/post.module';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypeHighlight from 'rehype-highlight'; // ★ 플러그인 추가
import Link from 'next/link';

export default async function BlogPostPage({
    params
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params;
    const useCase = getGetPostDetailUseCase();
    const post = await useCase.execute(slug);

    if (!post) {
        return notFound();
    }

    return (
        <article className="max-w-3xl mx-auto py-10 px-4">
            <header className="mb-10 text-center">
                <div className="text-left mb-6">
                     <Link href="/blog" className="text-sm text-neutral-700 dark:text-neutral-300 hover:text-blue-600 inline-block transition-colors">
                        ← Back to Blog
                    </Link>
                </div>
                <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
                <div className="text-neutral-600 dark:text-neutral-400 mb-4">
                    {new Date(post.date).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
                <div className="flex justify-center gap-2">
                    {post.tags.map((tag) => (
                        <span key={tag} className="text-blue-600 dark:text-blue-550 font-medium">#{tag}</span>
                    ))}
                </div>
            </header>

            <div className="prose dark:prose-invert max-w-none 
                prose-headings:text-neutral-900 dark:prose-headings:text-neutral-200
                prose-p:text-neutral-800 dark:prose-p:text-neutral-200
                prose-li:text-neutral-800 dark:prose-li:text-neutral-200
                prose-a:text-blue-600 dark:prose-a:text-blue-550 prose-a:no-underline hover:prose-a:underline
                
                /* 코드 블록(pre) 스타일링 - Project Card와 통일 */
                prose-pre:bg-white dark:prose-pre:bg-neutral-900/50
                prose-pre:border prose-pre:border-neutral-200 dark:prose-pre:border-neutral-800
                prose-pre:rounded-2xl prose-pre:shadow-sm
                prose-pre:text-neutral-800 dark:prose-pre:text-neutral-200
                
                /* 인라인 코드(code) 스타일링 */
                prose-code:text-neutral-800 dark:prose-code:text-neutral-200
                prose-code:bg-neutral-100 dark:prose-code:bg-neutral-800
                prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md
                prose-code:before:content-none prose-code:after:content-none
                prose-code:font-normal
                prose-code:border prose-code:border-neutral-200 dark:prose-code:border-neutral-700
                
                /* ★ 중요: 코드 블록(pre) 내부의 code 태그 스타일 리셋 (중복 배경 제거) */
                [&_pre_code]:!bg-transparent [&_pre_code]:!p-0 [&_pre_code]:!border-0 [&_pre_code]:!text-inherit">
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