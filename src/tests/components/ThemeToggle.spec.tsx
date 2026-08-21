import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import * as nextThemes from 'next-themes';

vi.mock('next-themes', () => ({
    useTheme: vi.fn(),
}));

describe('ThemeToggle', () => {
    const mockSetTheme = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('버튼 및 접근성 라벨이 렌더링된다', () => {
        vi.mocked(nextThemes.useTheme).mockReturnValue({
            theme: 'dark',
            resolvedTheme: 'dark',
            setTheme: mockSetTheme,
            themes: ['light', 'dark'],
            systemTheme: 'dark',
        });

        render(<ThemeToggle />);
        expect(screen.getByRole('button', { name: /toggle theme/i })).toBeInTheDocument();
    });

    it('현재 dark 테마일 때 클릭하면 light 테마로 전환한다', () => {
        vi.mocked(nextThemes.useTheme).mockReturnValue({
            theme: 'dark',
            resolvedTheme: 'dark',
            setTheme: mockSetTheme,
            themes: ['light', 'dark'],
            systemTheme: 'dark',
        });

        render(<ThemeToggle />);
        fireEvent.click(screen.getByRole('button', { name: /toggle theme/i }));

        expect(mockSetTheme).toHaveBeenCalledWith('light');
    });

    it('현재 light 테마일 때 클릭하면 dark 테마로 전환한다', () => {
        vi.mocked(nextThemes.useTheme).mockReturnValue({
            theme: 'light',
            resolvedTheme: 'light',
            setTheme: mockSetTheme,
            themes: ['light', 'dark'],
            systemTheme: 'light',
        });

        render(<ThemeToggle />);
        fireEvent.click(screen.getByRole('button', { name: /toggle theme/i }));

        expect(mockSetTheme).toHaveBeenCalledWith('dark');
    });
});
