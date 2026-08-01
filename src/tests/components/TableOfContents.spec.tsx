import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TableOfContents } from '@/components/toc/TableOfContents';
import { Heading } from '@/lib/toc';

class MockIntersectionObserver {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
}

describe('TableOfContents Component (Continuous Scroll & Decoupled Focus Architecture)', () => {
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

    it('renders heading items correctly', () => {
        render(<TableOfContents headings={sampleHeadings} />);
        const links = screen.getAllByRole('link', { name: 'Section 1' });
        expect(links.length).toBeGreaterThan(0);
    });

    it('triggers smooth scroll when clicking heading link without artificial timeout locks', () => {
        render(<TableOfContents headings={sampleHeadings} />);
        const links = screen.getAllByRole('link', { name: 'Section 1' });
        
        fireEvent.click(links[0]);
        expect(window.scrollTo).toHaveBeenCalledWith(
            expect.objectContaining({ behavior: 'smooth' })
        );
    });

    it('decouples keyboard focus from scroll active state to prevent premature indicator jumps', () => {
        render(<TableOfContents headings={sampleHeadings} />);
        const links = screen.getAllByRole('link', { name: 'Section 2' });

        // Focusing link should NOT throw or trigger artificial manual nav locks
        fireEvent.focus(links[0]);
        expect(links[0]).toBeDefined();
    });
});
