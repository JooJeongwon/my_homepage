"use client";

import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { getGetContributionsUseCase } from '@/di/contribution.module';
import { ContributionCalendar as ContributionCalendarType } from '@/domain/models/contribution.model';
import { ContributionCalendarSkeleton } from './Skeletons';
import { Github, RefreshCw } from 'lucide-react';

const formatDate = (dateStr: string) => {
    try {
        const [year, month, day] = dateStr.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    } catch {
        return dateStr;
    }
};

const getMonthLabels = (weeks: ContributionCalendarType['weeks']) => {
    const labels: { index: number; label: string }[] = [];
    let prevMonth = -1;

    weeks.forEach((week, i) => {
        if (week.contributionDays.length > 0) {
            const [year, month, day] = week.contributionDays[0].date.split('-').map(Number);
            const firstDay = new Date(year, month - 1, day);
            const currentMonth = firstDay.getMonth();
            if (currentMonth !== prevMonth) {
                const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                labels.push({ index: i, label: monthNames[currentMonth] });
                prevMonth = currentMonth;
            }
        }
    });

    // 라벨 간격이 너무 촘촘하게 겹치는 것을 막기 위해 최소 3주 이상의 간격이 유지되도록 정제
    const filteredLabels: { index: number; label: string }[] = [];
    let lastIndex = -99;
    labels.forEach((item) => {
        if (item.index - lastIndex >= 3) {
            filteredLabels.push(item);
            lastIndex = item.index;
        }
    });

    return filteredLabels;
};

