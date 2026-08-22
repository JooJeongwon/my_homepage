import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import SearchableList from '@/components/common/SearchableList';
import SearchablePostList from '@/components/post/SearchablePostList';
import SearchableProjectList from '@/components/project/SearchableProjectList';
import type { Post } from '@/core/models/post.model';
import type { Project } from '@/core/models/project.model';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: mockPush,
    }),
}));

interface TestItem {
    id: string;
    title: string;
}

describe('SearchableList Component (DRY Generic)', () => {
    const mockItems: TestItem[] = [
        { id: '1', title: 'React 19 Server Components' },
        { id: '2', title: 'Next.js 16 App Router' },
        { id: '3', title: 'TypeScript Clean Architecture' },
    ];

    const filterFn = (items: TestItem[], query: string) => {
        if (!query.trim()) return items;
        return items.filter((item) => item.title.toLowerCase().includes(query.toLowerCase()));
    };

    it('초기 렌더링 시 전체 목록과 타이틀, 전체 카운트를 올바르게 표시한다', () => {
        render(
            <SearchableList
                title="Test List"
                items={mockItems}
                filterFn={filterFn}
                searchId="test-search"
                searchLabel="테스트 검색"
                totalCountText={(count) => <>총 {count}개의 항목이 있습니다.</>}
                renderItem={(item) => <div key={item.id} data-testid="item">{item.title}</div>}
            />
        );

        expect(screen.getByRole('heading', { level: 1, name: 'Test List' })).toBeInTheDocument();
        expect(screen.getByText('총 3개의 항목이 있습니다.')).toBeInTheDocument();
        expect(screen.getAllByTestId('item')).toHaveLength(3);
    });

    it('검색어를 입력하면 실시간으로 필터링되고 결과 카운트가 갱신된다', async () => {
        const user = userEvent.setup();

        render(
            <SearchableList
                title="Test List"
                items={mockItems}
                filterFn={filterFn}
                searchId="test-search"
                searchLabel="테스트 검색"
                totalCountText={(count) => <>총 {count}개의 항목</>}
                renderItem={(item) => <div key={item.id} data-testid="item">{item.title}</div>}
            />
        );

        const searchInput = screen.getByRole('textbox');
        await user.type(searchInput, 'React');

        expect(screen.getByText(/'React'/)).toBeInTheDocument();
        expect(screen.getByText('1')).toBeInTheDocument();
        const items = screen.getAllByTestId('item');
        expect(items).toHaveLength(1);
        expect(items[0]).toHaveTextContent('React 19 Server Components');
    });

    it('검색 결과가 없을 경우 Empty State와 설명 문구를 렌더링한다', async () => {
        const user = userEvent.setup();

        render(
            <SearchableList
                title="Test List"
                items={mockItems}
                filterFn={filterFn}
                searchId="test-search"
                searchLabel="테스트 검색"
                totalCountText={(count) => <>총 {count}개의 항목</>}
                emptyDescription={(query) => `'${query}' 항목을 찾을 수 없습니다.`}
                renderItem={(item) => <div key={item.id} data-testid="item">{item.title}</div>}
            />
        );

        const searchInput = screen.getByRole('textbox');
        await user.type(searchInput, 'Flutter');

        expect(screen.getByText('검색 결과가 없습니다')).toBeInTheDocument();
        expect(screen.getByText(/'Flutter' 항목을 찾을 수 없습니다\./)).toBeInTheDocument();
        expect(screen.queryByTestId('item')).not.toBeInTheDocument();
    });

    it('검색 초기화 버튼 클릭 시 검색창이 비워지고 전체 목록이 복원된다', async () => {
        const user = userEvent.setup();

        render(
            <SearchableList
                title="Test List"
                items={mockItems}
                filterFn={filterFn}
                searchId="test-search"
                searchLabel="테스트 검색"
                totalCountText={(count) => <>총 {count}개의 항목</>}
                renderItem={(item) => <div key={item.id} data-testid="item">{item.title}</div>}
            />
        );

        const searchInput = screen.getByRole('textbox');
        await user.type(searchInput, 'NonExistentWord');

        const resetButton = screen.getByRole('button', { name: '검색 초기화' });
        await user.click(resetButton);

        expect(searchInput).toHaveValue('');
        expect(screen.getAllByTestId('item')).toHaveLength(3);
    });
});

describe('SearchablePostList & SearchableProjectList Integration', () => {
    const mockPosts: Post[] = [
        {
            id: 'post-1',
            slug: 'post-1',
            title: '클린 아키텍처 도입기',
            description: '소프트웨어 설계 원칙에 따른 아키텍처',
            date: '2026-08-20',
            tags: ['Architecture', 'CleanCode'],
            content: '클린 아키텍처 본문 내용',
            readingTime: 5,
        },
        {
            id: 'post-2',
            slug: 'post-2',
            title: 'Next.js 16 리액트 컴포넌트',
            description: 'React 19 기능 분석',
            date: '2026-08-21',
            tags: ['Nextjs', 'React'],
            content: 'Next.js 본문',
            readingTime: 3,
        },
    ];

    const mockProjects: Project[] = [
        {
            id: 'proj-1',
            slug: 'jw-platform',
            title: 'JW Platform',
            description: '개인 개발 블로그 및 포트폴리오',
            tags: ['Next.js', 'React', 'TypeScript'],
            date: '2026.01 - 현재',
            content: '프로젝트 상세 내용',
            links: {
                github: 'https://github.com/example/test',
                demo: 'https://example.com',
            },
        },
    ];

    it('SearchablePostList가 Post 리스트를 정상적으로 렌더링하고 검색한다', async () => {
        const user = userEvent.setup();

        render(<SearchablePostList posts={mockPosts} />);

        expect(screen.getByRole('heading', { level: 1, name: 'All Posts' })).toBeInTheDocument();
        expect(screen.getByText(/개의 글이 작성되었습니다/)).toBeInTheDocument();
        expect(screen.getByText('클린 아키텍처 도입기')).toBeInTheDocument();

        const searchInput = screen.getByPlaceholderText('Search ( ⌘ + k )');
        await user.type(searchInput, 'Next.js');

        expect(screen.getByText('Next.js 16 리액트 컴포넌트')).toBeInTheDocument();
        expect(screen.queryByText('클린 아키텍처 도입기')).not.toBeInTheDocument();
    });

    it('SearchableProjectList가 Project 리스트를 정상적으로 렌더링한다', () => {
        render(<SearchableProjectList projects={mockProjects} />);

        expect(screen.getByRole('heading', { level: 1, name: 'Projects' })).toBeInTheDocument();
        expect(screen.getByText(/개의 프로젝트가 진행되었습니다/)).toBeInTheDocument();
        expect(screen.getByText('JW Platform')).toBeInTheDocument();
    });
});
