'use client';

import { Github, Globe } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Project } from '@/domain/models/project.model';

interface ProjectCardProps {
    project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
    const router = useRouter();

    const handleCardClick = () => {
        router.push(`/projects/${project.slug}`);
    };

    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.stopPropagation();
    };

    return (
        <article
            onClick={handleCardClick}
            className="border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 
            bg-white dark:bg-neutral-900/50 cursor-pointer
            hover:shadow-xl dark:hover:bg-neutral-900
            hover:-translate-y-1 transition duration-300 ease-out group
            grid row-span-4 mb-6"
            style={{ gridTemplateRows: 'subgrid' }}
        >
            {/* Row 1: 제목 - 원래 mb-4였으므로 pb-4 추가 */}
            <div className="flex justify-between items-start pb-4">
                <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200 group-hover:text-blue-600 dark:group-hover:text-blue-550 transition-colors line-clamp-2">
                    {project.title}
                </h2>
            </div>

            {/* Row 2: 설명 - div로 감싸서 p가 subgrid 직접 자식이 아니게 함 (display: -webkit-box 작동 가능) */}
            <div className="pb-6">
                <p className="text-neutral-700 dark:text-neutral-300 text-sm leading-relaxed line-clamp-3 break-words">
                    {project.description}
                </p>
            </div>

            {/* Row 3: 태그 - 원래 mb-6였으므로 pb-6 추가 */}
            <div className="flex flex-wrap gap-2 content-start pb-6">
                {project.tags.map(tag => (
                    <span key={tag} className="px-2.5 py-0.5 rounded-md text-xs font-medium h-fit
                        bg-neutral-100 text-neutral-700 border border-neutral-200
                        dark:bg-neutral-800 dark:text-neutral-200 dark:border-neutral-700
                        group-hover:border-neutral-300 dark:group-hover:border-neutral-600 transition-colors">
                        {tag}
                    </span>
                ))}
            </div>

            {/* Row 4: 링크 & 날짜 (self-end로 바닥 정렬) */}
            <div className="flex items-center justify-between self-end">
                <div className="flex gap-4 text-sm font-medium">
                    {project.links?.github && (
                        <a
                            href={project.links.github}
                            target="_blank"
                            rel="noreferrer"
                            onClick={handleLinkClick}
                            className="flex items-center gap-1 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors z-10"
                            title="View Source Code"
                        >
                            <Github className="w-4 h-4" />
                            Code
                        </a>
                    )}
                    {project.links?.demo && (
                        <a
                            href={project.links.demo}
                            target="_blank"
                            rel="noreferrer"
                            onClick={handleLinkClick}
                            className="flex items-center gap-1 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors z-10"
                            title="View Live Demo"
                        >
                            <Globe className="w-4 h-4" />
                            Demo
                        </a>
                    )}
                </div>
                <span className="text-neutral-600 dark:text-neutral-400 text-xs font-medium whitespace-nowrap">
                    {project.date}
                </span>
            </div>
        </article>
    );
}