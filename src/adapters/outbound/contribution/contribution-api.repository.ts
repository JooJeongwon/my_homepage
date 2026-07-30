import { ContributionCalendar, ContributionCalendarSchema, createFallbackContributionCalendar } from '@/domain/models/contribution.model';
import { ContributionRepository } from '@/domain/ports/contribution.repository';

export class ContributionApiRepository implements ContributionRepository {
    private readonly maxRetries = 3;
    private readonly timeoutMs = 5000;

    async getContributions(username: string): Promise<ContributionCalendar> {
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
                    console.error('[ContributionApiRepository] Contribution API 스키마 검증 실패:', parsed.error);
                    // 스키마 에러는 재시도해도 불변하므로 바로 fallback
                    return createFallbackContributionCalendar();
                }

                console.warn(`[ContributionApiRepository] Attempt ${attempt}/${this.maxRetries} API Error: ${response.status} ${response.statusText}`);

                // 4xx 클라이언트 에러(Origin 차단, 잘못된 요청 등)는 재시도해도 불가능하므로 즉시 중단
                if (response.status >= 400 && response.status < 500) {
                    return createFallbackContributionCalendar();
                }

            } catch (error: any) {
                clearTimeout(timer);
                const isAbort = error.name === 'AbortError';
                console.warn(`[ContributionApiRepository] Attempt ${attempt}/${this.maxRetries} ${isAbort ? 'Timeout' : 'Network Failure'}:`, error);
            }

            // 마지노선 재시도 전 지연 (Exponential Backoff: 400ms, 800ms...)
            if (attempt < this.maxRetries) {
                const backoffMs = Math.pow(2, attempt - 1) * 400;
                await new Promise((resolve) => setTimeout(resolve, backoffMs));
            }
        }

        console.error(`[ContributionApiRepository] 모든 재시도(${this.maxRetries}회) 실패. Fallback 데이터를 반환합니다.`);
        return createFallbackContributionCalendar();
    }
}

