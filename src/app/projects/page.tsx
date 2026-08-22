import type { Metadata } from 'next';
import { projectService } from '@/infrastructure/mdx/mdx-project.repository';
import SearchableProjectList from '@/components/project/SearchableProjectList';

export const metadata: Metadata = {
    title: 'Projects',
    description: '진행한 주요 엔지니어링 프로젝트 및 포트폴리오 목록입니다.',
    alternates: {
        canonical: '/projects',
    },
    openGraph: {
        title: 'Projects | jwjoo Projects',
        description: '진행한 주요 엔지니어링 프로젝트 및 포트폴리오 목록입니다.',
        url: '/projects',
        siteName: 'jwjoo Dev Log',
        locale: 'ko_KR',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Projects | jwjoo Projects',
        description: '진행한 주요 엔지니어링 프로젝트 및 포트폴리오 목록입니다.',
    },
};

export default async function ProjectsPage() {
    const projects = await projectService.getAllProjects();

    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <SearchableProjectList projects={projects} />
        </div>
    );
}
