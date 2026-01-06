'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Github } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';


const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <Link
            href={href}
            onClick={(e) => {
                if (pathname === href) {
                    e.preventDefault(); // 기본 이동 막고
                    handleScrollToTop(); // 스크롤만 위로
                }
            }}
            className="text-neutral-800 dark:text-neutral-200 hover:text-blue-600 dark:hover:text-blue-550 transition-colors"
        >
            {children}
        </Link>
    );
};

export default function Header() {
    const pathname = usePathname();



    return (
        <header className="sticky top-0 z-50 w-full border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-sm">
            <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">

                {/* 로고 영역 */}
                <Link
                    href="/"
                    onClick={(e) => {
                        if (pathname === '/') {
                            e.preventDefault();
                            handleScrollToTop();
                        }
                    }}
                    className="group pl-1 text-xl font-bold tracking-tight hover:text-blue-600 dark:hover:text-blue-550 transition-colors"
                >
                    jwjoo<span className="text-blue-600 dark:text-blue-550 transition-colors group-hover:text-neutral-900 dark:group-hover:text-white">.</span>
                </Link>

                {/* 네비게이션 메뉴 */}
                <nav className="flex items-center gap-6 text-sm font-medium">
                    <NavLink href="/">Home</NavLink>
                    <NavLink href="/blog">Blog</NavLink>
                    <NavLink href="/projects">Projects</NavLink>

                    {/* 아이콘 영역 (구분선 포함) */}
                    <div className="flex items-center gap-1 pl-4 border-l border-neutral-200 dark:border-neutral-800 ml-2">
                        {/* 깃허브 아이콘 */}
                        <a
                            href="https://github.com/JooJeongwon"
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 rounded-full text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-blue-600 dark:hover:text-blue-550 transition-colors"
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

// ... NavLink 내부 스타일도 함께 변경해야 하므로 전체를 덮어쓰거나, NavLink만 따로 교체합니다.
// 여기서는 NavLink 스타일 정의 부분을 포함하기 위해 파일 상단 NavLink 정의도 수정이 필요합니다.
// 아래 old_string을 확인하고 NavLink 정의 부분도 포함해서 교체하겠습니다.