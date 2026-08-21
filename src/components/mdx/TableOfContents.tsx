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
        const checkTouch = () => {
            if (typeof window !== "undefined" && window.matchMedia?.("(pointer: coarse)")?.matches) {
                setIsTouch(true);
                isTouchRef.current = true;
            }
        };
        checkTouch();

        const calculateActiveHeading = () => {
            if (!headings || headings.length === 0) return;

            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            const scrollHeight = document.documentElement.scrollHeight;

            if (scrollY < 50) {
                setActiveId(headings[0].id);
                return;
            }

            if (windowHeight + scrollY >= scrollHeight - 35) {
                setActiveId(headings[headings.length - 1].id);
                return;
            }

            const HEADER_OFFSET = 120;
            let currentActiveId = headings[0].id;

            for (let i = 0; i < headings.length; i++) {
                const el = document.getElementById(headings[i].id);
                if (el) {
                    const rect = el.getBoundingClientRect();
                    if (rect.top <= HEADER_OFFSET) {
                        currentActiveId = headings[i].id;
                    } else {
                        break;
                    }
                }
            }

            setActiveId(currentActiveId);
        };

        let rafId: number | null = null;
        const handleScroll = () => {
            if (rafId) cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
                calculateActiveHeading();
            });
        };

        const observer = new IntersectionObserver(
            () => {
                calculateActiveHeading();
            },
            { rootMargin: "0px 0px -70% 0px" }
        );

        headings.forEach((heading) => {
            const element = document.getElementById(heading.id);
            if (element) observer.observe(element);
        });

        window.addEventListener("scroll", handleScroll, { passive: true });
        calculateActiveHeading();

        return () => {
            observer.disconnect();
            window.removeEventListener("scroll", handleScroll);
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, [headings]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (navRef.current && !navRef.current.contains(event.target as Node)) {
                if (expanded) {
                    setExpanded(false);
                }
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [expanded]);

    useEffect(() => {
        const handlePointer = (e: PointerEvent) => {
            if (e.pointerType === "mouse") {
                if (isTouchRef.current) {
                    isTouchRef.current = false;
                    setIsTouch(false);
                }
            } else if (e.pointerType === "touch" || e.pointerType === "pen") {
                if (!isTouchRef.current) {
                    isTouchRef.current = true;
                    setIsTouch(true);
                }
            }
        };

        window.addEventListener("pointerdown", handlePointer);
        window.addEventListener("pointermove", handlePointer);

        return () => {
            window.removeEventListener("pointerdown", handlePointer);
            window.removeEventListener("pointermove", handlePointer);
        };
    }, []);

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();

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
            className={cn(
                "hidden sm:flex fixed right-8 top-40 z-50 flex-col items-end",
                !isTouch && "group"
            )}
            aria-label="목차"
        >
            <div className="relative">
                {/* 우측 인디케이터 대시 목록 */}
                <ul className="flex flex-col items-end gap-0.5 relative z-10 p-2 -m-2">
                    {headings.map((heading) => {
                        const isActive = activeId === heading.id;
                        const relLevel = heading.level - minLevel;
                        let dashWidth = "w-4";
                        if (relLevel === 1) dashWidth = "w-3";
                        if (relLevel >= 2) dashWidth = "w-2";

                        return (
                            <li key={`dash-${heading.id}`} className="h-3 w-6 flex justify-end items-center">
                                <a
                                    href={`#${heading.id}`}
                                    onClick={(e) => handleClick(e, heading.id)}
                                    aria-label={heading.text}
                                    className="flex items-center justify-end p-0.5 rounded transition-shadow"
                                >
                                    <span
                                        className={cn(
                                            "block rounded-full transition-opacity duration-200 ease-in-out",
                                            "h-0.5",
                                            dashWidth,
                                            // 데스크톱에서는 group-hover 시 대시가 숨겨지고, 터치에서는 expanded 시 숨김
                                            isTouch
                                                ? (expanded && "opacity-0")
                                                : "group-hover:opacity-0",
                                            isActive
                                                ? "bg-neutral-800 dark:bg-neutral-200"
                                                : "bg-neutral-300 dark:bg-neutral-600"
                                        )}
                                    />
                                </a>
                            </li>
                        );
                    })}
                </ul>

                {/* 드롭다운 목차 메뉴 */}
                <div
                    className={cn(
                        "absolute right-0 top-0 w-56 p-4 rounded-lg",
                        "bg-neutral-50 dark:bg-[#121212]",
                        "border border-neutral-200 dark:border-neutral-800 shadow-xl",
                        "flex flex-col gap-1",
                        "origin-top-right transition-all duration-200 ease-in-out",
                        "opacity-0 scale-95 pointer-events-none",
                        // 데스크톱에서는 group-hover 시 오픈, 터치에서는 expanded 시 오픈
                        isTouch
                            ? (expanded && "opacity-100 scale-100 pointer-events-auto")
                            : "group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto",
                        "max-h-[60vh] overflow-y-auto overscroll-y-contain",
                        "z-20"
                    )}
                >
                    <ul className="flex flex-col gap-1">
                        {headings.map((heading) => {
                            const isActive = activeId === heading.id;
                            const relLevel = heading.level - minLevel;
                            const indentClass = relLevel === 0 ? "pl-0" : relLevel === 1 ? "pl-4" : "pl-8";

                            return (
                                <li key={`text-${heading.id}`} className="flex items-center">
                                    <a
                                        href={`#${heading.id}`}
                                        tabIndex={-1}
                                        onClick={(e) => handleClick(e, heading.id)}
                                        className={cn(
                                            "block text-sm font-medium text-left transition-colors duration-200",
                                            "w-44 py-1",
                                            indentClass,
                                            isActive
                                                ? "text-neutral-900 dark:text-neutral-100 font-semibold"
                                                : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
                                        )}
                                    >
                                        <span className="w-full whitespace-normal break-words line-clamp-2">
                                            {heading.text}
                                        </span>
                                    </a>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </nav>
    );
}
