import Link from 'next/link';
import { Github } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle'; // 방금 만든 토글 버튼 가져오기

export default function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-black/80 backdrop-blur-sm">
            <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">

                {/* 로고 영역 */}
                <Link href="/" className="text-xl font-bold tracking-tight hover:text-blue-600 transition-colors">
                    JW<span className="text-blue-600">.</span>dev
                </Link>

                {/* 네비게이션 메뉴 */}
                <nav className="flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-400">
                    <Link href="/" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
                        Home
                    </Link>
                    <Link href="/blog" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
                        Blog
                    </Link>
                    <Link href="/projects" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
                        Projects
                    </Link>

                    {/* 아이콘 영역 (구분선 포함) */}
                    <div className="flex items-center gap-1 pl-4 border-l border-slate-200 dark:border-slate-800 ml-2">
                        {/* 깃허브 아이콘 */}
                        <a
                            href="https://github.com"
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            <Github className="w-5 h-5" />
                        </a>

                        {/* 다크모드 토글 버튼 */}
                        <ThemeToggle />
                    </div>
                </nav>
            </div>
        </header>
    );
}