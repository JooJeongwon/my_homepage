import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import ContributionCalendar from '@/components/home/ContributionCalendar';
import { clientContributionService } from '@/infrastructure/github/contribution.client';
import { ContributionCalendar as ContributionCalendarType } from '@/core/models/contribution.model';

vi.mock('@/infrastructure/github/contribution.client', () => ({
    clientContributionService: {
        getContributions: vi.fn(),
    },
}));

describe('ContributionCalendar', () => {
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
        vi.mocked(clientContributionService.getContributions).mockResolvedValue(mockCalendarData);
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.clearAllMocks();
    });

    it('월별 라벨(Jan, Feb, Mar, Jun)이 렌더링된다', async () => {
        render(<ContributionCalendar />);

        await waitFor(() => {
            expect(screen.queryByText('GitHub Contributions')).toBeInTheDocument();
        });

        expect(screen.getByText('Jan')).toBeInTheDocument();
        expect(screen.getByText('Feb')).toBeInTheDocument();
        expect(screen.getByText('Mar')).toBeInTheDocument();
        expect(screen.getByText('Jun')).toBeInTheDocument();
    });

    it('잔디 셀에 마우스 호버 시 툴팁 날짜와 기여 수가 표시된다', async () => {
        const { container } = render(<ContributionCalendar />);

        await waitFor(() => {
            expect(screen.queryByText('GitHub Contributions')).toBeInTheDocument();
        });

        const cells = container.querySelectorAll('[data-cell="true"]');
        expect(cells.length).toBe(4);

        fireEvent.mouseEnter(cells[3]);

        expect(screen.getByText('Jun 9, 2026')).toBeInTheDocument();
        expect(screen.getByText('5 contributions')).toBeInTheDocument();
    });

    it('잔디 셀마다 접근성 레이블(aria-label)이 제공된다', async () => {
        const { container } = render(<ContributionCalendar />);

        await waitFor(() => {
            expect(screen.queryByText('GitHub Contributions')).toBeInTheDocument();
        });

        const imgCells = container.querySelectorAll('[data-cell="true"][role="img"]');
        expect(imgCells[3]).toHaveAttribute('aria-label', '2026년 6월 9일: 5개의 기여');
    });
});
