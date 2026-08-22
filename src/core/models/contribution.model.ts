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
