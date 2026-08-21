import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TableOfContents } from '@/components/mdx/TableOfContents';
import { Heading } from '@/lib/toc';

class MockIntersectionObserver {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
}

describe('TableOfContents', () => {
    const sampleHeadings: Heading[] = [
        { id: 'section-1', text: 'Section 1', level: 1 },
        { id: 'section-2', text: 'Section 2', level: 2 },
        { id: 'section-3', text: 'Section 3', level: 3 },
    ];

    beforeEach(() => {
        window.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;
        window.scrollTo = vi.fn();

        document.body.innerHTML = `
            <div id="section-1">Section 1 Content</div>
            <div id="section-2">
                <h2>Section 2</h2>
                <a id="target-link" href="#demo">Demo Link</a>
            </div>
            <div id="section-3">Section 3 Content</div>
        `;
    });

    it('목차 항목들을 렌더링한다', () => {
        render(<TableOfContents headings={sampleHeadings} />);
        const links = screen.getAllByRole('link', { name: 'Section 1' });
        expect(links.length).toBeGreaterThan(0);
    });

    it('목차 링크 클릭 시 부드러운 스크롤을 트리거한다', () => {
        render(<TableOfContents headings={sampleHeadings} />);
        const links = screen.getAllByRole('link', { name: 'Section 1' });

        fireEvent.click(links[0]);
        expect(window.scrollTo).toHaveBeenCalledWith(
            expect.objectContaining({ behavior: 'smooth' })
        );
    });

    it('키보드 포커스 이동 시 에러 없이 포커스된다', () => {
        render(<TableOfContents headings={sampleHeadings} />);
        const links = screen.getAllByRole('link', { name: 'Section 2' });

        fireEvent.focus(links[0]);
        expect(links[0]).toBeDefined();
    });
});
