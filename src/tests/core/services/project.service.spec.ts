import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProjectService, IProjectRepository } from '@/core/services/project.service';
import { Project } from '@/core/models/project.model';

describe('ProjectService Domain Service Unit Tests', () => {
    let mockProjectRepository: IProjectRepository;
    let projectService: ProjectService;

    const mockProjects: Project[] = [
        {
            id: '1',
            slug: 'portfolio-v1',
            title: '개인 포트폴리오 웹사이트',
            date: '2026.01 - 2026.02',
            description: 'Next.js 기반 클린 아키텍처 포트폴리오',
            tags: ['Next.js', 'React', 'Tailwind'],
            thumbnail: '/project1.png',
            links: {
                github: 'https://github.com/example/portfolio',
                demo: 'https://jwjoo.com'
            },
            content: '포트폴리오 상세 설계 및 기술 스택 설명'
        },
        {
            id: '2',
            slug: 'ai-emotion-chat',
            title: '감정 분석 AI 챗봇',
            date: '2025.10 - 2025.12',
            description: '자연어 처리를 활용한 실시간 대화 서비스',
            tags: ['Python', 'FastAPI', 'AI'],
            links: {
                github: 'https://github.com/example/ai-chat'
            },
            content: 'FastAPI 및 Transformer 모델 기반 서빙'
        },
        {
            id: '3',
            slug: 'hyodream',
            title: '효드림 시니어 케어 플랫폼',
            date: '2025.05 - 2025.08',
            description: '시니어 맞춤형 라이프 케어 O2O 서비스',
            tags: ['Spring Boot', 'Java', 'MySQL'],
            content: '동시성 제어 및 비동기 알림 아키텍처'
        }
    ];

    beforeEach(() => {
        mockProjectRepository = {
            getAllProjects: vi.fn().mockResolvedValue(mockProjects),
            getProjectBySlug: vi.fn().mockImplementation((slug: string) => {
                const found = mockProjects.find((p) => p.slug === slug);
                return Promise.resolve(found || null);
            })
        };
        projectService = new ProjectService(mockProjectRepository);
    });

    describe('getAllProjects', () => {
        it('모든 프로젝트 목록을 정상적으로 반환해야 한다', async () => {
            const projects = await projectService.getAllProjects();
            expect(projects).toHaveLength(3);
            expect(projects[0].slug).toBe('portfolio-v1');
            expect(mockProjectRepository.getAllProjects).toHaveBeenCalledTimes(1);
        });

        it('레포지토리 실패 시 빈 배열을 반환해야 한다', async () => {
            const errorRepo: IProjectRepository = {
                getAllProjects: vi.fn().mockRejectedValue(new Error('I/O error')),
                getProjectBySlug: vi.fn().mockRejectedValue(new Error('I/O error'))
            };
            const errorService = new ProjectService(errorRepo);
            const projects = await errorService.getAllProjects();
            expect(projects).toEqual([]);
        });
    });

    describe('getProjectBySlug', () => {
        it('존재하는 slug로 조회 시 해당 프로젝트를 반환해야 한다', async () => {
            const project = await projectService.getProjectBySlug('ai-emotion-chat');
            expect(project).not.toBeNull();
            expect(project?.title).toBe('감정 분석 AI 챗봇');
            expect(mockProjectRepository.getProjectBySlug).toHaveBeenCalledWith('ai-emotion-chat');
        });

        it('존재하지 않는 slug로 조회 시 null을 반환해야 한다', async () => {
            const project = await projectService.getProjectBySlug('not-found');
            expect(project).toBeNull();
        });

        it('레포지토리 오류 발생 시 null을 반환해야 한다', async () => {
            const errorRepo: IProjectRepository = {
                getAllProjects: vi.fn().mockRejectedValue(new Error('Disk error')),
                getProjectBySlug: vi.fn().mockRejectedValue(new Error('Disk error'))
            };
            const errorService = new ProjectService(errorRepo);
            const project = await errorService.getProjectBySlug('portfolio-v1');
            expect(project).toBeNull();
        });
    });

    describe('getFeaturedProjects', () => {
        it('추천 프로젝트를 지정된 개수(기본값 2개)만큼 반환해야 한다', async () => {
            const featured = await projectService.getFeaturedProjects();
            expect(featured).toHaveLength(2);
            expect(featured[0].slug).toBe('portfolio-v1');
            expect(featured[1].slug).toBe('ai-emotion-chat');
        });

        it('지정된 limit 파라미터 개수만큼 반환해야 한다', async () => {
            const featured = await projectService.getFeaturedProjects(1);
            expect(featured).toHaveLength(1);
            expect(featured[0].slug).toBe('portfolio-v1');
        });
    });

    describe('filterProjects (한글 검색 및 다차원 필터링)', () => {
        it('검색어가 비어있거나 공백인 경우 원본 프로젝트 배열을 반환해야 한다', () => {
            expect(projectService.filterProjects(mockProjects, '')).toEqual(mockProjects);
            expect(projectService.filterProjects(mockProjects, '   ')).toEqual(mockProjects);
        });

        it('제목(title)에 포함된 키워드로 대소문자 무관하게 검색할 수 있어야 한다', () => {
            const result = projectService.filterProjects(mockProjects, '포트폴리오');
            expect(result).toHaveLength(1);
            expect(result[0].slug).toBe('portfolio-v1');
        });

        it('설명(description)에 포함된 키워드로 검색할 수 있어야 한다', () => {
            const result = projectService.filterProjects(mockProjects, '자연어 처리');
            expect(result).toHaveLength(1);
            expect(result[0].slug).toBe('ai-emotion-chat');
        });

        it('태그(tags)에 포함된 키워드로 검색할 수 있어야 한다', () => {
            const result = projectService.filterProjects(mockProjects, 'FastAPI');
            expect(result).toHaveLength(1);
            expect(result[0].slug).toBe('ai-emotion-chat');
        });

        it('본문(content)에 포함된 키워드로 검색할 수 있어야 한다', () => {
            const result = projectService.filterProjects(mockProjects, '동시성 제어');
            expect(result).toHaveLength(1);
            expect(result[0].slug).toBe('hyodream');
        });

        it('한글 입력기(IME) 조합 중 미완성 자모(예: "시니어ㅅ")가 붙어도 정상 검색되어야 한다', () => {
            const result = projectService.filterProjects(mockProjects, '시니어ㅅ');
            expect(result).toHaveLength(1);
            expect(result[0].slug).toBe('hyodream');
        });

        it('매칭 결과가 없으면 빈 배열을 반환해야 한다', () => {
            const result = projectService.filterProjects(mockProjects, '일치하지않는단어');
            expect(result).toEqual([]);
        });
    });
});
