import Link from 'next/link';
import { Post } from '@/domain/models/post.model';

interface Props {
    post: Post;
}

export default function PostCard({ post }: Props) {
    return (
        // ★ Link 컴포넌트가 최상위에서 감싸고 있어야 클릭됩니다!
        <Link href={`/blog/${post.slug}`} className="block group">

            <article className="border border-slate-200 dark:border-slate-800 rounded-xl p-6 bg-white dark:bg-slate-900 hover:shadow-lg transition-all hover:-translate-y-1">

                {/* 날짜 & 태그 */}
                <div className="flex items-center gap-3 text-sm text-slate-500 mb-3">
                    <time dateTime={post.date}>
                        {new Date(post.date).toLocaleDateString('ko-KR')}
                    </time>
                    <div className="flex gap-1">
                        {post.tags.map((tag) => (
                            <span key={tag} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md text-xs font-medium">
                                #{tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* 제목 */}
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-blue-600 transition-colors">
                    {post.title}
                </h2>

                {/* 설명 */}
                <p className="text-slate-600 dark:text-slate-400 line-clamp-2">
                    {post.description}
                </p>
            </article>

        </Link>
    );
}