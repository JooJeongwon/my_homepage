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
        e.stopPropagation(); // 카드 클릭 이벤트가 발생하지 않도록 차단
    };

    return (
        <article 
            onClick={handleCardClick}
            className="flex flex-col h-full border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 
            bg-white dark:bg-neutral-900/50 cursor-pointer
            hover:shadow-xl dark:hover:bg-neutral-900
            hover:-translate-y-1 transition-all duration-300 ease-out group"
        >
            <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-200 group-hover:text-blue-600 dark:group-hover:text-blue-550 transition-colors">
                    {project.title}
                </h2>
            </div>

            <p className="text-neutral-700 dark:text-neutral-300 text-sm mb-6 min-h-[60px] leading-relaxed line-clamp-3">
                {project.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-6 mt-auto">
                {project.tags.map(tag => (
                    <span key={tag} className="px-2.5 py-0.5 rounded-md text-xs font-medium
                        bg-neutral-100 text-neutral-700 border border-neutral-200
                        dark:bg-neutral-800 dark:text-neutral-200 dark:border-neutral-700
                        group-hover:border-neutral-300 dark:group-hover:border-neutral-600 transition-colors">
                        {tag}
                    </span>
                ))}
            </div>

            <div className="flex gap-4 mt-auto text-sm font-medium">
                {project.links?.github && (
                    <a
                        href={project.links.github}
                        target="_blank"
                        rel="noreferrer"
                        onClick={handleLinkClick}
                        className="flex items-center gap-1 text-neutral-600 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-550 transition-colors z-10"
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
                        className="flex items-center gap-1 text-neutral-600 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-550 transition-colors z-10"
                        title="View Live Demo"
                    >
                        <Globe className="w-4 h-4" />
                        Demo
                    </a>
                )}
            </div>
        </article>
    );
}
