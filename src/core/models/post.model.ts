import { z } from 'zod';

// 1. Zod 스키마 정의 (Runtime Validation)
export const PostSchema = z.object({
    id: z.string(),              // 고유 ID
    slug: z.string(),            // URL 주소 (예: my-first-post)
    title: z.string(),           // 제목
    date: z.string(),            // 날짜 (ISO String 권장)
    description: z.string(),     // 요약글 (카드에 보여줄 내용)
    tags: z.array(z.string()),   // 태그 목록
    thumbnail: z.string().optional(), // 썸네일 (선택적)
    content: z.string().optional(),    // 본문 내용 (목록 조회 시 제외 가능)
    readingTime: z.number().optional() // 읽는 시간 (분 단위)
});

// 2. TypeScript 타입 추출 (Compile-time Check)
export type Post = z.infer<typeof PostSchema>;
