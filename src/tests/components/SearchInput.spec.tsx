import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import SearchInput from '@/components/ui/SearchInput';

describe('SearchInput UI Component Interaction Tests (FIRST Principle)', () => {
    it('placeholder와 입력 값이 올바르게 렌더링되어야 한다.', () => {
        render(<SearchInput value="test query" onChange={vi.fn()} placeholder="검색어를 입력하세요" />);

        const input = screen.getByPlaceholderText('검색어를 입력하세요') as HTMLInputElement;
        expect(input).toBeInTheDocument();
        expect(input.value).toBe('test query');
    });

    it('사용자가 텍스트를 입력할 때 onChange 콜백이 변경된 값과 함께 호출되어야 한다.', async () => {
        const handleChange = vi.fn();
        const user = userEvent.setup();

        render(<SearchInput value="" onChange={handleChange} />);

        const input = screen.getByRole('textbox');
        await user.type(input, 'Next.js');

        expect(handleChange).toHaveBeenCalled();
    });

    it('value가 존재할 때 Clear 버튼이 나타나고, 클릭 시 onChange("")를 호출하고 focus가 유지되어야 한다.', async () => {
        const handleChange = vi.fn();
        const user = userEvent.setup();

        render(<SearchInput value="Next.js" onChange={handleChange} />);

        const clearButton = screen.getByRole('button', { name: /clear search/i });
        expect(clearButton).toBeInTheDocument();

        await user.click(clearButton);

        expect(handleChange).toHaveBeenCalledWith('');
        const input = screen.getByRole('textbox');
        expect(document.activeElement).toBe(input);
    });

    it('value가 비어있을 때는 Clear 버튼이 노출되지 않아야 한다.', () => {
        render(<SearchInput value="" onChange={vi.fn()} />);

        const clearButton = screen.queryByRole('button', { name: /clear search/i });
        expect(clearButton).not.toBeInTheDocument();
    });

    it('/ 키를 누르면 검색 인풋으로 포커스가 이동해야 한다.', () => {
        render(<SearchInput value="" onChange={vi.fn()} />);

        const input = screen.getByRole('textbox');
        expect(document.activeElement).not.toBe(input);

        fireEvent.keyDown(window, { key: '/' });

        expect(document.activeElement).toBe(input);
    });

    it('⌘K (Meta+K) 키를 누르면 검색 인풋으로 포커스가 이동해야 한다.', () => {
        render(<SearchInput value="" onChange={vi.fn()} />);

        const input = screen.getByRole('textbox');
        expect(document.activeElement).not.toBe(input);

        fireEvent.keyDown(window, { key: 'k', metaKey: true });

        expect(document.activeElement).toBe(input);
    });
});
