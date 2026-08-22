'use client';

import React from 'react';
import type { Post } from '@/core/models/post.model';
import { filterPosts } from '@/lib/search';
import SearchableList from '@/components/common/SearchableList';
import PostCard from './PostCard';
import { FileQuestion } from 'lucide-react';

interface SearchablePostListProps {
    posts: Post[];
}

export default function SearchablePostList({ posts }: SearchablePostListProps) {
    return (
        <SearchableList
            title="All Posts"
            items={posts}
            filterFn={filterPosts}
            searchId="search-posts"
            searchLabel="포스트 검색"
            totalCountText={(count) => (
                <>총 <span className="font-semibold">{count}</span>개의 글이 작성되었습니다.</>
            )}
            emptyIcon={FileQuestion}
            emptyDescription={(query) => (
                <>&apos;{query}&apos;에 매칭되는 포스트를 찾지 못했습니다. 다른 단어로 검색해 보세요.</>
            )}
            renderItem={(post) => (
                <PostCard key={post.slug} post={post} />
            )}
        />
    );
}
