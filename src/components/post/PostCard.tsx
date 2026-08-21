import Link from 'next/link';
import { Post } from '@/core/models/post.model';
import { Clock } from 'lucide-react';
import { formatDate } from '@/lib/date';

interface Props {
    post: Post;
}

export default function PostCard({ post }: Props) {
    return (
        <Link
            href={`/blog/${post.slug}`}
            className="block group grid row-span-4 mb-6 rounded-2xl"
            style={{ gridTemplateRows: 'subgrid' }}
        >
            <article
                className="border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 
                    bg-white dark:bg-neutral-900/50
                    hover:shadow-xl dark:hover:bg-neutral-900
                    hover:-translate-y-1 transition duration-300 ease-out
                    grid row-span-4 col-span-1"
                style={{ gridTemplateRows: 'subgrid' }}
            >
                <div className="flex justify-between items-start pb-4">
                    <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200 group-hover:text-blue-600 dark:group-hover:text-blue-550 transition-colors line-clamp-2">
                        {post.title}
                    </h2>
                </div>

                <div className="pb-6">
                    <p className="text-neutral-700 dark:text-neutral-300 text-sm leading-relaxed line-clamp-3 break-words">
                        {post.description}
                    </p>
                </div>

                <div className="flex flex-wrap gap-2 content-start pb-6">
                    {post.tags.map(tag => (
                        <span key={tag} className="px-2.5 py-0.5 rounded-md text-xs font-medium h-fit
                            bg-neutral-100 text-neutral-700 border border-neutral-200
                            dark:bg-neutral-800 dark:text-neutral-200 dark:border-neutral-700
                            group-hover:border-neutral-300 dark:group-hover:border-neutral-600 transition-colors">
                            {tag}
                        </span>
                    ))}
                </div>

                <div className="flex items-center justify-between self-end">
                    <span className="flex items-center gap-1 text-xs text-neutral-600 dark:text-neutral-400 font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        {post.readingTime} min read
                    </span>
                    <time dateTime={post.date} className="text-neutral-600 dark:text-neutral-400 text-xs font-medium whitespace-nowrap">
                        {formatDate(post.date, 'YYYY.MM.DD')}
                    </time>
                </div>
            </article>
        </Link>
    );
}
