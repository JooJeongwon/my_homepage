'use client';

import React, { useState, useDeferredValue } from 'react';
import type { LucideIcon } from 'lucide-react';
import { FileQuestion } from 'lucide-react';
import SearchInput from '@/components/common/SearchInput';
import { AlignedGrid } from '@/components/common/AlignedGrid';

export interface SearchableListProps<T> {
    /** 페이지 또는 목록의 메인 타이틀 (예: All Posts, Projects) */
    title: string;
    /** 전체 데이터 아이템 배열 */
    items: T[];
    /** 검색어에 따라 아이템을 필터링하는 순수 함수 */
    filterFn: (items: T[], query: string) => T[];
    /** SearchInput에 전달할 고유 id */
    searchId: string;
    /** SearchInput 접근성 라벨 */
    searchLabel: string;
    /** SearchInput placeholder (기본값: 'Search ( ⌘ + k )') */
    searchPlaceholder?: string;
    /** 검색어가 없을 때 표시할 총 개수 텍스트 렌더러 */
    totalCountText: (totalCount: number) => React.ReactNode;
    /** 검색 결과가 없을 때 표시할 Lucide 아이콘 (기본값: FileQuestion) */
    emptyIcon?: LucideIcon;
    /** 검색 결과가 없을 때 표시할 커스텀 타이틀 (기본값: '검색 결과가 없습니다') */
    emptyTitle?: string;
    /** 검색 결과가 없을 때 표시할 설명 문구 생성 함수 */
    emptyDescription?: (query: string) => React.ReactNode;
    /** 각 아이템을 렌더링하는 함수 */
    renderItem: (item: T, index: number) => React.ReactNode;
}

/**
 * 포스트, 프로젝트 등 실시간 클라이언트 검색 및 그리드 목록을 렌더링하는 공통 제네릭 컴포넌트
 */
export function SearchableList<T>({
    title,
    items,
    filterFn,
    searchId,
    searchLabel,
    searchPlaceholder = 'Search ( ⌘ + k )',
    totalCountText,
    emptyIcon: EmptyIcon = FileQuestion,
    emptyTitle = '검색 결과가 없습니다',
    emptyDescription,
    renderItem,
}: SearchableListProps<T>) {
    const [query, setQuery] = useState('');
    const deferredQuery = useDeferredValue(query);

    // 순수 Domain Filter 함수를 통한 필터링
    const filteredItems = filterFn(items, deferredQuery);
    const isPending = query !== deferredQuery;

    const handleQueryChange = (val: string) => {
        setQuery(val);
    };

    const handleClearSearch = () => {
        setQuery('');
    };

    return (
        <div>
            {/* 검색바 및 정보 영역 */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2 text-neutral-900 dark:text-neutral-200">{title}</h1>
                    <p className="text-neutral-500 dark:text-neutral-400">
                        {query ? (
                            <>
                                <strong>&apos;{query}&apos;</strong> 검색 결과{' '}
                                <span className="text-blue-600 dark:text-blue-500 font-semibold">{filteredItems.length}</span>개
                            </>
                        ) : (
                            totalCountText(items.length)
                        )}
                    </p>
                </div>

                {/* 검색창 */}
                <div className="flex justify-start md:justify-end">
                    <SearchInput
                        id={searchId}
                        label={searchLabel}
                        value={query}
                        onChange={handleQueryChange}
                        placeholder={searchPlaceholder}
                    />
                </div>
            </div>

            {/* 필터링 결과 렌더링 */}
            {filteredItems.length > 0 ? (
                <div className={isPending ? 'opacity-70 transition-opacity' : ''}>
                    <AlignedGrid>
                        {filteredItems.map((item, index) => renderItem(item, index))}
                    </AlignedGrid>
                </div>
            ) : (
                /* 결과 없음 UI */
                <div className="flex flex-col items-center justify-center py-20 px-4 text-center border border-dashed border-neutral-200 dark:border-neutral-800 rounded-3xl bg-neutral-50/50 dark:bg-neutral-900/10 transition-colors">
                    <div className="p-4 bg-neutral-100 dark:bg-neutral-900 rounded-full text-neutral-400 dark:text-neutral-500 mb-4 shadow-inner">
                        <EmptyIcon className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-1">
                        {emptyTitle}
                    </h3>
                    <p className="text-neutral-500 dark:text-neutral-400 text-sm max-w-sm mb-6 leading-relaxed">
                        {emptyDescription ? (
                            emptyDescription(query)
                        ) : (
                            <>&apos;{query}&apos;에 매칭되는 결과를 찾지 못했습니다. 다른 단어로 검색해 보세요.</>
                        )}
                    </p>
                    <button
                        onClick={handleClearSearch}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-550 rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition duration-200"
                    >
                        검색 초기화
                    </button>
                </div>
            )}
        </div>
    );
}

export default SearchableList;
