import { projectService } from '@/infrastructure/mdx/mdx-project.repository';
import { ProjectCard } from '@/components/project/ProjectCard';
import { AlignedGrid } from '@/components/common/AlignedGrid';

export default async function FeaturedProjects() {
  const featuredProjects = await projectService.getFeaturedProjects(2);

  return (
    <AlignedGrid>
      {featuredProjects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </AlignedGrid>
  );
}
