import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Project, ProjectSchema } from '@/core/models/project.model';
import { IProjectRepository, ProjectService } from '@/core/services/project.service';

const PROJECTS_PATH = path.join(process.cwd(), 'content/projects');

export class MdxProjectRepository implements IProjectRepository {
    async getAllProjects(): Promise<Project[]> {
        try {
            if (!fs.existsSync(PROJECTS_PATH)) return [];

            const files = fs.readdirSync(PROJECTS_PATH);

            const projects = files
                .filter((file) => file.endsWith('.mdx') || file.endsWith('.md'))
                .map((file) => {
                    try {
                        const filePath = path.join(PROJECTS_PATH, file);
                        const fileContent = fs.readFileSync(filePath, 'utf-8');
                        const { data } = matter(fileContent);
                        const slug = file.replace(/\.mdx?$/, '');

                        return ProjectSchema.parse({
                            id: slug,
                            slug: slug,
                            title: data.title || 'Untitled',
                            date: data.date || '',
                            description: data.description || '',
                            tags: data.tags || [],
                            thumbnail: data.thumbnail,
                            links: data.links,
                            content: '',
                        });
                    } catch (error) {
                        console.error(`[MdxProjectRepository] Error parsing project ${file}:`, error);
                        return null;
                    }
                })
                .filter((project): project is Project => project !== null)
                .sort((a, b) => b.date.localeCompare(a.date));

            return projects;
        } catch (error) {
            console.error('[MdxProjectRepository] Error reading projects directory:', error);
            return [];
        }
    }

    async getProjectBySlug(slug: string): Promise<Project | null> {
        try {
            const filePath = path.join(PROJECTS_PATH, `${slug}.mdx`);

            if (!fs.existsSync(filePath)) return null;

            const fileContent = fs.readFileSync(filePath, 'utf-8');
            const { data, content } = matter(fileContent);

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
            console.error(`[MdxProjectRepository] Error parsing project ${slug}:`, error);
            return null;
        }
    }
}

// 서버 컴포넌트용 기본 싱글톤 서비스 인스턴스
export const projectService = new ProjectService(new MdxProjectRepository());
