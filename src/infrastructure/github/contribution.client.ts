import {
    ContributionCalendar,
    ContributionCalendarSchema,
    ContributionDay,
    ContributionWeek,
    createFallbackContributionCalendar
} from '@/core/models/contribution.model';
import { IContributionRepository, ContributionService } from '@/core/services/contribution.service';

/**
 * 로컬 개발 환경용 Mock Contribution Calendar 생성 함수
 */
function generateMockContributions(): ContributionCalendar {
    const weeks: ContributionWeek[] = [];
    const today = new Date();

    // 52주 전 일요일부터 시작하도록 계산 (총 53주)
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 52 * 7);
    const dayOfWeek = startDate.getDay();
    startDate.setDate(startDate.getDate() - dayOfWeek);

    let totalContributions = 0;
    const currentDate = new Date(startDate);

    for (let w = 0; w < 53; w++) {
        const contributionDays: ContributionDay[] = [];
        for (let d = 0; d < 7; d++) {
            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, '0');
            const date = String(currentDate.getDate()).padStart(2, '0');
            const dateStr = `${year}-${month}-${date}`;

            const isWeekend = d === 0 || d === 6;
            const random = Math.random();

            let level = 0;
            let count = 0;

            const hasContribution = isWeekend ? random > 0.6 : random > 0.25;

            if (hasContribution) {
                const factor = Math.random();
                if (factor < 0.4) {
                    level = 1;
                    count = Math.floor(Math.random() * 2) + 1;
                } else if (factor < 0.7) {
                    level = 2;
                    count = Math.floor(Math.random() * 3) + 3;
                } else if (factor < 0.9) {
                    level = 3;
                    count = Math.floor(Math.random() * 4) + 6;
                } else {
                    level = 4;
                    count = Math.floor(Math.random() * 8) + 10;
                }
            }

            totalContributions += count;
            contributionDays.push({
                date: dateStr,
                count,
                level
            });

            currentDate.setDate(currentDate.getDate() + 1);
        }
        weeks.push({ contributionDays });
    }

    return {
        totalContributions,
        weeks
    };
}

/**
 * 클라이언트 브라우저에서 서버리스 API 라우트를 호출하는 리포지토리 클라이언트
 */
export class ContributionApiClient implements IContributionRepository {
    private readonly maxRetries = 3;
    private readonly timeoutMs = 5000;

    async getContributions(username: string): Promise<ContributionCalendar> {
        // Mock 환경 변수가 활성화된 경우 인위적인 딜레이 후 모의 데이터 반환
        if (process.env.NEXT_PUBLIC_MOCK_CONTRIBUTIONS === 'true') {
            await new Promise((resolve) => setTimeout(resolve, 800));
            return generateMockContributions();
        }

        const url = `/api/github/users/${encodeURIComponent(username)}/contributions`;

        for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), this.timeoutMs);

            try {
                const response = await fetch(url, { signal: controller.signal });
                clearTimeout(timer);

                if (response.ok) {
                    const data = await response.json();
                    const parsed = ContributionCalendarSchema.safeParse(data);

                    if (parsed.success) {
                        return parsed.data;
                    }
                    console.error('[ContributionApiClient] 스키마 검증 실패:', parsed.error);
                    return createFallbackContributionCalendar();
                }

                console.warn(`[ContributionApiClient] 시도 ${attempt}/${this.maxRetries} API 에러: ${response.status}`);

                if (response.status >= 400 && response.status < 500) {
                    return createFallbackContributionCalendar();
                }
            } catch (error: unknown) {
                clearTimeout(timer);
                const isAbort = error instanceof Error && error.name === 'AbortError';
                console.warn(`[ContributionApiClient] 시도 ${attempt}/${this.maxRetries} ${isAbort ? 'Timeout' : 'Network Failure'}:`, error);
            }

            if (attempt < this.maxRetries) {
                const backoffMs = Math.pow(2, attempt - 1) * 400;
                await new Promise((resolve) => setTimeout(resolve, backoffMs));
            }
        }

        console.error(`[ContributionApiClient] 모든 재시도(${this.maxRetries}회) 실패. Fallback 데이터를 반환합니다.`);
        return createFallbackContributionCalendar();
    }
}

/**
 * 클라이언트 컴포넌트용 ContributionService 싱글톤 인스턴스
 */
export const clientContributionService = new ContributionService(new ContributionApiClient());
