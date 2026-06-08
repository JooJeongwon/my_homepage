import { getGetAllProjectsUseCase } from '@/di/project.module';
import SearchableProjectList from '@/components/ui/SearchableProjectList';

export default async function ProjectsPage() {
    const useCase = getGetAllProjectsUseCase();
    const projects = await useCase.execute();

    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <SearchableProjectList projects={projects} />
        </div>
    );
}
