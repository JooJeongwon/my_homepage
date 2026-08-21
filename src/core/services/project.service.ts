import { Project } from '@/core/models/project.model';

export interface IProjectRepository {
    getAllProjects(): Promise<Project[]>;
    getProjectBySlug(slug: string): Promise<Project | null>;
}

import { filterProjects } from '@/lib/search';

export { filterProjects };

export class ProjectService {
    constructor(private readonly projectRepository: IProjectRepository) {}

    /**
     * 모든 프로젝트 목록을 조회합니다.
     */
    async getAllProjects(): Promise<Project[]> {
        try {
            return await this.projectRepository.getAllProjects();
        } catch (error) {
            console.error('[ProjectService] 프로젝트 목록 로딩 실패:', error);
            return [];
        }
    }

    /**
     * 특정 slug에 해당하는 프로젝트 상세 정보를 조회합니다.
     */
    async getProjectBySlug(slug: string): Promise<Project | null> {
        try {
            return await this.projectRepository.getProjectBySlug(slug);
        } catch (error) {
            console.error(`[ProjectService] 프로젝트 상세 조회 실패 (${slug}):`, error);
            return null;
        }
    }

    /**
     * 주요 추천 프로젝트 목록을 지정된 개수만큼 조회합니다.
     */
    async getFeaturedProjects(limit: number = 2): Promise<Project[]> {
        const projects = await this.getAllProjects();
        return projects.slice(0, limit);
    }

    /**
     * 프로젝트 필터링 위임 메서드
     */
    filterProjects(projects: Project[], query: string): Project[] {
        return filterProjects(projects, query);
    }
}
