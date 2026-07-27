import { ContributionCalendar, ContributionCalendarSchema, createFallbackContributionCalendar } from '@/domain/models/contribution.model';
import { ContributionRepository } from '@/domain/ports/contribution.repository';

export class ContributionApiRepository implements ContributionRepository {
    async getContributions(username: string): Promise<ContributionCalendar> {
        try {
            const response = await fetch(`/api/github/contributions?username=${encodeURIComponent(username)}`);
            
            if (!response.ok) {
                console.error(`[ContributionApiRepository] API Response Error: ${response.status} ${response.statusText}`);
                return createFallbackContributionCalendar();
            }

            const data = await response.json();
            
            // Zod 검증을 통한 도메인 데이터 무결성 보장
            const parsed = ContributionCalendarSchema.safeParse(data);
            if (!parsed.success) {
                console.error('[ContributionApiRepository] Contribution API 스키마 검증 실패:', parsed.error);
                return createFallbackContributionCalendar();
            }

            return parsed.data;
        } catch (error) {
            console.error('[ContributionApiRepository] 네트워크 또는 API 조회 실패:', error);
            return createFallbackContributionCalendar();
        }
    }
}

