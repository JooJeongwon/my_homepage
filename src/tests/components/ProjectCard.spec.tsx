import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ProjectCard } from '@/components/ui/ProjectCard';
import { Project } from '@/domain/models/project.model';

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
    featured: true,
    links: {
        github: 'https://github.com/example/test',
        demo: 'https://example.com',
    },
};

describe('ProjectCard Accessibility & Keyboard Navigation (POUR Operable)', () => {
    it('ProjectCard 요소가 키보드 포커스(tabIndex=0) 가능하고 Enter/Space 입력 시 이동해야 한다', () => {
        render(<ProjectCard project={sampleProject} />);

        const card = screen.getByRole('link', { name: /Test Project Title/i });
        expect(card).toBeInTheDocument();
        expect(card).toHaveAttribute('tabindex', '0');

        // Enter 키 입력 시 push 호출 확인
        fireEvent.keyDown(card, { key: 'Enter', code: 'Enter' });
        expect(mockPush).toHaveBeenCalledWith('/projects/test-project');

        // Space 키 입력 시 push 호출 확인
        fireEvent.keyDown(card, { key: ' ', code: 'Space' });
        expect(mockPush).toHaveBeenCalledWith('/projects/test-project');
    });
});
