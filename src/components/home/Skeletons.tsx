import { AlignedGrid } from '@/components/ui/AlignedGrid';

export function ProjectCardSkeleton() {
  return (
    <article
      className="border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 
      bg-white dark:bg-neutral-900/50 grid row-span-4 mb-6"
      style={{ gridTemplateRows: 'subgrid' }}
    >
      {/* Row 1: 제목 */}
      <div className="pb-4">
        <div className="h-6 w-3/4 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
      </div>

      {/* Row 2: 설명 */}
      <div className="pb-6 space-y-2">
        <div className="h-4 w-full bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
        <div className="h-4 w-5/6 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
      </div>

      {/* Row 3: 태그 */}
      <div className="flex flex-wrap gap-2 content-start pb-6">
        <div className="h-6 w-12 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
        <div className="h-6 w-16 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
        <div className="h-6 w-14 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
      </div>

      {/* Row 4: 링크 & 날짜 */}
      <div className="flex items-center justify-between self-end w-full">
        <div className="flex gap-4">
          <div className="h-4 w-12 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
          <div className="h-4 w-12 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
        </div>
        <div className="h-4 w-16 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
      </div>
    </article>
  );
}

export function PostCardSkeleton() {
  return (
    <article
      className="border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 
      bg-white dark:bg-neutral-900/50 grid row-span-4 mb-6"
      style={{ gridTemplateRows: 'subgrid' }}
    >
      {/* Row 1: 제목 */}
      <div className="pb-4">
        <div className="h-6 w-5/6 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
      </div>

      {/* Row 2: 설명 */}
      <div className="pb-6 space-y-2">
        <div className="h-4 w-full bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
        <div className="h-4 w-11/12 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
        <div className="h-4 w-4/5 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
      </div>

      {/* Row 3: 태그 */}
      <div className="flex flex-wrap gap-2 content-start pb-6">
        <div className="h-6 w-14 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
        <div className="h-6 w-12 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
      </div>

      {/* Row 4: 하단 정보 영역 */}
      <div className="flex items-center justify-between self-end w-full">
        <div className="h-4 w-24 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
        <div className="h-4 w-16 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
      </div>
    </article>
  );
}

export function ProjectListSkeleton() {
  return (
    <AlignedGrid>
      <ProjectCardSkeleton />
      <ProjectCardSkeleton />
    </AlignedGrid>
  );
}

export function PostListSkeleton() {
  return (
    <AlignedGrid>
      <PostCardSkeleton />
      <PostCardSkeleton />
      <PostCardSkeleton />
      <PostCardSkeleton />
    </AlignedGrid>
  );
}
