import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MdxProjectRepository } from '@/infrastructure/mdx/mdx-project.repository';
import fs from 'fs';

describe('MdxProjectRepository', () => {
    beforeEach(() => {
        vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('getAllProjects 호출 시 Project 배열을 반환한다', async () => {
        const repo = new MdxProjectRepository();
        const projects = await repo.getAllProjects();

        expect(Array.isArray(projects)).toBe(true);
        if (projects.length > 0) {
            expect(projects[0]).toHaveProperty('id');
            expect(projects[0]).toHaveProperty('slug');
            expect(projects[0]).toHaveProperty('title');
        }
    });

    it('존재하지 않는 slug로 getProjectBySlug 조회 시 null을 반환한다', async () => {
        const repo = new MdxProjectRepository();
        const project = await repo.getProjectBySlug('non-existent-project-999');

        expect(project).toBeNull();
    });

    it('존재하는 slug 조회 시 상세 데이터를 반환한다', async () => {
        const repo = new MdxProjectRepository();
        const projects = await repo.getAllProjects();

        if (projects.length > 0) {
            const slug = projects[0].slug;
            const projectDetail = await repo.getProjectBySlug(slug);

            expect(projectDetail).not.toBeNull();
            expect(projectDetail?.slug).toBe(slug);
            expect(projectDetail?.content).toBeDefined();
        }
    });

    it('content 디렉터리가 없으면 빈 배열을 반환한다', async () => {
        vi.spyOn(fs, 'existsSync').mockReturnValue(false);

        const repo = new MdxProjectRepository();
        const projects = await repo.getAllProjects();

        expect(projects).toEqual([]);
    });

    it('파일 읽기 실패 시 빈 배열을 안전하게 반환한다', async () => {
        vi.spyOn(fs, 'existsSync').mockReturnValue(true);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        vi.spyOn(fs, 'readdirSync').mockReturnValue(['broken.mdx'] as any);
        vi.spyOn(fs, 'readFileSync').mockImplementation(() => {
            throw new Error('Disk Read Failure');
        });

        const repo = new MdxProjectRepository();
        const projects = await repo.getAllProjects();

        expect(projects).toEqual([]);
    });
});
