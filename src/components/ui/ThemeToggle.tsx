"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
    const { resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    // 버튼은 항상 보이고, 아이콘만 마운트 후에 표시
    // 이렇게 하면 버튼 공간은 항상 유지되고, 아이콘만 나타남
    return (
        <button
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            className="w-9 h-9 flex items-center justify-center relative rounded-full hover:bg-orange-100 dark:hover:bg-blue-550/10 group"
            aria-label="Toggle theme"
        >
            {/* 마운트 전에는 아이콘을 렌더링하지 않음 - 버튼 크기는 className으로 고정 */}
            {mounted && (
                <>
                    <Sun className="h-5 w-5 rotate-0 scale-100 dark:-rotate-90 dark:scale-0 text-neutral-800 group-hover:text-orange-500" />
                    <Moon className="absolute h-5 w-5 rotate-90 scale-0 dark:rotate-0 dark:scale-100 text-neutral-200 group-hover:text-blue-550" />
                </>
            )}
        </button>
    );
}