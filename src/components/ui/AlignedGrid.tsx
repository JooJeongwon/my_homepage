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

    // 하위 호환성 및 단일 선택자 지원 처리
    const targetSelectors = alignSelector ? [alignSelector] : alignSelectors;

    useEffect(() => {
        const grid = gridRef.current;
        if (!grid) return;

        const syncHeights = () => {
            // 1. 측정 전 모든 타겟 요소의 높이 스타일을 초기화합니다.
            targetSelectors.forEach(selector => {
                const elements = Array.from(grid.querySelectorAll(selector)) as HTMLElement[];
                elements.forEach(el => el.style.removeProperty('min-height'));
            });

            // 2. 브라우저 렌더링 시점에 맞춰 계산 (정확도 향상)
            requestAnimationFrame(() => {
                const gridItems = Array.from(grid.children) as HTMLElement[];
                const rows: Map<number, HTMLElement[]> = new Map();

                // 3. 카드들의 상단 위치(offsetTop)를 기준으로 행(Row)을 그룹화
                gridItems.forEach(item => {
                    const top = item.offsetTop;
                    // 오차 범위 10px 허용 (미세한 픽셀 차이 무시)
                    let matchedKey = Array.from(rows.keys()).find(k => Math.abs(k - top) <= 10);

                    if (matchedKey === undefined) {
                        matchedKey = top;
                        rows.set(matchedKey, []);
                    }
                    rows.get(matchedKey)?.push(item);
                });

                // 4. 각 행(Row)마다, 그리고 각 선택자(Selector)마다 높이를 맞춤
                rows.forEach(rowItems => {
                    if (rowItems.length <= 1) return;

                    // 사용자가 지정한 순서대로 높이를 맞춥니다.
                    targetSelectors.forEach(selector => {
                        const targetsInRow = rowItems
                            .map(item => item.querySelector(selector) as HTMLElement)
                            .filter(Boolean);

                        if (targetsInRow.length === 0) return;

                        // 해당 행에서 가장 높은 요소 찾기
                        const maxHeight = Math.max(...targetsInRow.map(t => t.offsetHeight));

                        // 모두 가장 높은 높이로 설정
                        targetsInRow.forEach(t => {
                            t.style.minHeight = `${maxHeight}px`;
                        });
                    });
                });
            });
        };

        const observer = new ResizeObserver(() => {
            syncHeights();
        });

        observer.observe(grid);
        Array.from(grid.children).forEach(child => observer.observe(child));

        syncHeights();

        return () => {
            observer.disconnect();
        };
    }, [children, targetSelectors]);

    return (
        <div ref={gridRef} className="grid gap-6 sm:grid-cols-2">
            {children}
        </div>
    );
}