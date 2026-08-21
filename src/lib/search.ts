import { Post } from '@/core/models/post.model';
import { Project } from '@/core/models/project.model';

/**
 * 한글 IME 입력 중 마지막 글자가 미완성 자모(ㄱ-ㅎ, ㅏ-ㅣ)로 분리되어 붙는 현상을 보정하는 헬퍼 함수
 */
function normalizeSearchQuery(query: string): string {
    if (!query || !query.trim()) {
        return '';
    }

    let normalized = query.trim().toLowerCase();

    // 두 글자 이상이고 끝 글자가 단일 자모(ㄱ-ㅎ, ㅏ-ㅣ)인 경우 마지막 자모를 제거하여 검색 안정성 향상
    if (normalized.length > 1 && /[ㄱ-ㅎㅏ-ㅣ]$/.test(normalized)) {
        normalized = normalized.slice(0, -1).trim();
    }

    return normalized;
}

/**
 * 검색어 쿼리를 바탕으로 블로그 포스트 목록을 필터링하는 순수 함수
 * Node.js 파일 시스템(fs) 의존성이 전혀 없으므로 Client Component에서 안전하게 사용 가능
 */
export function filterPosts(posts: Post[], query: string): Post[] {
    const normalizedQuery = normalizeSearchQuery(query);

    if (!normalizedQuery) {
        return posts;
    }

    return posts.filter((post) => {
        const matchTitle = post.title.toLowerCase().includes(normalizedQuery);
        const matchDescription = post.description.toLowerCase().includes(normalizedQuery);
        const matchTags = post.tags.some((tag) =>
            tag.toLowerCase().includes(normalizedQuery)
        );
        const matchContent = post.content
            ? post.content.toLowerCase().includes(normalizedQuery)
            : false;

        return matchTitle || matchDescription || matchTags || matchContent;
    });
}

/**
 * 검색어 쿼리를 바탕으로 프로젝트 목록을 필터링하는 순수 함수
 * Node.js 파일 시스템(fs) 의존성이 전혀 없으므로 Client Component에서 안전하게 사용 가능
 */
export function filterProjects(projects: Project[], query: string): Project[] {
    const normalizedQuery = normalizeSearchQuery(query);

    if (!normalizedQuery) {
        return projects;
    }

    return projects.filter((project) => {
        const matchTitle = project.title.toLowerCase().includes(normalizedQuery);
        const matchDescription = project.description.toLowerCase().includes(normalizedQuery);
        const matchTags = project.tags.some((tag) =>
            tag.toLowerCase().includes(normalizedQuery)
        );
        const matchContent = project.content
            ? project.content.toLowerCase().includes(normalizedQuery)
            : false;

        return matchTitle || matchDescription || matchTags || matchContent;
    });
}
