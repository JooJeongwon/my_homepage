import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Post, PostSchema } from '@/core/models/post.model';
import { IPostRepository, PostService } from '@/core/services/post.service';

const DEFAULT_POSTS_PATH = path.join(process.cwd(), 'content/posts');

export class MdxPostRepository implements IPostRepository {
    constructor(private readonly basePath: string = DEFAULT_POSTS_PATH) {}

    async getAllPosts(): Promise<Post[]> {
        try {
            if (!fs.existsSync(this.basePath)) return [];

            const files = fs.readdirSync(this.basePath);

            const posts = files
                .filter((file) => file.endsWith('.mdx') || file.endsWith('.md'))
                .map((file) => {
                    try {
                        const filePath = path.join(this.basePath, file);
                        const fileContent = fs.readFileSync(filePath, 'utf-8');
                        const { data, content } = matter(fileContent);

                        const slug = file.replace(/\.mdx?$/, '');

                        const wordCount = (data.description + (content || '')).split(/\s+/).length;
                        const readingTime = Math.ceil(wordCount / 200);

                        return PostSchema.parse({
                            id: slug,
                            slug: slug,
                            title: data.title || 'Untitled',
                            date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
                            description: data.description || '',
                            tags: data.tags || [],
                            thumbnail: data.thumbnail,
                            content: '',
                            readingTime: readingTime || 1,
                        });
                    } catch (error) {
                        console.error(`[MdxPostRepository] Error parsing post ${file}:`, error);
                        return null;
                    }
                })
                .filter((post): post is Post => post !== null)
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

            return posts;
        } catch (error) {
            console.error('[MdxPostRepository] Error reading posts directory:', error);
            return [];
        }
    }

    async getPostBySlug(slug: string): Promise<Post | null> {
        try {
            const filePath = path.join(this.basePath, `${slug}.mdx`);

            if (!fs.existsSync(filePath)) return null;

            const fileContent = fs.readFileSync(filePath, 'utf-8');
            const { data, content } = matter(fileContent);

            return PostSchema.parse({
                id: slug,
                slug: slug,
                title: data.title,
                date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
                description: data.description || '',
                tags: data.tags || [],
                thumbnail: data.thumbnail,
                content: content,
                readingTime: Math.ceil(content.split(/\s+/).length / 200) || 1,
            });
        } catch (error) {
            console.error(`[MdxPostRepository] Error parsing post ${slug}:`, error);
            return null;
        }
    }
}

// 서버 컴포넌트용 기본 싱글톤 서비스 인스턴스
export const postService = new PostService(new MdxPostRepository());
