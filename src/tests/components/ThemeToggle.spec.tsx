import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import * as nextThemes from 'next-themes';

vi.mock('next-themes', () => ({
    useTheme: vi.fn(),
}));

describe('ThemeToggle UI Component Interaction Tests (FIRST Principle)', () => {
    const mockSetTheme = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('버튼 렌더링 및 accessibility 라벨이 올바르게 설정되어야 한다.', () => {
        vi.mocked(nextThemes.useTheme).mockReturnValue({
            theme: 'dark',
            resolvedTheme: 'dark',
            setTheme: mockSetTheme,
            themes: ['light', 'dark'],
            systemTheme: 'dark',
        });

        render(<ThemeToggle />);

        const button = screen.getByRole('button', { name: /toggle theme/i });
        expect(button).toBeInTheDocument();
    });

    it('현재 테마가 dark일 때 클릭하면 setTheme("light")를 호출해야 한다.', () => {
        vi.mocked(nextThemes.useTheme).mockReturnValue({
            theme: 'dark',
            resolvedTheme: 'dark',
            setTheme: mockSetTheme,
            themes: ['light', 'dark'],
            systemTheme: 'dark',
        });

        render(<ThemeToggle />);

        const button = screen.getByRole('button', { name: /toggle theme/i });
        fireEvent.click(button);

        expect(mockSetTheme).toHaveBeenCalledTimes(1);
        expect(mockSetTheme).toHaveBeenCalledWith('light');
    });

    it('현재 테마가 light일 때 클릭하면 setTheme("dark")를 호출해야 한다.', () => {
        vi.mocked(nextThemes.useTheme).mockReturnValue({
            theme: 'light',
            resolvedTheme: 'light',
            setTheme: mockSetTheme,
            themes: ['light', 'dark'],
            systemTheme: 'light',
        });

        render(<ThemeToggle />);

        const button = screen.getByRole('button', { name: /toggle theme/i });
        fireEvent.click(button);

        expect(mockSetTheme).toHaveBeenCalledTimes(1);
        expect(mockSetTheme).toHaveBeenCalledWith('dark');
    });
});
