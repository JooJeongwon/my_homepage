import { describe, it, expect, vi, afterEach } from 'vitest';
import { ProjectMdxRepository } from '@/adapters/outbound/mdx/project-mdx.repository';
import fs from 'fs';

describe('ProjectMdxRepository (FIRST Principle Infrastructure Adapter Test)', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('getAllProjects 호출 시 예외 없이 Project 배열을 반환해야 한다.', async () => {
        const repo = new ProjectMdxRepository();
        const projects = await repo.getAllProjects();

        expect(Array.isArray(projects)).toBe(true);
        if (projects.length > 0) {
            expect(projects[0]).toHaveProperty('id');
            expect(projects[0]).toHaveProperty('slug');
            expect(projects[0]).toHaveProperty('title');
        }
    });

    it('존재하지 않는 slug로 getProjectBySlug 조회 시 null을 반환해야 한다.', async () => {
        const repo = new ProjectMdxRepository();
        const project = await repo.getProjectBySlug('non-existent-project-999');

        expect(project).toBeNull();
    });

    it('존재하는 slug로 getProjectBySlug 조회 시 프로젝트 상세 데이터를 반환해야 한다.', async () => {
        const repo = new ProjectMdxRepository();
        const projects = await repo.getAllProjects();

        if (projects.length > 0) {
            const slug = projects[0].slug;
            const projectDetail = await repo.getProjectBySlug(slug);

            expect(projectDetail).not.toBeNull();
            expect(projectDetail?.slug).toBe(slug);
            expect(projectDetail?.content).toBeDefined();
        }
    });

    it('content 디렉터리가 없을 때 빈 배열을 반환해야 한다.', async () => {
        vi.spyOn(fs, 'existsSync').mockReturnValue(false);

        const repo = new ProjectMdxRepository();
        const projects = await repo.getAllProjects();

        expect(projects).toEqual([]);
    });

    it('파일 읽기 또는 파싱 실패 시 에러 발생 없이 해당 프로젝트를 제외(null)하고 빈 배열을 반환해야 한다.', async () => {
        vi.spyOn(fs, 'existsSync').mockReturnValue(true);
        vi.spyOn(fs, 'readdirSync').mockReturnValue(['broken.mdx' as unknown as import('fs').Dirent]);
        vi.spyOn(fs, 'readFileSync').mockImplementation(() => {
            throw new Error('Disk Read Failure');
        });

        const repo = new ProjectMdxRepository();
        const projects = await repo.getAllProjects();

        expect(projects).toEqual([]);
    });
});
