import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { ProjectRepository } from '@/domain/ports/project.repository';
import { Project, ProjectSchema } from '@/domain/models/project.model';

const PROJECTS_PATH = path.join(process.cwd(), 'content/projects');

export class ProjectMdxRepository implements ProjectRepository {

    async getAllProjects(): Promise<Project[]> {
        if (!fs.existsSync(PROJECTS_PATH)) return [];

        const files = fs.readdirSync(PROJECTS_PATH);

        const projects = files
            .filter((file) => file.endsWith('.mdx') || file.endsWith('.md'))
            .map((file) => {
                const filePath = path.join(PROJECTS_PATH, file);
                const fileContent = fs.readFileSync(filePath, 'utf-8');
                const { data, content } = matter(fileContent);
                const slug = file.replace(/\.mdx?$/, '');

                try {
                    return ProjectSchema.parse({
                        id: slug,
                        slug: slug,
                        title: data.title || 'Untitled',
                        date: data.date || '', // "2023.01 - 2023.06" 등 자유 형식
                        description: data.description || '',
                        tags: data.tags || [],
                        thumbnail: data.thumbnail,
                        links: data.links,
                        content: "", // 목록 조회 시 내용 제외하여 메모리 최적화
                    });
                } catch (error) {
                    console.error(`Error parsing project ${file}:`, error);
                    return null;
                }
            })
            .filter((project): project is Project => project !== null)
            // 최신순 정렬 (문자열 기준)
            .sort((a, b) => b.date.localeCompare(a.date));

        return projects;
    }

    async getProjectBySlug(slug: string): Promise<Project | null> {
         const filePath = path.join(PROJECTS_PATH, `${slug}.mdx`);

        if (!fs.existsSync(filePath)) return null;

        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const { data, content } = matter(fileContent);

        try {
            return ProjectSchema.parse({
                id: slug,
                slug: slug,
                title: data.title,
                date: data.date,
                description: data.description || '',
                tags: data.tags || [],
                thumbnail: data.thumbnail,
                links: data.links,
                content: content,
            });
        } catch (error) {
            console.error(`Error parsing project ${slug}:`, error);
            return null;
        }
    }
}
