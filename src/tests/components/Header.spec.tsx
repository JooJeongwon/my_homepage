import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Header from '@/components/layout/Header';

// next/navigation mock
vi.mock('next/navigation', () => ({
    usePathname: () => '/',
}));

describe('Header (POUR Accessibility Principles Test)', () => {
    it('GitHub 및 Email 앙코르(<a>) 태그에 명확한 aria-label이 존재하고 아이콘에 aria-hidden="true"가 설정되어야 한다', () => {
        render(<Header />);

        // GitHub 앙코르 태그 검증 (데스크톱/모바일 전체)
        const githubLinks = screen.getAllByRole('link', { name: /GitHub 프로필 바로가기/i });
        expect(githubLinks.length).toBeGreaterThan(0);
        githubLinks.forEach((link) => {
            expect(link).toHaveAttribute('aria-label', 'GitHub 프로필 바로가기 (새 창 열림)');
            const icon = link.querySelector('svg');
            expect(icon).toHaveAttribute('aria-hidden', 'true');
        });

        // Email 앙코르 태그 검증 (데스크톱/모바일 전체)
        const mailLinks = screen.getAllByRole('link', { name: /이메일 보내기/i });
        expect(mailLinks.length).toBeGreaterThan(0);
        mailLinks.forEach((link) => {
            expect(link).toHaveAttribute('aria-label', '이메일 보내기');
            const icon = link.querySelector('svg');
            expect(icon).toHaveAttribute('aria-hidden', 'true');
        });
    });

    it('모바일 메뉴 버튼 및 토글 상태에 따른 aria-label, aria-expanded, aria-controls가 올바르게 적용되어야 한다', () => {
        render(<Header />);

        // 초기 모바일 버튼 (메뉴 열기)
        const toggleButton = screen.getByRole('button', { name: '메뉴 열기' });
        expect(toggleButton).toBeInTheDocument();
        expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
        expect(toggleButton).toHaveAttribute('aria-controls', 'mobile-navigation');
        const initialIcon = toggleButton.querySelector('svg');
        expect(initialIcon).toHaveAttribute('aria-hidden', 'true');

        // 모바일 메뉴 클릭 후 (메뉴 닫기)
        fireEvent.click(toggleButton);
        expect(screen.getByRole('button', { name: '메뉴 닫기' })).toBeInTheDocument();
        expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
    });

    it('모바일 메뉴가 열려있을 때 Escape 키를 누르면 메뉴가 닫혀야 한다 (Operable Principle)', () => {
        render(<Header />);

        const toggleButton = screen.getByRole('button', { name: '메뉴 열기' });
        fireEvent.click(toggleButton);
        expect(screen.getByRole('button', { name: '메뉴 닫기' })).toBeInTheDocument();

        // Escape 키 누르기
        fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });

        // 메뉴 닫힘 확인
        expect(screen.getByRole('button', { name: '메뉴 열기' })).toBeInTheDocument();
        expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
    });
});
