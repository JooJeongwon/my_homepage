import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
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

vi.mock('next/navigation', () => ({
    usePathname: () => '/',
}));

vi.mock('next/font/google', () => ({
    Inter: () => ({ className: 'inter-font' }),
}));

describe('RootLayout', () => {
    beforeEach(() => {
        vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('본문 바로가기 스킵 링크와 메인 콘텐츠 id가 연결되어야 한다', () => {
        render(
            <RootLayout>
                <div>Test Content</div>
            </RootLayout>
        );

        const skipLink = screen.getByRole('link', { name: '본문 내용으로 바로가기' });
        expect(skipLink).toBeInTheDocument();
        expect(skipLink).toHaveAttribute('href', '#main-content');

        const mainElement = screen.getByRole('main');
        expect(mainElement).toBeInTheDocument();
        expect(mainElement).toHaveAttribute('id', 'main-content');
    });
});
