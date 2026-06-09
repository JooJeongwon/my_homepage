import { ContributionCalendar, ContributionCalendarSchema } from '@/domain/models/contribution.model';
import { ContributionRepository } from '@/domain/ports/contribution.repository';

export class ContributionApiRepository implements ContributionRepository {
    async getContributions(username: string): Promise<ContributionCalendar> {
        const response = await fetch(`/api/github/contributions?username=${encodeURIComponent(username)}`);
        
        if (!response.ok) {
            throw new Error(`GitHub 기여 정보를 가져오지 못했습니다: ${response.statusText}`);
        }

        const data = await response.json();
        
        // Zod 검증을 통한 도메인 데이터 무결성 보장
        const parsed = ContributionCalendarSchema.safeParse(data);
        if (!parsed.success) {
            console.error('Contribution API 스키마 검증 실패:', parsed.error);
            throw new Error('서버로부터 올바르지 않은 형식의 기여도 데이터를 받았습니다.');
        }

        return parsed.data;
    }
}
