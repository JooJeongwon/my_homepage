import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SmoothFocusScroll } from '@/components/common/SmoothFocusScroll';

vi.mock('next/navigation', () => ({
    usePathname: () => '/',
}));

describe('SmoothFocusScroll', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
        window.scrollTo = vi.fn();
        Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
    });

    it('페이지 이동 시 상단으로 즉시 스크롤한다', () => {
        render(<SmoothFocusScroll />);
        expect(window.scrollTo).toHaveBeenCalledWith({
            top: 0,
            left: 0,
            behavior: 'instant',
        });
    });

    it('스크롤이 내려간 상태에서 Tab 키로 상단 헤더 요소 포커스 시 부드러운 스크롤을 호출한다', () => {
        window.scrollY = 500;
        render(
            <div>
                <SmoothFocusScroll />
                <header>
                    <button id="nav-btn">Menu</button>
                </header>
            </div>
        );

        (window.scrollTo as ReturnType<typeof vi.fn>).mockClear();

        const btn = document.getElementById('nav-btn')!;
        fireEvent.keyDown(window, { key: 'Tab' });
        fireEvent.focusIn(btn);

        expect(window.scrollTo).toHaveBeenCalledWith({
            top: 0,
            behavior: 'smooth',
        });
    });

    it('마우스 클릭으로 포커스 유입 시에는 스크롤을 호출하지 않는다', () => {
        window.scrollY = 500;
        render(
            <div>
                <SmoothFocusScroll />
                <header>
                    <button id="nav-btn">Menu</button>
                </header>
            </div>
        );

        (window.scrollTo as ReturnType<typeof vi.fn>).mockClear();

        const btn = document.getElementById('nav-btn')!;
        fireEvent.pointerDown(window);
        fireEvent.focusIn(btn);

        expect(window.scrollTo).not.toHaveBeenCalled();
    });

    it('fixed 목차(TOC) 링크 탭 포커스 시에는 스크롤을 이동하지 않는다', () => {
        window.scrollY = 1000;
        render(
            <div>
                <SmoothFocusScroll />
                <nav aria-label="목차" style={{ position: 'fixed', top: '100px', right: '20px' }}>
                    <a id="toc-item" href="#heading">Heading</a>
                </nav>
            </div>
        );

        (window.scrollTo as ReturnType<typeof vi.fn>).mockClear();

        const tocLink = document.getElementById('toc-item')!;
        fireEvent.keyDown(window, { key: 'Tab' });
        fireEvent.focusIn(tocLink);

        expect(window.scrollTo).not.toHaveBeenCalled();
    });
});
