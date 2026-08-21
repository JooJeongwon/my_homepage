import React from 'react';

interface AlignedGridProps {
    children: React.ReactNode;
}

/**
 * AlignedGrid - CSS Subgrid 기반 카드 그리드
 */
export function AlignedGrid({ children }: AlignedGridProps) {
    const childCount = React.Children.count(children);
    const rowCount = Math.ceil(childCount / 2) * 4;

    return (
        <div
            className="grid gap-x-6 sm:grid-cols-2"
            style={{
                gridTemplateRows: `repeat(${rowCount}, auto)`,
                rowGap: 0,
            }}
        >
            {children}
        </div>
    );
}
