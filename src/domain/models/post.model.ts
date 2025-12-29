import { z } from 'zod';

// 1. Zod 스키마 정의 (Runtime Validation)
// 이 규칙에 맞지 않는 데이터는 아예 시스템에 들어오지 못하게 막습니다.
export const PostSchema = z.object({
    id: z.string(),              // 고유 ID
    slug: z.string(),            // URL 주소 (예: my-first-post)
    title: z.string(),           // 제목
    date: z.string(),            // 날짜 (ISO String 권장)
    description: z.string(),     // 요약글 (카드에 보여줄 내용)
    tags: z.array(z.string()),   // 태그 목록
    thumbnail: z.string().optional(), // 썸네일 (없을 수도 있음)
    content: z.string().optional()    // 본문 내용 (목록 조회할 땐 없을 수도 있음)
});

// 2. TypeScript 타입 추출 (Compile-time Check)
// 위 스키마를 바탕으로 타입을 자동 생성합니다. (interface Post { ... } 와 동일)
export type Post = z.infer<typeof PostSchema>;