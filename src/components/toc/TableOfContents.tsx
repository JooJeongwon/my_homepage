"use client";

import { useEffect, useState, useRef } from "react";
import { Heading } from "@/lib/toc";
import { cn } from "@/lib/utils";

interface TableOfContentsProps {
    headings: Heading[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
    const [activeId, setActiveId] = useState<string>("");
    const [expanded, setExpanded] = useState(false);
    const [isTouch, setIsTouch] = useState(false);
    const isTouchRef = useRef(false);
    const navRef = useRef<HTMLElement>(null);

    useEffect(() => {
        // 초기 로드시 터치 디바이스 감지 (Race Condition 방지)
        const checkTouch = () => {
            if (window.matchMedia("(pointer: coarse)").matches) {
                setIsTouch(true);
                isTouchRef.current = true;
            }
        };
        checkTouch();

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

    // 외부 클릭 감지하여 닫기 (터치 디바이스용)
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (navRef.current && !navRef.current.contains(event.target as Node)) {
                if (expanded) {
                    setExpanded(false);
                }
            }
        }

        // 터치 환경에서도 mousedown/touchstart 등 이벤트는 발생하므로 mousedown으로 통합 처리
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [expanded]);

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();

        // 터치 디바이스일 때: 펼쳐져 있지 않으면 펼치기만 함 (Ref로 즉시 확인)
        if (isTouchRef.current && !expanded) {
            setExpanded(true);
            return;
        }

        const element = document.getElementById(id);
        if (element) {
            const yOffset = -100;
            const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
            window.scrollTo({ behavior: "smooth", top: y });
            history.pushState(null, "", `#${id}`);
            setActiveId(id);

            // 터치 디바이스일 때: 이동 후 자동으로 닫기
            if (isTouchRef.current) {
                setExpanded(false);
            }
        }
    };

    if (headings.length === 0) return null;

    const minLevel =
        headings.length > 0 ? Math.min(...headings.map((h) => h.level)) : 1;

    return (
        <nav
            ref={navRef}
            className="fixed right-8 top-40 z-50 hidden sm:flex flex-col items-end group"
            aria-label="Table of contents"
            onTouchStart={() => {
                setIsTouch(true);
                isTouchRef.current = true;
            }}
        >
            <div className="relative flex flex-col items-end">
                {/* 배경 레이어 */}
                <div
                    className={cn(
                        "absolute inset-0 rounded-lg pointer-events-none transition-opacity duration-300 ease-in-out",
                        "opacity-0",
                        !isTouch && "group-hover:opacity-100",
                        expanded && "opacity-100",
                        "bg-neutral-50 dark:bg-[#121212]",
                        "border border-neutral-200 dark:border-neutral-800",
                        "shadow-xl"
                    )}
                />

                {/* 컨텐츠 레이어 */}
                <ul
                    className={cn(
                        "relative z-10 flex flex-col transition-all duration-300 ease-in-out",
                        "items-end gap-0.5 w-max",
                        !isTouch && "group-hover:items-stretch group-hover:gap-1 group-hover:w-56",
                        !isTouch && "group-hover:p-4",
                        !isTouch && "group-hover:max-h-[60vh] group-hover:overflow-y-auto group-hover:overscroll-y-contain",
                        expanded && "items-stretch gap-1 w-56",
                        expanded && "p-4",
                        expanded && "max-h-[60vh] overflow-y-auto overscroll-y-contain"
                    )}
                >
                    {headings.map((heading) => {
                        const isActive = activeId === heading.id;
                        const relLevel = heading.level - minLevel;

                        const indentClass =
                            relLevel === 0 ? "pl-0" : relLevel === 1 ? "pl-4" : "pl-8";

                        let dashWidth = "w-4";
                        if (relLevel === 1) dashWidth = "w-3";
                        if (relLevel >= 2) dashWidth = "w-2";

                        return (
                            <li key={heading.id} className="w-full">
                                <a
                                    href={`#${heading.id}`}
                                    onClick={(e) => handleClick(e, heading.id)}
                                    className={cn(
                                        "flex items-center w-full justify-end overflow-hidden",
                                        "transition-[height] duration-300",
                                        !isTouch && "group-hover:justify-start",
                                        !isTouch && "h-3 group-hover:h-auto group-hover:py-1",
                                        expanded && "justify-start",
                                        expanded && "h-auto py-1",
                                        !expanded && "h-3" // 기본 상태 높이 명시 (터치시에도 적용되도록 수정)
                                    )}
                                >
                                    {/* 대시 View */}
                                    <span
                                        className={cn(
                                            "block rounded-full shrink-0 transition-all duration-300",
                                            "h-0.5",
                                            dashWidth,
                                            !isTouch && "group-hover:w-0 group-hover:opacity-0",
                                            expanded && "w-0 opacity-0",
                                            isActive
                                                ? "bg-neutral-800 dark:bg-neutral-200"
                                                : "bg-neutral-300 dark:bg-neutral-600"
                                        )}
                                    />

                                    {/* 텍스트 View */}
                                    <span
                                        className={cn(
                                            "block text-left text-sm transition-all duration-300",
                                            "w-0 opacity-0 p-0",
                                            !isTouch && "group-hover:w-full group-hover:opacity-100",
                                            expanded && "w-full opacity-100"
                                        )}
                                    >
                                        <span
                                            className={cn(
                                                "block w-44 whitespace-normal line-clamp-2 break-words",
                                                "font-medium",
                                                indentClass,
                                                isActive
                                                    ? "text-neutral-900 dark:text-neutral-100" // 색상만 진하게
                                                    : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100" // 색상만 흐리게 -> 호버시 진하게
                                            )}
                                        >
                                            {heading.text}
                                        </span>
                                    </span>
                                </a>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </nav>
    );
}