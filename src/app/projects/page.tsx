import { projectService } from '@/infrastructure/mdx/mdx-project.repository';
import SearchableProjectList from '@/components/project/SearchableProjectList';

export default async function ProjectsPage() {
    const projects = await projectService.getAllProjects();

    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <SearchableProjectList projects={projects} />
        </div>
    );
}
