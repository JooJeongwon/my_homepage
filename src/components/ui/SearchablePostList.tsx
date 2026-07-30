'use client';

import React, { useState, useDeferredValue } from 'react';
import { Post } from '@/domain/models/post.model';
import { getFilterPostsUseCase } from '@/di/post.client.module';
import SearchInput from './SearchInput';
import { AlignedGrid } from './AlignedGrid';
import PostCard from './PostCard';
import { FileQuestion } from 'lucide-react';

interface SearchablePostListProps {
    posts: Post[];
}

const filterUseCase = getFilterPostsUseCase();

export default function SearchablePostList({ posts }: SearchablePostListProps) {
    const [query, setQuery] = useState('');
    const deferredQuery = useDeferredValue(query);

    // Use Case를 직접 호출하여 필터링 수행 (서버 의존성 격리)
    const filteredPosts = filterUseCase.execute(posts, deferredQuery);

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
                    <h1 className="text-3xl font-bold mb-2 text-neutral-900 dark:text-neutral-200">All Posts</h1>
                    <p className="text-neutral-500 dark:text-neutral-400">
                        {query ? (
                            <>
                                <strong>&apos;{query}&apos;</strong> 검색 결과{' '}
                                <span className="text-blue-600 dark:text-blue-500 font-semibold">{filteredPosts.length}</span>개
                            </>
                        ) : (
                            <>총 <span className="font-semibold">{posts.length}</span>개의 글이 작성되었습니다.</>
                        )}
                    </p>
                </div>
                
                {/* 검색창 */}
                <div className="flex justify-start md:justify-end">
                    <SearchInput
                        id="search-posts"
                        label="포스트 검색"
                        value={query}
                        onChange={handleQueryChange}
                        placeholder="Search ( ⌘ + k )"
                    />
                </div>
            </div>

            {/* 필터링 결과 렌더링 */}
            {filteredPosts.length > 0 ? (
                <div className={isPending ? 'opacity-70 transition-opacity' : ''}>
                    <AlignedGrid>
                        {filteredPosts.map((post) => (
                            <PostCard key={post.slug} post={post} />
                        ))}
                    </AlignedGrid>
                </div>
            ) : (
                /* 결과 없음 UI */
                <div className="flex flex-col items-center justify-center py-20 px-4 text-center border border-dashed border-neutral-200 dark:border-neutral-800 rounded-3xl bg-neutral-50/50 dark:bg-neutral-900/10 transition-colors">
                    <div className="p-4 bg-neutral-100 dark:bg-neutral-900 rounded-full text-neutral-400 dark:text-neutral-500 mb-4 shadow-inner">
                        <FileQuestion className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-1">
                        검색 결과가 없습니다
                    </h3>
                    <p className="text-neutral-500 dark:text-neutral-400 text-sm max-w-sm mb-6 leading-relaxed">
                        &apos;{query}&apos;에 매칭되는 포스트를 찾지 못했습니다. 다른 단어로 검색해 보세요.
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
