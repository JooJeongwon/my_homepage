import { getGetAllProjectsUseCase } from '@/di/project.module';
import { ProjectCard } from '@/components/ui/ProjectCard';

export default async function ProjectsPage() {
    const useCase = getGetAllProjectsUseCase();
    const projects = await useCase.execute();

    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <h1 className="text-3xl font-bold mb-8 text-neutral-900 dark:text-neutral-200">Projects</h1>

            <div className="grid gap-6 sm:grid-cols-2">
                {projects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                ))}
            </div>
        </div>
    );
}
