'use client';

import { useEffect, useRef } from 'react';

interface AlignedGridProps {
    children: React.ReactNode;
    /**
     * Selector for the element to align. Defaults to 'h2' (card title).
     */
    alignSelector?: string;
}

export function AlignedGrid({ children, alignSelector = 'h2' }: AlignedGridProps) {
    const gridRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!gridRef.current) return;

        const syncHeights = () => {
            const grid = gridRef.current;
            if (!grid) return;

            // 1. Reset all min-heights to auto to measure natural height
            const targets = Array.from(grid.querySelectorAll(alignSelector)) as HTMLElement[];
            targets.forEach(t => (t.style.minHeight = 'auto'));

            // 2. Group items by their vertical position (row)
            const rows: Map<number, HTMLElement[]> = new Map();

            targets.forEach(target => {
                // Find the direct child of the grid to roughly determine grouping context if needed,
                // but getBoundingClientRect on the target itself is the most visual truth.
                const top = Math.floor(target.getBoundingClientRect().top);

                // Fuzzy matching for row detection (tolerant to 2px difference)
                let matchedKey = Array.from(rows.keys()).find(k => Math.abs(k - top) <= 2);

                if (matchedKey === undefined) {
                    matchedKey = top;
                    rows.set(matchedKey, []);
                }

                rows.get(matchedKey)?.push(target);
            });

            // 3. For each row, find max height and apply
            rows.forEach(rowTargets => {
                // If only one item in row, no need to force height (unless we want strict Uniform Grid, but usually we just want alignment)
                if (rowTargets.length <= 1) return;

                const maxHeight = Math.max(...rowTargets.map(t => t.offsetHeight));
                rowTargets.forEach(t => {
                    t.style.minHeight = `${maxHeight}px`;
                });
            });
        };

        // Run immediately
        syncHeights();

        // Run again after a short delay to handle layouts/fonts
        const timeoutId = setTimeout(syncHeights, 100);

        // Sync on resize
        const handleResize = () => {
            requestAnimationFrame(syncHeights);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener('resize', handleResize);
        };
    }, [children, alignSelector]);

    // Render as a standard responsive grid
    return (
        <div ref={gridRef} className="grid gap-6 sm:grid-cols-2">
            {children}
        </div>
    );
}
