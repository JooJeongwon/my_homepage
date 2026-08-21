'use client';

import Link from 'next/link';
import { Github, Globe } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Project } from '@/core/models/project.model';

interface ProjectCardProps {
    project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
    const router = useRouter();

    return (
        <article
            className="border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 
            bg-white dark:bg-neutral-900/50 relative
            hover:shadow-xl dark:hover:bg-neutral-900
            hover:-translate-y-1 transition duration-300 ease-out group
            grid row-span-4 mb-6"
            style={{ gridTemplateRows: 'subgrid' }}
        >
            <div className="flex justify-between items-start pb-4">
                <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200 group-hover:text-blue-600 dark:group-hover:text-blue-550 transition-colors line-clamp-2">
                    <Link
                        href={`/projects/${project.slug}`}
                        tabIndex={0}
                        aria-label={`${project.title} 프로젝트 상세보기`}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                router.push(`/projects/${project.slug}`);
                            }
                        }}
                        className="focus:outline-none after:absolute after:inset-0"
                    >
                        {project.title}
                    </Link>
                </h2>
            </div>

            <div className="pb-6">
                <p className="text-neutral-700 dark:text-neutral-300 text-sm leading-relaxed line-clamp-3 break-words">
                    {project.description}
                </p>
            </div>

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

            <div className="flex items-center justify-between self-end z-10">
                <div className="flex gap-4 text-sm font-medium">
                    {project.links?.github && (
                        <a
                            href={project.links.github}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors relative z-10"
                            aria-label="GitHub 소스코드 (새 창 열림)"
                        >
                            <Github className="w-4 h-4" aria-hidden="true" />
                            Code
                        </a>
                    )}
                    {project.links?.demo && (
                        <a
                            href={project.links.demo}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors relative z-10"
                            aria-label="데모 시연 (새 창 열림)"
                        >
                            <Globe className="w-4 h-4" aria-hidden="true" />
                            Demo
                        </a>
                    )}
                </div>
                <time dateTime={project.date} className="text-neutral-600 dark:text-neutral-400 text-xs font-medium whitespace-nowrap">
                    {project.date}
                </time>
            </div>
        </article>
    );
}
