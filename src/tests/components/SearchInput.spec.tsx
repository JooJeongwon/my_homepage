import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import SearchInput from '@/components/common/SearchInput';

describe('SearchInput', () => {
    it('placeholder와 입력 값이 올바르게 렌더링된다', () => {
        render(<SearchInput value="test query" onChange={vi.fn()} placeholder="검색어를 입력하세요" />);

        const input = screen.getByPlaceholderText('검색어를 입력하세요') as HTMLInputElement;
        expect(input).toBeInTheDocument();
        expect(input.value).toBe('test query');
    });

    it('텍스트 입력 시 onChange 콜백이 호출된다', async () => {
        const handleChange = vi.fn();
        const user = userEvent.setup();

        render(<SearchInput value="" onChange={handleChange} />);

        const input = screen.getByRole('textbox');
        await user.type(input, 'Next.js');

        expect(handleChange).toHaveBeenCalled();
    });

    it('값 입력 시 Clear 버튼이 나타나고 클릭 시 onChange("")가 호출된다', async () => {
        const handleChange = vi.fn();
        const user = userEvent.setup();

        render(<SearchInput value="Next.js" onChange={handleChange} />);

        const clearButton = screen.getByRole('button', { name: /clear search/i });
        expect(clearButton).toBeInTheDocument();

        await user.click(clearButton);
        expect(handleChange).toHaveBeenCalledWith('');
    });

    it('단축키 / 또는 ⌘K 입력 시 검색창으로 포커스 이동한다', () => {
        render(<SearchInput value="" onChange={vi.fn()} />);
        const input = screen.getByRole('textbox');

        fireEvent.keyDown(window, { key: '/' });
        expect(document.activeElement).toBe(input);

        fireEvent.keyDown(window, { key: 'k', metaKey: true });
        expect(document.activeElement).toBe(input);
    });

    it('라벨 연결 및 showLabel 옵션이 정상 동작한다', () => {
        const { rerender } = render(<SearchInput value="" onChange={vi.fn()} label="통합 검색" id="search-id" />);
        const label = screen.getByText('통합 검색');
        expect(label).toHaveAttribute('for', 'search-id');
        expect(label.className).toContain('sr-only');

        rerender(<SearchInput value="" onChange={vi.fn()} label="통합 검색" id="search-id" showLabel={true} />);
        expect(screen.getByText('통합 검색').className).not.toContain('sr-only');
    });
});
