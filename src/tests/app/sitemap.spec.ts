import { describe, it, expect, vi, beforeEach } from 'vitest';
import sitemap from '@/app/sitemap';
import { postService } from '@/infrastructure/mdx/mdx-post.repository';
import { projectService } from '@/infrastructure/mdx/mdx-project.repository';

describe('Sitemap Specification', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it('기본 정적 라우트와 동적 포스트/프로젝트 URL을 포함한 sitemap을 생성해야 한다', async () => {
        vi.spyOn(postService, 'getAllPosts').mockResolvedValueOnce([
            {
                id: '1',
                slug: 'clean-architecture-guide',
                title: 'Clean Architecture Guide',
                date: '2026-08-22',
                description: '가이드',
                tags: ['Architecture'],
            },
        ]);

        vi.spyOn(projectService, 'getAllProjects').mockResolvedValueOnce([
            {
                id: '1',
                slug: 'my-homepage',
                title: 'My Portfolio',
                date: '2026.01 - 2026.08',
                description: '포트폴리오',
                tags: ['Next.js'],
            },
        ]);

        const result = await sitemap();

        // 1. 기본 정적 라우트 확인
        const urls = result.map((item) => item.url);
        expect(urls).toContain('https://jwjoo.com');
        expect(urls).toContain('https://jwjoo.com/blog');
        expect(urls).toContain('https://jwjoo.com/projects');

        // 2. 동적 블로그 포스트 라우트 확인
        const postEntry = result.find((item) => item.url === 'https://jwjoo.com/blog/clean-architecture-guide');
        expect(postEntry).toBeDefined();
        expect(postEntry?.changeFrequency).toBe('weekly');
        expect(postEntry?.priority).toBe(0.7);
        expect(postEntry?.lastModified).toBeInstanceOf(Date);

        // 3. 동적 프로젝트 라우트 확인
        const projectEntry = result.find((item) => item.url === 'https://jwjoo.com/projects/my-homepage');
        expect(projectEntry).toBeDefined();
        expect(projectEntry?.changeFrequency).toBe('monthly');
        expect(projectEntry?.priority).toBe(0.7);
        expect(projectEntry?.lastModified).toBeInstanceOf(Date);

        // 총 5개 (정적 3개 + 포스트 1개 + 프로젝트 1개)
        expect(result.length).toBe(5);
    });

    it('포스트 및 프로젝트 데이터가 비어있어도 정적 기본 라우트는 정상 생성되어야 한다', async () => {
        vi.spyOn(postService, 'getAllPosts').mockResolvedValueOnce([]);
        vi.spyOn(projectService, 'getAllProjects').mockResolvedValueOnce([]);

        const result = await sitemap();

        expect(result.length).toBe(3);
        const urls = result.map((item) => item.url);
        expect(urls).toEqual([
            'https://jwjoo.com',
            'https://jwjoo.com/blog',
            'https://jwjoo.com/projects',
        ]);
    });
});
