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

    // 입력 장치 감지 (Pointer Events API 사용 - 하이브리드 지원 및 에뮬레이션 방지)
    useEffect(() => {
        // Pointer Events를 사용하면 pointerType('mouse' | 'touch' | 'pen')을 명확히 알 수 있음
        // 이를 통해 에뮬레이션된 마우스 이벤트나 Race Condition을 근본적으로 해결 가능

        const handlePointer = (e: PointerEvent) => {
            // 마우스 입력인 경우 -> 데스크탑 모드 (Hover 가능)
            if (e.pointerType === "mouse") {
                if (isTouchRef.current) {
                    isTouchRef.current = false;
                    setIsTouch(false);
                }
            }
            // 터치 입력인 경우 -> 터치 모드 (Click to Open)
            else if (e.pointerType === "touch" || e.pointerType === "pen") {
                if (!isTouchRef.current) {
                    isTouchRef.current = true;
                    setIsTouch(true);
                }
            }
        };

        // 전역에서 입력 감지
        window.addEventListener("pointerdown", handlePointer);
        window.addEventListener("pointermove", handlePointer);

        return () => {
            window.removeEventListener("pointerdown", handlePointer);
            window.removeEventListener("pointermove", handlePointer);
        };
    }, []);

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
            className={cn(
                "fixed right-8 top-40 z-50 flex flex-col items-end",
                !isTouch && "group" // Desktop: Enable global hover group
            )}
            aria-label="Table of contents"
        >
            {/* 
              =============================================================================
              [DESKTOP RENDERING] - Dual Layer: Dash Trigger + Pop-over Card
              =============================================================================
            */}
            {!isTouch && (
                <div className="relative">
                    {/* Layer 1: Dash Trigger (Always Visible, defines hover area shape) */}
                    <ul className="flex flex-col items-end gap-0.5 relative z-10 p-2 -m-2"> {/* Negative margin to expand hover area slightly? No, stick to tight. */}
                        {headings.map((heading) => {
                            const isActive = activeId === heading.id;
                            const relLevel = heading.level - minLevel;
                            let dashWidth = "w-4";
                            if (relLevel === 1) dashWidth = "w-3";
                            if (relLevel >= 2) dashWidth = "w-2";

                            return (
                                <li key={`dash-${heading.id}`} className="h-3 w-6 flex justify-end items-center">
                                    <span
                                        className={cn(
                                            "block rounded-full transition-opacity duration-300",
                                            "h-0.5",
                                            dashWidth,
                                            "group-hover:opacity-0", // Hide dashes on hover (replaced by card)
                                            isActive
                                                ? "bg-neutral-800 dark:bg-neutral-200"
                                                : "bg-neutral-300 dark:bg-neutral-600"
                                        )}
                                    />
                                </li>
                            );
                        })}
                    </ul>

                    {/* Layer 2: Pop-over Card (The "Whole Box") */}
                    <div
                        className={cn(
                            "absolute right-0 top-0 w-56 p-4 rounded-lg",
                            "bg-neutral-50 dark:bg-[#121212]",
                            "border border-neutral-200 dark:border-neutral-800 shadow-xl",
                            "flex flex-col gap-1",
                            "origin-top-right transition-all duration-300 ease-in-out",
                            "opacity-0 scale-95 pointer-events-none", // Hidden default
                            "group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto", // Visible hover
                            "max-h-[60vh] overflow-y-auto overscroll-y-contain", // Scroll behavior (Match MDX)
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
                                            onClick={(e) => handleClick(e, heading.id)}
                                            className={cn(
                                                "block text-sm font-medium text-left transition-colors duration-200",
                                                "w-44 py-1", // Enforce w-44 and py-1 (Match MDX)
                                                indentClass,
                                                isActive
                                                    ? "text-neutral-900 dark:text-neutral-100"
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
            )}

            {/* 
              =============================================================================
              [MOBILE / TOUCH RENDERING] - Unified Single Layer (Existing Logic)
              =============================================================================
            */}
            {/* 
              =============================================================================
              [MOBILE / TOUCH RENDERING] - Dual Layer (Same as Desktop, but Triggered by Click/Expanded)
              =============================================================================
            */}
            {isTouch && (
                <div className="relative">
                    {/* Layer 1: Dash Trigger (Always Visible, defines touch area shape) */}
                    <ul className="flex flex-col items-end gap-0.5 relative z-10 p-2 -m-2">
                        {headings.map((heading) => {
                            const isActive = activeId === heading.id;
                            const relLevel = heading.level - minLevel;
                            let dashWidth = "w-4";
                            if (relLevel === 1) dashWidth = "w-3";
                            if (relLevel >= 2) dashWidth = "w-2";

                            return (
                                <li key={`dash-${heading.id}`} className="h-3 w-6 flex justify-end items-center">
                                    {/* Mobile: Dash needs to be clickable to expand */}
                                    <a
                                        href={`#${heading.id}`}
                                        onClick={(e) => handleClick(e, heading.id)}
                                        className="flex items-center justify-end w-full h-full"
                                    >
                                        <span
                                            className={cn(
                                                "block rounded-full transition-opacity duration-300",
                                                "h-0.5",
                                                dashWidth,
                                                expanded && "opacity-0", // Hide dashes when expanded (replaced by card)
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

                    {/* Layer 2: Pop-over Card (The "Whole Box") */}
                    <div
                        className={cn(
                            "absolute right-0 top-0 w-56 p-4 rounded-lg",
                            "bg-neutral-50 dark:bg-[#121212]",
                            "border border-neutral-200 dark:border-neutral-800 shadow-xl",
                            "flex flex-col gap-1",
                            "origin-top-right transition-all duration-300 ease-in-out",
                            "opacity-0 scale-95 pointer-events-none", // Hidden default
                            expanded && "opacity-100 scale-100 pointer-events-auto", // Visible when expanded
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
                                            onClick={(e) => handleClick(e, heading.id)}
                                            className={cn(
                                                "block text-sm font-medium text-left transition-colors duration-200",
                                                "w-44 py-1",
                                                indentClass,
                                                isActive
                                                    ? "text-neutral-900 dark:text-neutral-100"
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
            )}
        </nav>
    );
}