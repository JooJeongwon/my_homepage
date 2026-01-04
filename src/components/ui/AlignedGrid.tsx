import React from 'react';

interface AlignedGridProps {
    children: React.ReactNode;
    /**
     * @deprecated 더 이상 사용하지 않음. CSS subgrid로 대체됨.
     */
    alignSelectors?: string[];
    /**
     * @deprecated 더 이상 사용하지 않음.
     */
    alignSelector?: string;
}

/**
 * AlignedGrid - CSS Subgrid 기반 카드 그리드
 * 
 * 각 카드는 4개의 행(제목, 설명, 태그, 푸터)을 차지하며,
 * subgrid를 통해 같은 행의 카드들이 동일한 행 높이를 공유합니다.
 * JavaScript 없이 SSR 시점에 높이가 동기화되므로 레이아웃 시프트가 없습니다.
 * 
 * 행 간격: 카드 내부 행 간격(gap-y-4)과 카드 간 간격(4행마다 추가 마진)을 구분
 */
export function AlignedGrid({ children }: AlignedGridProps) {
    // Children 수에 따라 행 수 계산 (2열 그리드, 각 카드당 4행)
    const childCount = React.Children.count(children);
    const rowCount = Math.ceil(childCount / 2) * 4;

    return (
        <div
            className="grid gap-x-6 sm:grid-cols-2"
            style={{
                // 카드당 4개 행: title(auto), desc(auto), tags(auto), footer(auto)
                // gap-y는 카드 내부에서 처리 (subgrid gap 상속 없음)
                gridTemplateRows: `repeat(${rowCount}, auto)`,
                rowGap: 0,
            }}
        >
            {children}
        </div>
    );
}