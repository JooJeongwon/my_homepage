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
            <ul className="flex flex-col w-max transition-all duration-300 ease-in-out items-end group-hover:items-stretch gap-0.5 group-hover:gap-1.5">
                {headings.map((heading) => {
                    const isActive = activeId === heading.id;
                    const relLevel = heading.level - minLevel;

                    // [수정 1] 텍스트 들여쓰기 2배로 증가
                    // H1: 0, H2: pl-4 (16px), H3: pl-8 (32px)
                    const indentClass =
                        relLevel === 0 ? "pl-0" : relLevel === 1 ? "pl-4" : "pl-8";

                    // [수정 2] 대시 너비 조정 (전체적으로 작아짐)
                    // H1: w-4 (16px)
                    // H2: w-3 (12px)
                    // H3: w-2 (8px)
                    let dashWidth = "w-4";
                    if (relLevel === 1) dashWidth = "w-3";
                    if (relLevel >= 2) dashWidth = "w-2";

                    return (
                        <li key={heading.id} className="w-full">
                            <a
                                href={`#${heading.id}`}
                                onClick={(e) => handleClick(e, heading.id)}
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