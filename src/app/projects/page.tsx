import { getGetAllProjectsUseCase } from '@/di/project.module';
import { ProjectCard } from '@/components/ui/ProjectCard';
import { AlignedGrid } from '@/components/ui/AlignedGrid';

export default async function ProjectsPage() {
    const useCase = getGetAllProjectsUseCase();
    const projects = await useCase.execute();

    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <h1 className="text-3xl font-bold mb-8 text-neutral-900 dark:text-neutral-200">Projects</h1>

            <AlignedGrid alignSelectors={['.js-align-title', '.js-align-desc']}>
                {projects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                ))}
            </AlignedGrid>
        </div>
    );
}
