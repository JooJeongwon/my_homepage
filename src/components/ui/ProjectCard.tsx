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
            // [핵심 1] flex-col과 h-full로 카드가 부모 그리드 높이를 꽉 채우게 함
            className="flex flex-col h-full border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 
            bg-white dark:bg-neutral-900/50 cursor-pointer
            hover:shadow-xl dark:hover:bg-neutral-900
            hover:-translate-y-1 transition duration-300 ease-out group"
        >
            <div className="js-align-title flex justify-between items-start mb-4">
                {/* [핵심 2] 고정 높이(h-14) 삭제. 
                    이제 page.tsx의 AlignedGrid가 이 h2를 잡아서 동적으로 높이를 맞춰줄 것임. */}
                <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200 group-hover:text-blue-600 dark:group-hover:text-blue-550 transition-colors line-clamp-2">
                    {project.title}
                </h2>
            </div>

            {/* [핵심 3] 고정 높이 삭제. 
               AlignedGrid가 p 태그 높이를 맞출 수 있게 풀어줌. */}
            <p className="js-align-desc text-neutral-700 dark:text-neutral-300 text-sm mb-6 leading-relaxed line-clamp-3 break-words">
                {project.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-6">
                {project.tags.map(tag => (
                    <span key={tag} className="px-2.5 py-0.5 rounded-md text-xs font-medium
                        bg-neutral-100 text-neutral-700 border border-neutral-200
                        dark:bg-neutral-800 dark:text-neutral-200 dark:border-neutral-700
                        group-hover:border-neutral-300 dark:group-hover:border-neutral-600 transition-colors">
                        {tag}
                    </span>
                ))}
            </div>

            {/* [핵심 4] mt-auto 추가. 
               위의 제목/설명/태그 길이가 달라도, 이 링크/날짜 박스부터는 
               무조건 카드 바닥 쪽으로 밀어버려서 위치를 강제로 맞춤. */}
            <div className="mt-auto">
                <div className="flex items-center justify-between">
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
            </div>
        </article>
    );
}