import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import PostCard from '@/components/post/PostCard';
import { Post } from '@/core/models/post.model';

const samplePost: Post = {
    id: 'post-1',
    slug: 'welcome',
    title: 'Welcome to Dev Log',
    description: 'First test post description.',
    tags: ['Next.js', 'React'],
    date: '2026-01-04',
    readingTime: 3,
};

describe('PostCard', () => {
    it('포스트 정보와 formatDate(YYYY.MM.DD)로 변환된 날짜를 렌더링한다', () => {
        render(<PostCard post={samplePost} />);

        expect(screen.getByText('Welcome to Dev Log')).toBeInTheDocument();
        expect(screen.getByText('First test post description.')).toBeInTheDocument();
        expect(screen.getByText('3 min read')).toBeInTheDocument();
        expect(screen.getByText('2026.01.04')).toBeInTheDocument();
    });
});