export default function ContributionCalendar() {
    const [data, setData] = useState<ContributionCalendarType | null>(null);
    const [hoveredCell, setHoveredCell] = useState<{
        date: string;
        count: number;
        x: number;
        y: number;
        arrowOffset: number;
    } | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleCellMouseEnter = useCallback((
        e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>, 
        date: string, 
        count: number
    ) => {
        const cellEl = e.currentTarget;
        const cellRect = cellEl.getBoundingClientRect();
        const containerEl = containerRef.current;
        if (!containerEl) return;
        const containerRect = containerEl.getBoundingClientRect();

        // 컨테이너 대비 셀 중심 x 좌표
        let x = cellRect.left - containerRect.left + cellRect.width / 2;
        // 컨테이너 대비 셀 상단 y 좌표
        const y = cellRect.top - containerRect.top;

        // 툴팁 너비의 절반인 65px 정도의 안전 여백을 둡니다. (컨테이너 패딩 p-6 = 24px 고려)
        const tooltipHalfWidth = 65; 
        const minX = tooltipHalfWidth;
        const maxX = containerRect.width - tooltipHalfWidth;

        let arrowOffset = 0;
        if (x < minX) {
            arrowOffset = x - minX; // 왼쪽으로 쏠린 만큼 화살표를 왼쪽(음수)으로 이동
            x = minX;
        } else if (x > maxX) {
            arrowOffset = x - maxX; // 오른쪽으로 쏠린 만큼 화살표를 오른쪽(양수)으로 이동
            x = maxX;
        }

        setHoveredCell({
            date,
            count,
            x,
            y,
            arrowOffset
        });
    }, []);

    const handleCellMouseLeave = useCallback(() => {
        setHoveredCell(null);
    }, []);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 640);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // 모바일 터치 디바이스를 위한 글로벌 터치 리스너
    useEffect(() => {
        const handleGlobalTouch = (e: TouchEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest('[data-cell="true"]')) {
                setHoveredCell(null);
            }
        };
        document.addEventListener('touchstart', handleGlobalTouch, { passive: true });
        return () => {
            document.removeEventListener('touchstart', handleGlobalTouch);
        };
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const useCase = getGetContributionsUseCase();
            // 기본 사용자: JooJeongwon
            const res = await useCase.execute('JooJeongwon');
            setData(res);
        } catch (err: any) {
            console.error('기여도 데이터 로딩 에러:', err);
            setError(err.message || '데이터를 불러오는 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // 기여 수준(level 0~4)에 맞춘 스타일 및 클래스 반환
    const getCellProps = useCallback((level: number) => {
        switch (level) {
            case 1:
                return { className: 'cell-pokeball bg-cover bg-no-repeat bg-center' };
            case 2:
                return { className: 'cell-greatball bg-cover bg-no-repeat bg-center' };
            case 3:
                return { className: 'cell-ultraball bg-cover bg-no-repeat bg-center' };
            case 4:
                return { className: 'cell-masterball bg-cover bg-no-repeat bg-center' };
            default:
                return { className: 'bg-transparent' };
        }
    }, []);

    // 모바일 뷰에 맞춰 슬라이싱 및 셀 크기 변수 정의
    const cellWidth = isMobile ? 10 : 12;
    const cellGap = 2;
    const weekWidth = cellWidth + cellGap; // 모바일: 12px, 데스크톱: 14px
    const labelSpacer = isMobile ? 24 : 28; // 모바일: 요일 라벨 16px + gap 8px

    // data가 있을 때만 계산되는 변수들 처리
    const displayWeeks = useMemo(() => {
        if (!data) return [];
        return isMobile ? data.weeks.slice(-26) : data.weeks;
    }, [data, isMobile]);

    const totalGridWidth = useMemo(() => {
        if (displayWeeks.length === 0) return 0;
        return displayWeeks.length * weekWidth - cellGap;
    }, [displayWeeks, weekWidth, cellGap]);

    const monthLabels = useMemo(() => {
        if (displayWeeks.length === 0) return [];
        return getMonthLabels(displayWeeks);
    }, [displayWeeks]);

    const durationText = isMobile ? '지난 6개월' : '지난 1년';
    
    const displayContributions = useMemo(() => {
        if (!data) return 0;
        return isMobile 
            ? displayWeeks.reduce((acc, week) => 
                acc + week.contributionDays.reduce((wAcc, day) => wAcc + day.count, 0)
              , 0)
            : data.totalContributions;
    }, [data, isMobile, displayWeeks]);

    // 캘린더 그리드 렌더링 메모이제이션 (hoveredCell 상태 변경에 의한 리렌더링 방지)
    const calendarGrid = useMemo(() => {
        if (!data || displayWeeks.length === 0) return null;

        return (
            <div className="relative">
                {/* 모바일 뷰포트에서 기여도 달력이 찌그러지지 않고 가로 스크롤 가능하게 scroll containment 설정 */}
                <div className="w-full overflow-x-auto pb-2 scrollbar-none" onScroll={handleCellMouseLeave}>
                    <div 
                        style={{ minWidth: isMobile ? '334px' : '768px' }}
                        className="flex flex-col"
                    >
                        {/* 월 이름 라벨 영역 */}
                        <div className="h-5 flex text-[10px] text-neutral-500 dark:text-neutral-400 relative mb-1">
                            {/* 왼쪽 요일 텍스트 영역을 비워두기 위한 spacer */}
                            <div style={{ width: `${labelSpacer}px` }} className="shrink-0" />
                            <div 
                                style={{ width: `${totalGridWidth}px` }} 
                                className="flex gap-[2px] relative shrink-0"
                            >
                                {monthLabels.map((item) => (
                                    <div
                                        key={`${item.label}-${item.index}`}
                                        className="absolute text-[10px] select-none"
                                        style={{ left: `${item.index * weekWidth}px` }}
                                    >
                                        {item.label}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 요일명 + 잔디 그리드 */}
                        <div className="flex gap-2 items-start">
                            {/* 요일명 라벨 */}
                            <div 
                                style={{ width: isMobile ? '16px' : '20px', gap: `${cellGap}px` }}
                                className="flex flex-col text-[10px] text-neutral-500 dark:text-neutral-400 shrink-0 pt-[1px] select-none"
                            >
                                <span style={{ height: `${cellWidth}px` }} /> {/* 일요일 (보통 비워둠) */}
                                <span style={{ height: `${cellWidth}px`, lineHeight: `${cellWidth}px` }}>Mon</span>
                                <span style={{ height: `${cellWidth}px` }} /> {/* 화요일 (비워둠) */}
                                <span style={{ height: `${cellWidth}px`, lineHeight: `${cellWidth}px` }}>Wed</span>
                                <span style={{ height: `${cellWidth}px` }} /> {/* 목요일 (비워둠) */}
                                <span style={{ height: `${cellWidth}px`, lineHeight: `${cellWidth}px` }}>Fri</span>
                                <span style={{ height: `${cellWidth}px` }} /> {/* 토요일 (비워둠) */}
                            </div>

                            {/* 잔디 메인 그리드 */}
                            <div 
                                style={{ width: `${totalGridWidth}px` }} 
                                className="flex gap-[2px] shrink-0"
                            >
                                {displayWeeks.map((week, wIdx) => (
                                    <div 
                                        key={wIdx} 
                                        style={{ width: `${cellWidth}px` }}
                                        className="flex flex-col gap-[2px] shrink-0"
                                    >
                                        {week.contributionDays.map((day, dIdx) => {
                                            const cellProps = getCellProps(day.level);
                                            return (
                                                <div
                                                    key={dIdx}
                                                    style={{
                                                        width: `${cellWidth}px`,
                                                        height: `${cellWidth}px`,
                                                    }}
                                                    data-cell="true"
                                                    className="relative group calendar-cell-group select-none"
                                                    onMouseEnter={(e) => handleCellMouseEnter(e, day.date, day.count)}
                                                    onMouseLeave={handleCellMouseLeave}
                                                    onTouchStart={(e) => handleCellMouseEnter(e, day.date, day.count)}
                                                >
                                                    {/* 개별 잔디 셀 - hover 시 매끄러운 줌 및 바람에 흔들리는 효과 지원 */}
                                                    <div
                                                        className={`w-full h-full rounded-[2px] transition-all duration-150 group-hover:scale-130 group-hover:z-20 origin-bottom cursor-default ${cellProps.className}`}
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }, [
        data,
        displayWeeks, 
        isMobile, 
        cellWidth, 
        cellGap, 
        weekWidth, 
        labelSpacer, 
        totalGridWidth, 
        monthLabels, 
        getCellProps,
        handleCellMouseEnter, 
        handleCellMouseLeave
    ]);

    if (isLoading) {
        return <ContributionCalendarSkeleton isMobile={isMobile} />;
    }

    if (error || !data) {
        return (
            <div className="border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 bg-white dark:bg-neutral-900/50 mb-12 flex flex-col items-center justify-center py-10 text-center">
                <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-4">
                    {error || '기여도 데이터를 불러오지 못했습니다.'}
                </p>
                <button
                    onClick={fetchData}
                    className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer"
                >
                    <RefreshCw className="w-3.5 h-3.5" />
                    다시 시도
                </button>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="relative mb-12">
            <div className="border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 bg-white dark:bg-neutral-900/50 space-y-4 w-full max-w-full overflow-hidden">
            <div className="flex justify-between items-center">
                <h3 className="text-md font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                    <Github className="w-5 h-5 text-neutral-800 dark:text-neutral-200" />
                    GitHub Contributions
                </h3>
                <a
                    href="https://github.com/JooJeongwon"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                >
                    @JooJeongwon
                </a>
            </div>

            {calendarGrid}

            {/* 통계 및 컬러 범례 */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 justify-between items-start sm:items-center text-[11px] pt-3 border-t border-neutral-100 dark:border-neutral-800/40 text-neutral-500 dark:text-neutral-400">
                <div>
                    {durationText} 동안 <span className="font-semibold text-neutral-900 dark:text-neutral-200">{displayContributions}회</span>의 기여를 남겼습니다.
                </div>
                <div className="text-[9px] text-neutral-500 dark:text-neutral-500 select-none sm:mx-auto py-1 sm:py-0">
                    © Pokémon. © Nintendo/Creatures/GAME FREAK.
                </div>
                <div className="flex items-center gap-1.5 select-none">
                    <span>Less</span>
                    <div className="flex gap-[2px]">
                        <div 
                            style={{ width: `${cellWidth}px`, height: `${cellWidth}px` }}
                            className="rounded-[2px] bg-transparent border border-neutral-200 dark:border-neutral-800" 
                        />
                        <div 
                            style={{ width: `${cellWidth}px`, height: `${cellWidth}px` }}
                            className="relative group calendar-cell-group"
                        >
                            <div 
                                className="w-full h-full rounded-[2px] transition-all duration-150 group-hover:scale-130 group-hover:z-20 origin-bottom bg-cover bg-no-repeat bg-center cell-pokeball cursor-default" 
                            />
                        </div>
                        <div 
                            style={{ width: `${cellWidth}px`, height: `${cellWidth}px` }}
                            className="relative group calendar-cell-group"
                        >
                            <div 
                                className="w-full h-full rounded-[2px] transition-all duration-150 group-hover:scale-130 group-hover:z-20 origin-bottom bg-cover bg-no-repeat bg-center cell-greatball cursor-default" 
                            />
                        </div>
                        <div 
                            style={{ width: `${cellWidth}px`, height: `${cellWidth}px` }}
                            className="relative group calendar-cell-group"
                        >
                            <div 
                                className="w-full h-full rounded-[2px] transition-all duration-150 group-hover:scale-130 group-hover:z-20 origin-bottom bg-cover bg-no-repeat bg-center cell-ultraball cursor-default" 
                            />
                        </div>
                        <div 
                            style={{ width: `${cellWidth}px`, height: `${cellWidth}px` }}
                            className="relative group calendar-cell-group"
                        >
                            <div 
                                className="w-full h-full rounded-[2px] transition-all duration-150 group-hover:scale-130 group-hover:z-20 origin-bottom bg-cover bg-no-repeat bg-center cell-masterball cursor-default" 
                            />
                        </div>
                    </div>
                    <span>More</span>
                </div>
            </div>
            </div>

            {/* 공통 플로팅 호버 툴팁 - space-y 레이아웃 바깥에 위치 */}
            {hoveredCell && (
                <div
                    className="absolute z-50 pointer-events-none select-none transition-all duration-100 flex flex-col items-center w-max flex-shrink-0"
                    style={{
                        left: `${hoveredCell.x}px`,
                        top: `${hoveredCell.y - 6}px`,
                        transform: 'translate(-50%, -100%)',
                    }}
                >
                    <div className="bg-neutral-900 dark:bg-neutral-800 text-neutral-50 dark:text-neutral-100 text-[10px] px-2.5 py-1.5 rounded-lg whitespace-nowrap shadow-lg border border-neutral-800 dark:border-neutral-700/80 flex flex-col items-center">
                        <span className="font-semibold">{hoveredCell.count === 0 ? 'No' : hoveredCell.count} contributions</span>
                        <span className="text-[9px] text-neutral-400 dark:text-neutral-400">{formatDate(hoveredCell.date)}</span>
                    </div>
                    {/* 화살표 */}
                    <div 
                        className="w-1.5 h-1.5 bg-neutral-900 dark:bg-neutral-800 border-r border-b border-neutral-800 dark:border-neutral-700/80 -mt-[4px]" 
                        style={{
                            transform: `translateX(${hoveredCell.arrowOffset}px) rotate(45deg)`
                        }}
                    />
                </div>
            )}

            {/* 이미지 프리로드 컨테이너 (첫 호버 시 끊김 방지) */}
            <div className="sr-only" aria-hidden="true" style={{ width: 0, height: 0, overflow: 'hidden', position: 'absolute' }}>
                <img src="/pokeball2.png" alt="" />
                <img src="/pokeball3.png" alt="" />
                <img src="/greatball2.png" alt="" />
                <img src="/greatball3.png" alt="" />
                <img src="/ultraball2.png" alt="" />
                <img src="/ultraball3.png" alt="" />
                <img src="/masterball2.png" alt="" />
                <img src="/masterball3.png" alt="" />
            </div>
        </div>
    );
}
