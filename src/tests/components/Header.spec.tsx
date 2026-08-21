import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Header from '@/components/common/Header';

vi.mock('next/navigation', () => ({
    usePathname: () => '/',
}));

describe('Header', () => {
    it('GitHub 및 Email 링크에 접근성 라벨과 아이콘이 올바르게 설정되어야 한다', () => {
        render(<Header />);

        const githubLinks = screen.getAllByRole('link', { name: /GitHub 프로필 바로가기/i });
        expect(githubLinks.length).toBeGreaterThan(0);
        githubLinks.forEach((link) => {
            expect(link).toHaveAttribute('aria-label', 'GitHub 프로필 바로가기 (새 창 열림)');
            expect(link.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
        });

        const mailLinks = screen.getAllByRole('link', { name: /이메일 보내기/i });
        expect(mailLinks.length).toBeGreaterThan(0);
        mailLinks.forEach((link) => {
            expect(link).toHaveAttribute('aria-label', '이메일 보내기');
            expect(link.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
        });
    });

    it('모바일 메뉴 버튼 토글에 따라 상태 속성이 갱신되어야 한다', () => {
        render(<Header />);

        const toggleButton = screen.getByRole('button', { name: '메뉴 열기' });
        expect(toggleButton).toHaveAttribute('aria-expanded', 'false');

        fireEvent.click(toggleButton);
        expect(screen.getByRole('button', { name: '메뉴 닫기' })).toBeInTheDocument();
        expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
    });

    it('모바일 메뉴 열림 상태에서 Escape 키를 누르면 메뉴가 닫힌다', () => {
        render(<Header />);

        const toggleButton = screen.getByRole('button', { name: '메뉴 열기' });
        fireEvent.click(toggleButton);
        expect(screen.getByRole('button', { name: '메뉴 닫기' })).toBeInTheDocument();

        fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });
        expect(screen.getByRole('button', { name: '메뉴 열기' })).toBeInTheDocument();
        expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
    });
});
