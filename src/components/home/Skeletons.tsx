import { AlignedGrid } from '@/components/common/AlignedGrid';

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

export function ContributionCalendarSkeleton({ isMobile = false }: { isMobile?: boolean }) {
  const weeksCount = isMobile ? 26 : 53;
  const cellSize = isMobile ? 10 : 12;
  const cellGap = 2;
  const weekWidth = cellSize + cellGap;
  const labelSpacer = isMobile ? 24 : 28;
  const minWidth = isMobile ? '334px' : '768px';
  const totalGridWidth = weeksCount * weekWidth - cellGap;

  return (
    <div className="border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 bg-white dark:bg-neutral-900/50 space-y-4 mb-12 animate-pulse w-full max-w-full overflow-hidden">
      <div className="flex justify-between items-center">
        <div className="h-6 w-48 bg-neutral-200 dark:bg-neutral-800 rounded" />
        <div className="h-4 w-24 bg-neutral-200 dark:bg-neutral-800 rounded" />
      </div>
      
      {/* 캘린더 잔디 격자 형태 모방 (가로 스크롤 영역 포함) */}
      <div className="relative">
        <div className="w-full overflow-x-auto pb-2 scrollbar-none">
          <div style={{ minWidth }} className="flex flex-col">
            
            {/* 월 이름 라벨 영역 모방 */}
            <div className="h-5 flex text-[10px] text-neutral-300 dark:text-neutral-700 relative mb-1">
              <div style={{ width: `${labelSpacer}px` }} className="shrink-0" />
              <div 
                style={{ width: `${totalGridWidth}px` }} 
                className="flex gap-[2px] relative shrink-0"
              >
                {Array.from({ length: isMobile ? 6 : 12 }).map((_, i) => {
                  const step = isMobile ? 4 : 4.3;
                  const idx = Math.floor(i * step);
                  if (idx >= weeksCount) return null;
                  return (
                    <div
                      key={i}
                      className="absolute h-3 w-6 bg-neutral-200 dark:bg-neutral-800 rounded"
                      style={{ left: `${idx * weekWidth}px` }}
                    />
                  );
                })}
              </div>
            </div>

            {/* 요일명 + 잔디 그리드 모방 */}
            <div className="flex gap-2 items-start">
              {/* 요일명 라벨 */}
              <div 
                style={{ width: isMobile ? '16px' : '20px', gap: `${cellGap}px` }}
                className="flex flex-col text-[10px] text-neutral-300 dark:text-neutral-700/60 shrink-0 pt-[1px] select-none font-medium"
              >
                <span style={{ height: `${cellSize}px` }} />
                <span style={{ height: `${cellSize}px`, lineHeight: `${cellSize}px` }}>Mon</span>
                <span style={{ height: `${cellSize}px` }} />
                <span style={{ height: `${cellSize}px`, lineHeight: `${cellSize}px` }}>Wed</span>
                <span style={{ height: `${cellSize}px` }} />
                <span style={{ height: `${cellSize}px`, lineHeight: `${cellSize}px` }}>Fri</span>
                <span style={{ height: `${cellSize}px` }} />
              </div>

              {/* 잔디 메인 그리드 */}
              <div 
                style={{ width: `${totalGridWidth}px` }} 
                className="flex gap-[2px] shrink-0"
              >
                {Array.from({ length: weeksCount }).map((_, w) => (
                  <div 
                    key={w} 
                    style={{ width: `${cellSize}px` }}
                    className="flex flex-col gap-[2px] shrink-0"
                  >
                    {Array.from({ length: 7 }).map((_, d) => (
                      <div
                        key={d}
                        style={{ width: `${cellSize}px`, height: `${cellSize}px` }}
                        className="bg-neutral-200 dark:bg-neutral-800/60 rounded-[2px]"
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 justify-between items-start sm:items-center text-[11px] pt-3 border-t border-neutral-100 dark:border-neutral-800/40">
        <div className="h-4 w-48 bg-neutral-200 dark:bg-neutral-800 rounded" />
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-8 bg-neutral-200 dark:bg-neutral-800 rounded" />
          <div className="flex gap-[2px]">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div 
                key={idx} 
                style={{ width: `${cellSize}px`, height: `${cellSize}px` }}
                className="bg-neutral-200 dark:bg-neutral-800/80 rounded-[2px]" 
              />
            ))}
          </div>
          <div className="h-3 w-8 bg-neutral-200 dark:bg-neutral-800 rounded" />
        </div>
      </div>
    </div>
  );
}
