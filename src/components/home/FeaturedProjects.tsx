import { getGetFeaturedProjectsUseCase } from '@/di/project.module';
import { ProjectCard } from '@/components/ui/ProjectCard';
import { AlignedGrid } from '@/components/ui/AlignedGrid';

export default async function FeaturedProjects() {
  const getFeaturedProjects = getGetFeaturedProjectsUseCase();
  const featuredProjects = await getFeaturedProjects.execute(2);

  return (
    <AlignedGrid>
      {featuredProjects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </AlignedGrid>
  );
}

