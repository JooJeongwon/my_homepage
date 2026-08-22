import { describe, it, expect, vi, beforeEach } from 'vitest';
import { metadata as rootMetadata } from '@/app/layout';
import { metadata as blogMetadata } from '@/app/blog/page';
import { metadata as projectsMetadata } from '@/app/projects/page';
import { generateMetadata as generateBlogMetadata } from '@/app/blog/[slug]/page';
import { generateMetadata as generateProjectMetadata } from '@/app/projects/[slug]/page';
import { postService } from '@/infrastructure/mdx/mdx-post.repository';
import { projectService } from '@/infrastructure/mdx/mdx-project.repository';

// Layout mocking for fonts and navigations
vi.mock('next/font/google', () => ({
    Inter: () => ({ className: 'inter-font' }),
}));

vi.mock('next/navigation', () => ({
    usePathname: () => '/',
    notFound: vi.fn(),
}));

describe('Metadata & Open Graph Specifications', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    describe('Root Layout Metadata', () => {
        it('기본 metadataBase 및 title 템플릿이 올바르게 설정되어야 한다', () => {
            expect(rootMetadata.metadataBase?.toString()).toBe('https://jwjoo.com/');
            expect(rootMetadata.title).toEqual({
                default: 'jwjoo Dev Log',
                template: '%s | jwjoo Dev Log',
            });
            expect(rootMetadata.openGraph?.siteName).toBe('jwjoo Dev Log');
            expect(rootMetadata.openGraph?.locale).toBe('ko_KR');
            expect(rootMetadata.twitter).toMatchObject({
                card: 'summary_large_image',
            });
        });
    });

    describe('Static List Pages Metadata', () => {
        it('블로그 목록 페이지 메타데이터가 올바르게 설정되어야 한다', () => {
            expect(blogMetadata.title).toBe('Blog');
            expect(blogMetadata.openGraph?.title).toBe('Blog | jwjoo Dev Log');
            expect(blogMetadata.openGraph?.url).toBe('/blog');
            expect(blogMetadata.alternates?.canonical).toBe('/blog');
        });

        it('프로젝트 목록 페이지 메타데이터가 올바르게 설정되어야 한다', () => {
            expect(projectsMetadata.title).toBe('Projects');
            expect(projectsMetadata.openGraph?.title).toBe('Projects | jwjoo Projects');
            expect(projectsMetadata.openGraph?.url).toBe('/projects');
            expect(projectsMetadata.alternates?.canonical).toBe('/projects');
        });
    });

    describe('Blog Detail Page generateMetadata', () => {
        it('포스트 정보가 주어지면 완전한 SEO 및 Open Graph 메타데이터를 동적으로 생성해야 한다', async () => {
            vi.spyOn(postService, 'getPostBySlug').mockResolvedValueOnce({
                id: '1',
                slug: 'clean-architecture-guide',
                title: 'Clean Architecture Guide',
                date: '2026-08-22',
                description: '클린 아키텍처 실전 가이드입니다.',
                tags: ['Architecture', 'Clean Code'],
                thumbnail: '/images/posts/clean-arch.png',
                content: '# Clean Architecture',
            });

            const metadata = await generateBlogMetadata({
                params: Promise.resolve({ slug: 'clean-architecture-guide' }),
            });

            expect(metadata.title).toBe('Clean Architecture Guide');
            expect(metadata.description).toBe('클린 아키텍처 실전 가이드입니다.');
            expect(metadata.keywords).toEqual(['Architecture', 'Clean Code']);
            expect(metadata.alternates?.canonical).toBe('/blog/clean-architecture-guide');

            // Open Graph
            expect(metadata.openGraph).toMatchObject({
                title: 'Clean Architecture Guide',
                description: '클린 아키텍처 실전 가이드입니다.',
                url: '/blog/clean-architecture-guide',
                siteName: 'jwjoo Dev Log',
                locale: 'ko_KR',
                type: 'article',
                publishedTime: '2026-08-22',
                authors: ['jwjoo'],
                tags: ['Architecture', 'Clean Code'],
                images: [{ url: '/images/posts/clean-arch.png', alt: 'Clean Architecture Guide' }],
            });

            // Twitter Card
            expect(metadata.twitter).toMatchObject({
                card: 'summary_large_image',
                title: 'Clean Architecture Guide',
                description: '클린 아키텍처 실전 가이드입니다.',
                images: ['/images/posts/clean-arch.png'],
            });
        });

        it('썸네일이 없는 포스트의 경우 images 속성을 undefined로 처리해야 한다', async () => {
            vi.spyOn(postService, 'getPostBySlug').mockResolvedValueOnce({
                id: '2',
                slug: 'no-thumbnail-post',
                title: 'No Thumbnail Post',
                date: '2026-08-22',
                description: '썸네일 없는 포스트',
                tags: ['General'],
                content: '본문 내용',
            });

            const metadata = await generateBlogMetadata({
                params: Promise.resolve({ slug: 'no-thumbnail-post' }),
            });

            expect(metadata.openGraph?.images).toBeUndefined();
            expect(metadata.twitter?.images).toBeUndefined();
        });

        it('존재하지 않는 포스트일 경우 fallback 메타데이터를 반환해야 한다', async () => {
            vi.spyOn(postService, 'getPostBySlug').mockResolvedValueOnce(null);

            const metadata = await generateBlogMetadata({
                params: Promise.resolve({ slug: 'non-existing-slug' }),
            });

            expect(metadata.title).toBe('Post Not Found');
            expect(metadata.description).toBe('요청하신 포스트를 찾을 수 없습니다.');
        });
    });

    describe('Project Detail Page generateMetadata', () => {
        it('프로젝트 정보가 주어지면 완전한 SEO 및 Open Graph 메타데이터를 동적으로 생성해야 한다', async () => {
            vi.spyOn(projectService, 'getProjectBySlug').mockResolvedValueOnce({
                id: '1',
                slug: 'my-homepage',
                title: 'My Dev Log & Portfolio',
                date: '2026.01 - 2026.08',
                description: 'Clean Architecture 기반의 기술 블로그 및 포트폴리오 웹사이트',
                tags: ['Next.js', 'Clean Architecture', 'TypeScript'],
                thumbnail: '/images/projects/homepage.png',
                content: '프로젝트 상세 내용',
            });

            const metadata = await generateProjectMetadata({
                params: Promise.resolve({ slug: 'my-homepage' }),
            });

            expect(metadata.title).toBe('My Dev Log & Portfolio');
            expect(metadata.description).toBe('Clean Architecture 기반의 기술 블로그 및 포트폴리오 웹사이트');
            expect(metadata.keywords).toEqual(['Next.js', 'Clean Architecture', 'TypeScript']);
            expect(metadata.alternates?.canonical).toBe('/projects/my-homepage');

            // Open Graph
            expect(metadata.openGraph).toMatchObject({
                title: 'My Dev Log & Portfolio',
                description: 'Clean Architecture 기반의 기술 블로그 및 포트폴리오 웹사이트',
                url: '/projects/my-homepage',
                siteName: 'jwjoo Dev Log',
                locale: 'ko_KR',
                type: 'website',
                images: [{ url: '/images/projects/homepage.png', alt: 'My Dev Log & Portfolio' }],
            });

            // Twitter Card
            expect(metadata.twitter).toMatchObject({
                card: 'summary_large_image',
                title: 'My Dev Log & Portfolio',
                description: 'Clean Architecture 기반의 기술 블로그 및 포트폴리오 웹사이트',
                images: ['/images/projects/homepage.png'],
            });
        });

        it('존재하지 않는 프로젝트일 경우 fallback 메타데이터를 반환해야 한다', async () => {
            vi.spyOn(projectService, 'getProjectBySlug').mockResolvedValueOnce(null);

            const metadata = await generateProjectMetadata({
                params: Promise.resolve({ slug: 'non-existing-project' }),
            });

            expect(metadata.title).toBe('Project Not Found');
            expect(metadata.description).toBe('요청하신 프로젝트를 찾을 수 없습니다.');
        });
    });
});
