import { ContributionCalendar, ContributionCalendarSchema, createFallbackContributionCalendar } from '@/domain/models/contribution.model';
import { ContributionRepository } from '@/domain/ports/contribution.repository';

export class ContributionApiRepository implements ContributionRepository {
    async getContributions(username: string): Promise<ContributionCalendar> {
        try {
            const response = await fetch(`/api/github/users/${encodeURIComponent(username)}/contributions`);
            
            if (!response.ok) {
                console.error(`[ContributionApiRepository] API Response Error: ${response.status} ${response.statusText}`);
                return createFallbackContributionCalendar();
            }

            const json = await response.json();
            
            // HATEOAS 레벨 3 응답 구조(data wrapper) 대응 및 하위 호환성 유지
            const payload = json && typeof json === 'object' && 'data' in json ? json.data : json;
            
            // Zod 검증을 통한 도메인 데이터 무결성 보장
            const parsed = ContributionCalendarSchema.safeParse(payload);
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

