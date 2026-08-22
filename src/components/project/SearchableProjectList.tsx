'use client';

import React from 'react';
import type { Project } from '@/core/models/project.model';
import { filterProjects } from '@/lib/search';
import SearchableList from '@/components/common/SearchableList';
import { ProjectCard } from './ProjectCard';
import { FolderHeart } from 'lucide-react';

interface SearchableProjectListProps {
    projects: Project[];
}

export default function SearchableProjectList({ projects }: SearchableProjectListProps) {
    return (
        <SearchableList
            title="Projects"
            items={projects}
            filterFn={filterProjects}
            searchId="search-projects"
            searchLabel="프로젝트 검색"
            totalCountText={(count) => (
                <>총 <span className="font-semibold">{count}</span>개의 프로젝트가 진행되었습니다.</>
            )}
            emptyIcon={FolderHeart}
            emptyDescription={(query) => (
                <>&apos;{query}&apos;에 매칭되는 프로젝트를 찾지 못했습니다. 다른 단어나 기술 스택으로 검색해 보세요.</>
            )}
            renderItem={(project) => (
                <ProjectCard key={project.id} project={project} />
            )}
        />
    );
}
