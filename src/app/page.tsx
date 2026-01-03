import { getGetRecentPostsUseCase } from '@/di/post.module';
import { getGetAllProjectsUseCase } from '@/di/project.module';
import PostCard from '@/components/ui/PostCard';
import { ProjectCard } from '@/components/ui/ProjectCard';
import { AlignedGrid } from '@/components/ui/AlignedGrid';
import Hero from '@/components/home/Hero';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default async function Home() {
  const getRecentPosts = getGetRecentPostsUseCase();
  const getAllProjects = getGetAllProjectsUseCase();

  const [posts, projects] = await Promise.all([
    getRecentPosts.execute(4),
    getAllProjects.execute()
  ]);

  // Show only 2 featured projects
  const featuredProjects = projects.slice(0, 2);

  return (
    <div className="max-w-4xl mx-auto">
      {/* 히어로 섹션 */}
      <Hero />

      {/* Featured Projects 섹션 */}
      <section className="px-6 pb-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            Featured Projects
          </h2>
          <Link href="/projects" className="group flex items-center gap-1 text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-550 transition-colors">
            View All
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <AlignedGrid>
          {featuredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </AlignedGrid>
      </section>

      {/* 포스트 리스트 섹션 */}
      <section className="px-6 pb-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            Recent Posts
          </h2>
          <Link href="/blog" className="group flex items-center gap-1 text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-550 transition-colors">
            Read More
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <AlignedGrid>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}

          {posts.length === 0 && (
            <div className="col-span-2 text-center py-20 text-neutral-500">
              아직 작성된 글이 없습니다.
            </div>
          )}
        </AlignedGrid>
      </section>
    </div>
  );
}
