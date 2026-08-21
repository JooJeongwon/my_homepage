import { z } from 'zod';

// Project 도메인 모델 정의
export const ProjectSchema = z.object({
    id: z.string(),
    slug: z.string(),
    title: z.string(),
    date: z.string(),            // 프로젝트 수행 기간
    description: z.string(),     // 요약 설명
    tags: z.array(z.string()),   // 기술 스택 등 태그
    thumbnail: z.string().optional(),
    links: z.object({            // 관련 링크 (Github, Demo 등)
        github: z.string().optional(),
        demo: z.string().optional(),
    }).optional(),
    content: z.string().optional() // 상세 MDX 본문
});

export type Project = z.infer<typeof ProjectSchema>;
