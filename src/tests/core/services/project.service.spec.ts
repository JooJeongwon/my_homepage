import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ProjectService, IProjectRepository } from '@/core/services/project.service';
import { Project } from '@/core/models/project.model';

describe('ProjectService', () => {
    let mockRepo: IProjectRepository;
    let service: ProjectService;

    const sampleProjects: Project[] = [
        {
            id: '1',
            slug: 'project-1',
            title: '첫 번째 프로젝트',
            date: '2026.01 - 2026.02',
            description: '설명 1',
            tags: ['React'],
            content: '본문 1'
        },
        {
            id: '2',
            slug: 'project-2',
            title: '두 번째 프로젝트',
            date: '2025.10 - 2025.12',
            description: '설명 2',
            tags: ['Python'],
            content: '본문 2'
        },
        {
            id: '3',
            slug: 'project-3',
            title: '세 번째 프로젝트',
            date: '2025.05 - 2025.08',
            description: '설명 3',
            tags: ['Java'],
            content: '본문 3'
        }
    ];

    beforeEach(() => {
        mockRepo = {
            getAllProjects: vi.fn().mockResolvedValue(sampleProjects),
            getProjectBySlug: vi.fn().mockImplementation((slug: string) => {
                const found = sampleProjects.find((p) => p.slug === slug);
                return Promise.resolve(found || null);
            })
        };
        service = new ProjectService(mockRepo);
        vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('getAllProjects', () => {
        it('전체 프로젝트 목록을 반환한다', async () => {
            const projects = await service.getAllProjects();
            expect(projects).toEqual(sampleProjects);
            expect(mockRepo.getAllProjects).toHaveBeenCalledTimes(1);
        });

        it('레포지토리 실패 시 빈 배열을 반환한다', async () => {
            mockRepo.getAllProjects = vi.fn().mockRejectedValue(new Error('I/O error'));
            const projects = await service.getAllProjects();
            expect(projects).toEqual([]);
        });
    });

    describe('getProjectBySlug', () => {
        it('존재하는 slug 조회 시 해당 프로젝트를 반환한다', async () => {
            const project = await service.getProjectBySlug('project-2');
            expect(project?.title).toBe('두 번째 프로젝트');
            expect(mockRepo.getProjectBySlug).toHaveBeenCalledWith('project-2');
        });

        it('존재하지 않는 slug 조회 시 null을 반환한다', async () => {
            const project = await service.getProjectBySlug('unknown');
            expect(project).toBeNull();
        });

        it('레포지토리 실패 시 null을 반환한다', async () => {
            mockRepo.getProjectBySlug = vi.fn().mockRejectedValue(new Error('Disk error'));
            const project = await service.getProjectBySlug('project-1');
            expect(project).toBeNull();
        });
    });

    describe('getFeaturedProjects', () => {
        it('추천 프로젝트를 지정된 limit 개수만큼 반환한다 (기본값 2개)', async () => {
            const featured = await service.getFeaturedProjects(2);
            expect(featured).toHaveLength(2);
            expect(featured[0].slug).toBe('project-1');
            expect(featured[1].slug).toBe('project-2');
        });
    });

    describe('filterProjects', () => {
        it('검색 필터 유틸을 통해 검색된 프로젝트를 반환한다', () => {
            const result = service.filterProjects(sampleProjects, 'Python');
            expect(result).toHaveLength(1);
            expect(result[0].slug).toBe('project-2');
        });
    });
});
