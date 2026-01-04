'use client';

import { useEffect, useRef } from 'react';

interface AlignedGridProps {
    children: React.ReactNode;
    /**
     * 높이를 맞출 요소들의 선택자 배열입니다.
     * 순서대로 높이를 맞춥니다. (예: 제목 먼저 맞추고 -> 설명 맞춤)
     * 기본값: ['h2', 'p'] (카드 제목, 카드 설명)
     */
    alignSelectors?: string[];
    /**
     * @deprecated Use `alignSelectors` instead.
     */
    alignSelector?: string;
}

// ★ 중요: export default가 아니라 export function 입니다.
export function AlignedGrid({
    children,
    alignSelector,
    alignSelectors = ['h2', 'p']
}: AlignedGridProps) {
    const gridRef = useRef<HTMLDivElement>(null);

    // const targetSelectors = alignSelector ? [alignSelector] : alignSelectors;

    const isSyncing = useRef(false);

    useEffect(() => {
        const grid = gridRef.current;
        if (!grid) return;

        const syncHeights = () => {
            if (isSyncing.current) return;

            // 하위 호환성 및 단일 선택자 지원 처리
            const targetSelectors = alignSelector ? [alignSelector] : alignSelectors;

            // Lock to prevent observer loop from self-modifications
            isSyncing.current = true;

            // 2. 브라우저 렌더링 시점에 맞춰 계산
            requestAnimationFrame(() => {
                const gridItems = Array.from(grid.children) as HTMLElement[];
                if (gridItems.length === 0) {
                    isSyncing.current = false;
                    return;
                }

                // [최적화] 깜빡임 방지: 높이 초기화를 측정 직전에 수행 (이전 프레임에 보여지지 않음)
                targetSelectors.forEach(selector => {
                    const elements = Array.from(grid.querySelectorAll(selector)) as HTMLElement[];
                    elements.forEach(el => el.style.removeProperty('min-height'));
                });

                const firstItemTop = gridItems[0].offsetTop;
                const gridColumns = gridItems.filter(item => Math.abs(item.offsetTop - firstItemTop) < 10).length;

                if (gridColumns <= 1) {
                    isSyncing.current = false;
                    return;
                }

                const rows: HTMLElement[][] = [];
                for (let i = 0; i < gridItems.length; i += gridColumns) {
                    rows.push(gridItems.slice(i, i + gridColumns));
                }

                rows.forEach(rowItems => {
                    if (rowItems.length <= 1) return;

                    targetSelectors.forEach(selector => {
                        const targetsInRow = rowItems
                            .map(item => item.querySelector(selector) as HTMLElement)
                            .filter(Boolean);

                        if (targetsInRow.length === 0) return;

                        const maxHeight = Math.max(...targetsInRow.map(t => t.offsetHeight));

                        targetsInRow.forEach(t => {
                            t.style.minHeight = `${maxHeight}px`;
                        });
                    });
                });

                // Unlock after a short delay to allow layout to settle
                setTimeout(() => {
                    isSyncing.current = false;
                }, 100);
            });
        };

        const observer = new ResizeObserver(() => {
            if (!isSyncing.current) {
                requestAnimationFrame(syncHeights);
            }
        });

        // Observe grid and ALL children for any layout shifts
        observer.observe(grid);
        Array.from(grid.children).forEach(child => observer.observe(child));

        // Initial sync
        syncHeights();

        // Resilience checks
        [50, 150, 300, 500, 1000].forEach(delay => setTimeout(() => {
            if (!isSyncing.current) syncHeights();
        }, delay));

        if (document.fonts) {
            document.fonts.ready.then(() => {
                if (!isSyncing.current) syncHeights();
            });
        }

        return () => {
            observer.disconnect();
        };
    }, [children, alignSelector, alignSelectors]);

    return (
        <div ref={gridRef} className="grid gap-6 sm:grid-cols-2">
            {children}
        </div>
    );
}