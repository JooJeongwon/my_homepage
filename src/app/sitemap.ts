import type { MetadataRoute } from 'next';
import { postService } from '@/infrastructure/mdx/mdx-post.repository';
import { projectService } from '@/infrastructure/mdx/mdx-project.repository';
import { parseDate } from '@/lib/date';

export const dynamic = 'force-static';

const BASE_URL = 'https://jwjoo.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const [posts, projects] = await Promise.all([
        postService.getAllPosts(),
        projectService.getAllProjects(),
    ]);

    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: `${BASE_URL}/blog`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/projects`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
    ];

    const postRoutes: MetadataRoute.Sitemap = posts.map((post) => {
        const parsed = parseDate(post.date);
        const lastModified = parsed
            ? new Date(Date.UTC(parsed.year, parsed.month - 1, parsed.day || 1))
            : new Date();

        return {
            url: `${BASE_URL}/blog/${post.slug}`,
            lastModified,
            changeFrequency: 'weekly',
            priority: 0.7,
        };
    });

    const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => {
        const parsed = parseDate(project.date);
        const lastModified = parsed
            ? new Date(Date.UTC(parsed.year, parsed.month - 1, parsed.day || 1))
            : new Date();

        return {
            url: `${BASE_URL}/projects/${project.slug}`,
            lastModified,
            changeFrequency: 'monthly',
            priority: 0.7,
        };
    });

    return [...staticRoutes, ...postRoutes, ...projectRoutes];
}
