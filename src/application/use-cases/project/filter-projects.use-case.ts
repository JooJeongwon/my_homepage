import { Project } from '@/domain/models/project.model';

export class FilterProjectsUseCase {
    execute(projects: Project[], query: string): Project[] {
        if (!query || !query.trim()) {
            return projects;
        }

        let normalizedQuery = query.trim().toLowerCase();

        // 한글 입력기(IME) 조합 중 자모 분리 현상으로 인해
        // 검색어 끝에 완성되지 않은 자모(ㄱ-ㅎ, ㅏ-ㅣ)가 일시적으로 붙는 경우 이를 제외하고 매칭을 진행
        // 예: '기반ㅇ' -> '기반' (단, 쿼리 길이가 1인 외자는 그대로 유지)
        if (normalizedQuery.length > 1 && /[ㄱ-ㅎㅏ-ㅣ]$/.test(normalizedQuery)) {
            normalizedQuery = normalizedQuery.slice(0, -1).trim();
        }

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
}
