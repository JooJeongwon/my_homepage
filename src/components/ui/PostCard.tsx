import Link from 'next/link';
import { Post } from '@/domain/models/post.model';

interface Props {
    post: Post;
}

export default function PostCard({ post }: Props) {
    return (
        <Link href={`/blog/${post.slug}`} className="block group h-full">
            <article className="h-full flex flex-col border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 
                bg-white dark:bg-neutral-900/50
                hover:shadow-xl dark:hover:bg-neutral-900
                hover:-translate-y-1 transition duration-300 ease-out">

                {/* 1. 제목 영역 */}
                <div className="js-align-title flex justify-between items-start mb-4">
                    <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200 group-hover:text-blue-600 dark:group-hover:text-blue-550 transition-colors">
                        {post.title}
                    </h2>
                </div>

                {/* 2. 설명 영역 (AlignedGrid가 높이를 맞춰줍니다) */}
                <p className="js-align-desc text-neutral-700 dark:text-neutral-300 line-clamp-2 text-sm leading-relaxed mb-6 min-h-[60px]">
                    {post.description}
                </p>

                {/* 3. 태그 영역 (위로 올림: ProjectCard와 위치를 맞추기 위해 필수) */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {post.tags.map(tag => (
                        <span key={tag} className="px-2.5 py-0.5 rounded-md text-xs font-medium
                        bg-neutral-100 text-neutral-700 border border-neutral-200
                        dark:bg-neutral-800 dark:text-neutral-200 dark:border-neutral-700
                        group-hover:border-neutral-300 dark:group-hover:border-neutral-600 transition-colors">
                            {tag}
                        </span>
                    ))}
                </div>

                {/* 4. 날짜 영역 (바닥 고정) */}
                <div className="flex items-center justify-end mt-auto">
                    <time dateTime={post.date} className="text-neutral-600 dark:text-neutral-400 text-xs font-medium whitespace-nowrap">
                        {new Date(post.date).toLocaleDateString('ko-KR')}
                    </time>
                </div>
            </article>
        </Link>
    );
}