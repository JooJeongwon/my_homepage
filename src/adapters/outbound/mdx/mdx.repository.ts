import fs from 'fs';
import path from 'path';
import matter from 'gray-matter'; // 파일의 메타데이터 파싱
import { PostRepository } from '@/domain/ports/post.repository';
import { Post, PostSchema } from '@/domain/models/post.model';

const POSTS_PATH = path.join(process.cwd(), 'content/posts');

export class MdxPostRepository implements PostRepository {

    async getAllPosts(): Promise<Post[]> {
        // 1. 폴더가 없으면 빈 배열 반환 (에러 방지)
        if (!fs.existsSync(POSTS_PATH)) return [];

        // 2. 모든 파일 이름 가져오기
        const files = fs.readdirSync(POSTS_PATH);

        const posts = files
            .filter((file) => file.endsWith('.mdx') || file.endsWith('.md'))
            .map((file) => {
                const filePath = path.join(POSTS_PATH, file);
                const fileContent = fs.readFileSync(filePath, 'utf-8');
                const { data } = matter(fileContent);

                const slug = file.replace(/\.mdx?$/, '');

                // 3. 데이터 매핑 및 Zod 검증 (중요!)
                // 우리가 정의한 PostSchema에 맞는지 검사하고 변환합니다.
                try {
                    return PostSchema.parse({
                        id: slug, // 파일명을 ID로 사용
                        slug: slug,
                        title: data.title || 'Untitled',
                        date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
                        description: data.description || '',
                        tags: data.tags || [],
                        thumbnail: data.thumbnail,
                        content: "", // 목록 조회 시 내용 제외하여 메모리 최적화
                    });
                } catch (error) {
                    console.error(`Error parsing post ${file}:`, error);
                    return null;
                }
            })
            .filter((post): post is Post => post !== null) // 파싱 실패한 글 제외
            .sort((a, b) => (new Date(b.date).getTime() - new Date(a.date).getTime())); // 최신순 정렬

        return posts;
    }

    async getPostBySlug(slug: string): Promise<Post | null> {
        const filePath = path.join(POSTS_PATH, `${slug}.mdx`);

        // 파일이 없으면 null 반환
        if (!fs.existsSync(filePath)) return null;

        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const { data, content } = matter(fileContent);

        try {
            return PostSchema.parse({
                id: slug,
                slug: slug,
                title: data.title,
                date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
                description: data.description || '',
                tags: data.tags || [],
                thumbnail: data.thumbnail,
                content: content,
            });
        } catch (error) {
            console.error(`Error parsing post ${slug}:`, error);
            return null;
        }
    }
}