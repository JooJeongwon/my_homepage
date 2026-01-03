'use client';

import { useEffect, useRef, useState } from 'react';
import { Project } from '@/domain/models/project.model';
import { ProjectCard } from '@/components/ui/ProjectCard';

interface ProjectGridProps {
    projects: Project[];
}

export function ProjectGrid({ projects }: ProjectGridProps) {
    const gridRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!gridRef.current) return;

        const syncHeights = () => {
            const grid = gridRef.current;
            if (!grid) return;

            // 1. Reset all min-heights to auto to measure natural height
            const titles = Array.from(grid.querySelectorAll('h2'));
            titles.forEach(t => (t.style.minHeight = 'auto'));

            // 2. Group items by their top position (row)
            const rows: Map<number, HTMLElement[]> = new Map();

            titles.forEach(title => {
                // Find the card container (article) to determine the row
                // We assume title is inside: article > div > h2
                // We use the article's offsetTop to be safer about row detection
                const card = title.closest('article');
                if (!card) return;

                const initialOffset = card.offsetTop;
                if (!rows.has(initialOffset)) {
                    rows.set(initialOffset, []);
                }
                rows.get(initialOffset)?.push(title);
            });

            // 3. For each row, find max height and apply
            rows.forEach(rowTitles => {
                if (rowTitles.length <= 1) return; // No need to align if alone in row

                const maxHeight = Math.max(...rowTitles.map(t => t.offsetHeight));
                rowTitles.forEach(t => {
                    t.style.minHeight = `${maxHeight}px`;
                });
            });
        };

        // Initial sync
        syncHeights();

        // Sync on resize
        const resizeObserver = new ResizeObserver(() => {
            // Debounce slightly or just run
            requestAnimationFrame(syncHeights);
        });

        // Observe the grid container for width changes
        resizeObserver.observe(gridRef.current);

        // Also observe images loading? Not needed for text title adjustment usually.
        // But if font loads late, it might shift. ProjectCard text is usually immediate.

        window.addEventListener('resize', syncHeights);

        return () => {
            resizeObserver.disconnect();
            window.removeEventListener('resize', syncHeights);
        };
    }, [projects]);

    return (
        <div ref={gridRef} className="grid gap-6 sm:grid-cols-2">
            {projects.map(project => (
                <ProjectCard key={project.id} project={project} />
            ))}
        </div>
    );
}
