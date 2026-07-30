import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import ContributionCalendar from '@/components/home/ContributionCalendar';
import { getGetContributionsUseCase } from '@/di/contribution.module';
import { ContributionCalendar as ContributionCalendarType } from '@/domain/models/contribution.model';

vi.mock('@/di/contribution.module', () => ({
    getGetContributionsUseCase: vi.fn(),
}));

describe('ContributionCalendar (FIRST Principle & Deterministic Timezone Test)', () => {
    const fixedSystemTime = new Date('2026-07-30T00:00:00.000Z');

    const mockCalendarData: ContributionCalendarType = {
        totalContributions: 15,
        weeks: [
            {
                contributionDays: [
                    { date: '2026-01-04', count: 1, level: 1 },
                ]
            },
            { contributionDays: [] },
            { contributionDays: [] },
            {
                contributionDays: [
                    { date: '2026-02-01', count: 2, level: 2 },
                ]
            },
            { contributionDays: [] },
            { contributionDays: [] },
            {
                contributionDays: [
                    { date: '2026-03-01', count: 3, level: 3 },
                ]
            },
            { contributionDays: [] },
            { contributionDays: [] },
            {
                contributionDays: [
                    { date: '2026-06-09', count: 5, level: 4 },
                ]
            }
        ]
    };

    beforeEach(() => {
        vi.useFakeTimers({ shouldAdvanceTime: true });
        vi.setSystemTime(fixedSystemTime);

        vi.mocked(getGetContributionsUseCase).mockReturnValue({
            execute: vi.fn().mockResolvedValue(mockCalendarData),
            executeResult: vi.fn(),
        } as unknown as ReturnType<typeof getGetContributionsUseCase>);
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.clearAllMocks();
    });

    it('UTC 타임존 및 고정 시각 환경에서 월별 라벨(Jan, Feb, Mar, Jun)이 결정론적(Deterministic)으로 렌더링되어야 한다', async () => {
        render(<ContributionCalendar />);

        // 로딩 완료 대기
        await waitFor(() => {
            expect(screen.queryByText('GitHub Contributions')).toBeInTheDocument();
        });

        // 월별 라벨 검증
        expect(screen.getByText('Jan')).toBeInTheDocument();
        expect(screen.getByText('Feb')).toBeInTheDocument();
        expect(screen.getByText('Mar')).toBeInTheDocument();
        expect(screen.getByText('Jun')).toBeInTheDocument();
    });

    it('잔디 셀에 마우스 호버 시 날짜 포맷(Jun 9, 2026)이 환경 상관없이 동일하게 표시되어야 한다', async () => {
        const { container } = render(<ContributionCalendar />);

        await waitFor(() => {
            expect(screen.queryByText('GitHub Contributions')).toBeInTheDocument();
        });

        // 2026-06-09 셀 찾기 (weeks[9] -> 4번째 셀)
        const cells = container.querySelectorAll('[data-cell="true"]');
        expect(cells.length).toBe(4);

        const targetCell = cells[3]; // 2026-06-09 셀
        fireEvent.mouseEnter(targetCell);

        // 툴팁 내 포맷된 날짜 텍스트 확인
        expect(screen.getByText('Jun 9, 2026')).toBeInTheDocument();
        expect(screen.getByText('5 contributions')).toBeInTheDocument();
    });

    it('잔디 타일마다 role="img" 및 "YYYY년 M월 D일: N개의 기여" 형태의 접근성 메타데이터(aria-label)가 제공되어야 한다', async () => {
        const { container } = render(<ContributionCalendar />);

        await waitFor(() => {
            expect(screen.queryByText('GitHub Contributions')).toBeInTheDocument();
        });

        const imgCells = container.querySelectorAll('[data-cell="true"][role="img"]');
        expect(imgCells.length).toBe(4);

        // 2026-06-09: 5개의 기여 셀 검증
        const targetCell = imgCells[3];
        expect(targetCell).toHaveAttribute('aria-label', '2026년 6월 9일: 5개의 기여');
    });

});
