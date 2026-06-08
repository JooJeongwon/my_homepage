import { Post } from '@/domain/models/post.model';

export class FilterPostsUseCase {
    execute(posts: Post[], query: string): Post[] {
        if (!query || !query.trim()) {
            return posts;
        }

        let normalizedQuery = query.trim().toLowerCase();

        // 한글 입력기(IME) 조합 중 자모 분리 현상으로 인해
        // 검색어 끝에 완성되지 않은 자모(ㄱ-ㅎ, ㅏ-ㅣ)가 일시적으로 붙는 경우 이를 제외하고 매칭을 진행
        // 예: '기반ㅇ' -> '기반' (단, 쿼리 길이가 1인 외자는 그대로 유지)
        if (normalizedQuery.length > 1 && /[ㄱ-ㅎㅏ-ㅣ]$/.test(normalizedQuery)) {
            normalizedQuery = normalizedQuery.slice(0, -1).trim();
        }

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
}
