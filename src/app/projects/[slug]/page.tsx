import { getGetProjectDetailUseCase } from '@/di/project.module';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypeHighlight from 'rehype-highlight';
import { Github, Globe, Calendar } from 'lucide-react';
import Link from 'next/link';

export default async function ProjectDetailPage({
    params
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params;
    const useCase = getGetProjectDetailUseCase();
    const project = await useCase.execute(slug);

    if (!project) {
        return notFound();
    }

    return (
        <article className="max-w-3xl mx-auto py-10 px-4">
            <header className="mb-10 border-b border-neutral-200 dark:border-neutral-800 pb-10">
                <Link href="/projects" className="text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-550 mb-6 inline-block transition-colors">
                    ← Back to Projects
                </Link>
                <h1 className="text-4xl font-bold mb-4 text-neutral-900 dark:text-neutral-200">{project.title}</h1>
                <p className="text-xl text-neutral-800 dark:text-neutral-200 mb-6 leading-relaxed">
                    {project.description}
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 text-neutral-600 dark:text-neutral-400 text-sm mb-6">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{project.date}</span>
                    </div>

                    <div className="flex gap-4">
                        {project.links?.github && (
                            <a href={project.links.github} target="_blank" rel="noreferrer"
                                className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-550 transition-colors">
                                <Github className="w-4 h-4" />
                                <span>Source Code</span>
                            </a>
                        )}
                        {project.links?.demo && (
                            <a href={project.links.demo} target="_blank" rel="noreferrer"
                                className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-550 transition-colors">
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

            <div className="prose dark:prose-invert max-w-none 
                prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-6 prose-headings:text-neutral-900 dark:prose-headings:text-neutral-200
                prose-p:text-neutral-800 dark:prose-p:text-neutral-200 prose-p:leading-relaxed
                prose-a:text-blue-600 dark:prose-a:text-blue-550 prose-a:no-underline hover:prose-a:underline
                prose-li:text-neutral-800 dark:prose-li:text-neutral-200
                
                prose-pre:bg-neutral-900 dark:prose-pre:bg-neutral-900/50
                prose-pre:border prose-pre:border-neutral-200 dark:prose-pre:border-neutral-800
                prose-pre:rounded-2xl
                
                prose-code:text-neutral-800 dark:prose-code:text-neutral-200
                prose-code:bg-neutral-100 dark:prose-code:bg-neutral-800
                prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md
                prose-code:before:content-none prose-code:after:content-none
                
                [&_pre_code]:!bg-transparent [&_pre_code]:!p-0 [&_pre_code]:!border-0 [&_pre_code]:!text-inherit">
                <MDXRemote
                    source={project.content ?? ""}
                    options={{
                        mdxOptions: {
                            rehypePlugins: [rehypeHighlight],
                        },
                    }}
                />
            </div>
        </article>
    );
}
