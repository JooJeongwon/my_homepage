import { Project } from '../models/project.model';

export interface ProjectRepository {
    // 모든 프로젝트 목록 가져오기
    getAllProjects(): Promise<Project[]>;

    // 특정 프로젝트 상세 정보 가져오기
    getProjectBySlug(slug: string): Promise<Project | null>;
}
