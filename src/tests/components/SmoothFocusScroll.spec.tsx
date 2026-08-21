import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SmoothFocusScroll } from '@/components/common/SmoothFocusScroll';

vi.mock('next/navigation', () => ({
    usePathname: () => '/',
}));

describe('SmoothFocusScroll (Keyboard Focus Smooth Scroll UX Component)', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
        window.scrollTo = vi.fn();
        Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
    });

    it('페이지(라우트) 이동 시 window.scrollTo({ top: 0, left: 0, behavior: "instant" })를 즉각 호출한다', () => {
        render(<SmoothFocusScroll />);
        expect(window.scrollTo).toHaveBeenCalledWith({
            top: 0,
            left: 0,
            behavior: 'instant',
        });
    });

    it('스크롤 위치가 상단 부근(scrollY <= 50)이면 키보드 포커스가 잡혀도 추가 scrollTo를 호출하지 않는다', () => {
        window.scrollY = 20;
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

        expect(window.scrollTo).not.toHaveBeenCalled();
    });

    it('스크롤이 500px 내려간 상태에서 Tab 키로 헤더 버튼 포커스 시 window.scrollTo({ top: 0, behavior: "smooth" })를 호출한다', () => {
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

        // Tab 키 누름 시뮬레이션
        fireEvent.keyDown(window, { key: 'Tab' });
        fireEvent.focusIn(btn);

        expect(window.scrollTo).toHaveBeenCalledWith({
            top: 0,
            behavior: 'smooth',
        });
    });

    it('마우스 클릭(pointerdown)으로 포커스 유입 시에는 smooth scroll을 호출하지 않는다', () => {
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

        // 마우스 클릭 시뮬레이션
        fireEvent.pointerDown(window);
        fireEvent.focusIn(btn);

        expect(window.scrollTo).not.toHaveBeenCalled();
    });

    it('하단 코드블록 요소로 탭 포커스가 내려갈 때 smooth scroll을 트리거한다', () => {
        window.scrollY = 100;
        render(
            <div>
                <SmoothFocusScroll />
                <div id="code-block" tabIndex={0} style={{ marginTop: '800px' }}>Code Block</div>
            </div>
        );

        (window.scrollTo as ReturnType<typeof vi.fn>).mockClear();

        const codeBlock = document.getElementById('code-block')!;

        fireEvent.keyDown(window, { key: 'Tab' });
        fireEvent.focusIn(codeBlock);

        expect(window.scrollTo).toHaveBeenCalledWith(
            expect.objectContaining({ behavior: 'smooth' })
        );
    });

    it('스크롤이 1000px 내려간 상태에서 fixed 목차(TOC) 링크 탭 포커스 시 본문 스크롤을 움직이지 않는다', () => {
        window.scrollY = 1000;
        render(
            <div>
                <SmoothFocusScroll />
                <nav aria-label="목차" style={{ position: 'fixed', top: '100px', right: '20px' }}>
                    <a id="toc-item-1" href="#heading-1">Heading 1</a>
                    <a id="toc-item-2" href="#heading-2">Heading 2</a>
                </nav>
            </div>
        );

        (window.scrollTo as ReturnType<typeof vi.fn>).mockClear();

        const tocLink = document.getElementById('toc-item-2')!;

        fireEvent.keyDown(window, { key: 'Tab' });
        fireEvent.focusIn(tocLink);

        expect(window.scrollTo).not.toHaveBeenCalled();
    });
});
