"use client";

import { useEffect, useState } from "react";
import { Heading } from "@/lib/toc";
import { cn } from "@/lib/utils";

interface TableOfContentsProps {
    headings: Heading[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
    const [activeId, setActiveId] = useState<string>("");

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: "0px 0px -80% 0px" }
        );

        headings.forEach((heading) => {
            const element = document.getElementById(heading.id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, [headings]);

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            const yOffset = -100;
            const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
            window.scrollTo({ behavior: "smooth", top: y });
            history.pushState(null, "", `#${id}`);
            setActiveId(id);
        }
    };

    if (headings.length === 0) return null;

    const minLevel =
        headings.length > 0 ? Math.min(...headings.map((h) => h.level)) : 1;

    return (
        <nav
            className="fixed right-8 top-40 z-50 flex flex-col items-end group"
            aria-label="Table of contents"
        >
            {/* [간격 설정]
        gap-0.5 (2px) : 박스 사이 간격 최소화
        group-hover:gap-1.5 : 텍스트가 나오면 간격 살짝 벌림
      */}
            <ul className="flex flex-col w-max transition-all duration-300 ease-in-out items-end group-hover:items-stretch gap-0.5 group-hover:gap-1.5">
                {headings.map((heading) => {
                    const isActive = activeId === heading.id;
                    const relLevel = heading.level - minLevel;

                    const indentClass =
                        relLevel === 0 ? "pl-0" : relLevel === 1 ? "pl-2" : "pl-4";

                    let dashWidth = "w-6";
                    if (relLevel === 1) dashWidth = "w-4";
                    if (relLevel >= 2) dashWidth = "w-2";

                    return (
                        <li key={heading.id} className="w-full">
                            <a
                                href={`#${heading.id}`}
                                onClick={(e) => handleClick(e, heading.id)}
                                // [핵심 수정] 높이(height)를 가변적으로 변경
                                // h-3 (12px): 대시 상태일 때 높이를 반토막 내서 촘촘하게 만듦
                                // group-hover:h-6 (24px): 텍스트 상태일 때는 글자가 보이게 높이 복구
                                className="flex items-center w-full justify-end group-hover:justify-start transition-[height] duration-300 h-3 group-hover:h-6"
                            >
                                {/* Dash View */}
                                <span
                                    className={cn(
                                        "block rounded-full transition-all duration-300",
                                        "h-0.5",
                                        dashWidth,
                                        "group-hover:hidden",
                                        isActive
                                            ? "bg-neutral-800 dark:bg-neutral-200"
                                            : "bg-neutral-300 dark:bg-neutral-600"
                                    )}
                                />

                                {/* Text View */}
                                <span
                                    className={cn(
                                        "hidden group-hover:block text-left whitespace-nowrap text-sm transition-colors duration-200",
                                        indentClass,
                                        isActive
                                            ? "text-neutral-900 dark:text-neutral-100 font-bold"
                                            : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300"
                                    )}
                                >
                                    {heading.text}
                                </span>
                            </a>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}