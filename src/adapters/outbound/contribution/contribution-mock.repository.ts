import { ContributionCalendar, ContributionDay, ContributionWeek } from '@/domain/models/contribution.model';
import { ContributionRepository } from '@/domain/ports/contribution.repository';

export class ContributionMockRepository implements ContributionRepository {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async getContributions(username: string): Promise<ContributionCalendar> {
        // 로컬 개발 환경에서 Skeleton UI 테스트를 위해 800ms의 인위적인 딜레이를 부여합니다.
        await new Promise((resolve) => setTimeout(resolve, 800));

        const weeks: ContributionWeek[] = [];
        const today = new Date();
        
        // 52주 전 일요일부터 시작하도록 시작 날짜 계산 (총 53주를 생성하기 위함)
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - 52 * 7);
        const dayOfWeek = startDate.getDay(); // 0 (일요일) ~ 6 (토요일)
        // 시작일을 직전 일요일로 보정
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
                
                // 자연스러운 커밋 그래프 형태를 만들기 위해 요일별/주차별 노이즈 패턴 생성
                const isWeekend = d === 0 || d === 6;
                const random = Math.random();
                
                let level = 0;
                let count = 0;
                
                // 주말에는 쉬는 확률이 높고, 평일에는 잔디가 촘촘히 심어지게 확률 보정
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
                
                // 하루 증가
                currentDate.setDate(currentDate.getDate() + 1);
            }
            weeks.push({ contributionDays });
        }

        return {
            totalContributions,
            weeks
        };
    }
}
