import Hero from '@/components/home/Hero';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Suspense } from 'react';
import FeaturedProjects from '@/components/home/FeaturedProjects';
import RecentPosts from '@/components/home/RecentPosts';
import { ProjectListSkeleton, PostListSkeleton } from '@/components/home/Skeletons';
import ContributionCalendar from '@/components/home/ContributionCalendar';

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* 히어로 섹션 (유지) */}
      <Hero />

      {/* 기여도 잔디 섹션 */}
      <section className="px-6" aria-label="GitHub 기여도 잔디">
        <ContributionCalendar />
      </section>

      {/* Featured Projects 섹션 */}
      <section className="px-6 pb-20" aria-labelledby="featured-projects-heading">
        <div className="flex items-center justify-between mb-8">
          <h2 id="featured-projects-heading" className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            Featured Projects
          </h2>
          <Link href="/projects" className="group flex items-center gap-1 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors rounded px-1.5 py-0.5">
            View All
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <Suspense fallback={<ProjectListSkeleton />}>
          <FeaturedProjects />
        </Suspense>
      </section>

      {/* 포스트 리스트 섹션 */}
      <section className="px-6 pb-20" aria-labelledby="recent-posts-heading">
        <div className="flex items-center justify-between mb-8">
          <h2 id="recent-posts-heading" className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            Recent Posts
          </h2>
          <Link href="/blog" className="group flex items-center gap-1 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors rounded px-1.5 py-0.5">
            Read More
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <Suspense fallback={<PostListSkeleton />}>
          <RecentPosts />
        </Suspense>
      </section>
    </div>
  );
}