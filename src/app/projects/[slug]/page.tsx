import { projectService } from '@/infrastructure/mdx/mdx-project.repository';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Github, Globe, Calendar, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { extractHeadings } from '@/lib/toc';
import { TableOfContents } from '@/components/mdx/TableOfContents';
import { MdxRenderer } from '@/components/mdx/MdxRenderer';
import { formatDate } from '@/lib/date';

export async function generateMetadata({
    params
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const project = await projectService.getProjectBySlug(slug);

    if (!project) {
        return {};
    }

    const description = project.description || project.content?.slice(0, 160);

    return {
        title: `${project.title} | jwjoo Projects`,
        description,
        openGraph: {
            title: `${project.title} | jwjoo Projects`,
            description,
            type: 'website',
            images: project.thumbnail ? [project.thumbnail] : undefined,
        },
    };
}

export async function generateStaticParams() {
    const projects = await projectService.getAllProjects();

    return projects.map((project) => ({
        slug: project.slug,
    }));
}

export default async function ProjectDetailPage({
    params
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params;
    const project = await projectService.getProjectBySlug(slug);

    if (!project) {
        return notFound();
    }

    const headings = extractHeadings(project.content ?? "");

    return (
        <div className="relative w-full max-w-6xl mx-auto px-4 py-10">
            <TableOfContents headings={headings} />

            <article className="max-w-3xl min-w-0 w-full sm:w-[75%] sm:ml-[10%] lg:w-[70%] lg:ml-[8%] xl:w-full xl:mx-auto">
                <header className="mb-10 text-left border-b border-neutral-200 dark:border-neutral-800 pb-10">
                    <Link href="/projects" className="group inline-flex items-center gap-1 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 mb-6 transition-colors">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Projects
                    </Link>
                    <h1 className="text-4xl font-bold mb-4 text-neutral-800 dark:text-neutral-200">{project.title}</h1>
                    <p className="text-xl text-neutral-800 dark:text-neutral-200 mb-6 leading-relaxed">
                        {project.description}
                    </p>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 text-neutral-600 dark:text-neutral-400 text-sm mb-6">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" aria-hidden="true" />
                            <time dateTime={project.date}>{formatDate(project.date, 'YYYY.MM.DD')}</time>
                        </div>

                        <div className="flex gap-4">
                            {project.links?.github && (
                                <a href={project.links.github} target="_blank" rel="noreferrer"
                                    className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
                                    <Github className="w-4 h-4" />
                                    <span>Source Code</span>
                                </a>
                            )}
                            {project.links?.demo && (
                                <a href={project.links.demo} target="_blank" rel="noreferrer"
                                    className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
                                    <Globe className="w-4 h-4" />
                                    <span>Live Demo</span>
                                </a>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                            <span key={tag} className="px-2.5 py-0.5 rounded-md text-xs font-medium
                                bg-neutral-100 text-neutral-700 border border-neutral-200
                                dark:bg-neutral-800 dark:text-neutral-200 dark:border-neutral-700">
                                {tag}
                            </span>
                        ))}
                    </div>
                </header>

                <MdxRenderer source={project.content ?? ""} />
            </article>
        </div>
    );
}
