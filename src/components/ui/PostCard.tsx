import Link from 'next/link';
import { Post } from '@/domain/models/post.model';

interface Props {
    post: Post;
}

export default function PostCard({ post }: Props) {
    return (
        // ★ Link 컴포넌트가 최상위에서 감싸고 있어야 클릭됩니다!
        <Link href={`/blog/${post.slug}`} className="block group">

            <article className="h-full flex flex-col border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 
                bg-white dark:bg-neutral-900/50
                hover:shadow-xl dark:hover:bg-neutral-900
                hover:-translate-y-1 transition-all duration-300 ease-out">

                {/* 날짜 & 태그 */}
                <div className="flex items-center gap-3 text-sm mb-4">
                    <div className="flex gap-2">
                        {post.tags.map((tag) => (
                            <span key={tag} className="px-2.5 py-0.5 rounded-md text-xs font-medium
                                bg-neutral-100 text-neutral-600 border border-neutral-200
                                dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700
                                group-hover:border-neutral-300 dark:group-hover:border-neutral-600 transition-colors">
                                {tag}
                            </span>
                        ))}
                    </div>
                    <time dateTime={post.date} className="text-neutral-400 text-xs ml-auto">
                        {new Date(post.date).toLocaleDateString('ko-KR')}
                    </time>
                </div>

                {/* 제목 */}
                <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-200 mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-550 transition-colors">
                    {post.title}
                </h2>

                {/* 설명 */}
                <p className="text-neutral-600 dark:text-neutral-300 line-clamp-2 text-sm leading-relaxed">
                    {post.description}
                </p>
            </article>

        </Link>
    );
}