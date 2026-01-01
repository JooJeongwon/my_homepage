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

                <div className="flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                        <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-200 group-hover:text-blue-600 dark:group-hover:text-blue-550 transition-colors">
                            {post.title}
                        </h2>
                    </div>

                    <p className="text-neutral-700 dark:text-neutral-300 line-clamp-2 text-sm leading-relaxed mb-6 min-h-[60px]">
                        {post.description}
                    </p>

                    <div className="flex items-end justify-between gap-4">
                        <div className="flex flex-wrap gap-2">
                            {post.tags.map(tag => (
                                <span key={tag} className="px-2.5 py-0.5 rounded-md text-xs font-medium
                                bg-neutral-100 text-neutral-700 border border-neutral-200
                                dark:bg-neutral-800 dark:text-neutral-200 dark:border-neutral-700
                                group-hover:border-neutral-300 dark:group-hover:border-neutral-600 transition-colors">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <time dateTime={post.date} className="text-neutral-500 dark:text-neutral-400 text-xs font-medium whitespace-nowrap mb-0.5">
                            {new Date(post.date).toLocaleDateString('ko-KR')}
                        </time>
                    </div>
                </div>
            </article>

        </Link>
    );
}