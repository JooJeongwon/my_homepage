import { z } from 'zod';

// 1. 단일 기여 일자 (Day) 스키마
export const ContributionDaySchema = z.object({
    date: z.string(),                // YYYY-MM-DD 포맷
    count: z.number(),               // 기여 횟수 (예: 3 commit)
    level: z.number().min(0).max(4)  // 기여도 레벨 (0 ~ 4)
});

// 2. 주간 (Week) 스키마
export const ContributionWeekSchema = z.object({
    contributionDays: z.array(ContributionDaySchema)
});

// 3. 기여도 캘린더 전체 스키마
export const ContributionCalendarSchema = z.object({
    totalContributions: z.number(),   // 지난 1년간 총 기여 횟수
    weeks: z.array(ContributionWeekSchema) // 53주간의 주간 정보 배열
});

export type ContributionDay = z.infer<typeof ContributionDaySchema>;
export type ContributionWeek = z.infer<typeof ContributionWeekSchema>;
export type ContributionCalendar = z.infer<typeof ContributionCalendarSchema>;

/**
 * 외부 API 실패 시 SSG 빌드 중단 없이 안정적으로 기본 UI를 렌더링하기 위한 Fallback Calendar 생성기
 */
export function createFallbackContributionCalendar(): ContributionCalendar {
    const weeks: ContributionWeek[] = [];
    const today = new Date();

    // 53주 전 일요일부터 시작
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - (52 * 7 + today.getDay()));

    const currentDate = new Date(startDate);

    for (let w = 0; w < 53; w++) {
        const contributionDays: ContributionDay[] = [];
        for (let d = 0; d < 7; d++) {
            const dateStr = currentDate.toISOString().split('T')[0];
            contributionDays.push({
                date: dateStr,
                count: 0,
                level: 0
            });
            currentDate.setDate(currentDate.getDate() + 1);
        }
        weeks.push({ contributionDays });
    }

    return {
        totalContributions: 0,
        weeks
    };
}

