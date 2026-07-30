import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import RootLayout from '@/app/layout';

// window.matchMedia mock for next-themes inside ThemeProvider
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

// next/navigation mock
vi.mock('next/navigation', () => ({
    usePathname: () => '/',
}));

// next/font/google mock
vi.mock('next/font/google', () => ({
    Inter: () => ({ className: 'inter-font' }),
}));

describe('RootLayout (POUR Operable Accessibility Principles Test)', () => {
    it('최상단에 본문 바로가기 스킵 링크가 존재하고 target main 태그(#main-content)와 연결되어야 한다', () => {
        render(
            <RootLayout>
                <div>Test Content</div>
            </RootLayout>
        );

        // 스킵 링크 존재 확인
        const skipLink = screen.getByRole('link', { name: '본문 내용으로 바로가기' });
        expect(skipLink).toBeInTheDocument();
        expect(skipLink).toHaveAttribute('href', '#main-content');
        expect(skipLink.className).toContain('sr-only');
        expect(skipLink.className).toContain('focus:not-sr-only');

        // main 요소 존재 및 id, tabIndex 확인
        const mainElement = screen.getByRole('main');
        expect(mainElement).toBeInTheDocument();
        expect(mainElement).toHaveAttribute('id', 'main-content');
        expect(mainElement).toHaveAttribute('tabindex', '-1');
    });
});
