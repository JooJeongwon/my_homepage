import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ProjectCard } from '@/components/project/ProjectCard';
import { Project } from '@/core/models/project.model';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: mockPush,
    }),
}));

const sampleProject: Project = {
    id: 'proj-1',
    slug: 'test-project',
    title: 'Test Project Title',
    description: 'This is a test project description.',
    tags: ['React', 'Next.js'],
    date: '2026-07-30',
    links: {
        github: 'https://github.com/example/test',
        demo: 'https://example.com',
    },
};

describe('ProjectCard', () => {
    it('키보드 탐색(tabIndex=0) 및 Enter/Space 키 입력 시 상세 페이지로 이동한다', () => {
        render(<ProjectCard project={sampleProject} />);

        const card = screen.getByRole('link', { name: /Test Project Title/i });
        expect(card).toBeInTheDocument();
        expect(card).toHaveAttribute('tabindex', '0');

        fireEvent.keyDown(card, { key: 'Enter', code: 'Enter' });
        expect(mockPush).toHaveBeenCalledWith('/projects/test-project');

        fireEvent.keyDown(card, { key: ' ', code: 'Space' });
        expect(mockPush).toHaveBeenCalledWith('/projects/test-project');
    });
});
