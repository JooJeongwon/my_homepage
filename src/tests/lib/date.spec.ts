import { describe, it, expect } from 'vitest';
import { formatDate, formatKoreanDate, parseDate } from '@/lib/date';

describe('Date Utility (src/lib/date.ts)', () => {
    describe('parseDate', () => {
        it('YYYY-MM-DD 형식의 문자열을 올바르게 파싱한다', () => {
            const parsed = parseDate('2026-08-22');
            expect(parsed).toEqual({ year: 2026, month: 8, day: 22 });
        });

        it('ISO 8601 문자열을 Timezone Shift 없이 날짜 기준으로 파싱한다', () => {
            const parsed = parseDate('2026-01-04T00:00:00.000Z');
            expect(parsed).toEqual({ year: 2026, month: 1, day: 4 });
        });

        it('YYYY.MM 형식의 연월 문자열을 파싱한다 (day는 undefined)', () => {
            const parsed = parseDate('2025.11');
            expect(parsed).toEqual({ year: 2025, month: 11 });
        });

        it('Date 인스턴스를 올바르게 파싱한다', () => {
            const d = new Date(2026, 6, 30); // 2026-07-30
            const parsed = parseDate(d);
            expect(parsed).toEqual({ year: 2026, month: 7, day: 30 });
        });

        it('null, undefined, 빈 문자열에 대해 null을 반환한다', () => {
            expect(parseDate(null)).toBeNull();
            expect(parseDate(undefined)).toBeNull();
            expect(parseDate('')).toBeNull();
            expect(parseDate('   ')).toBeNull();
        });
    });

    describe('formatDate', () => {
        it('기본 포맷(YYYY.MM.DD)으로 올바르게 변환한다', () => {
            expect(formatDate('2026-08-05')).toBe('2026.08.05');
            expect(formatDate('2026-12-25')).toBe('2026.12.25');
        });

        it('다양한 포맷 패턴(YYYY-MM-DD, YYYY. MM. DD 등)을 지원한다', () => {
            expect(formatDate('2026-08-22', 'YYYY-MM-DD')).toBe('2026-08-22');
            expect(formatDate('2026-08-22', 'YYYY. MM. DD')).toBe('2026. 08. 22');
            expect(formatDate('2026-08-22', 'YY.MM.DD')).toBe('26.08.22');
        });

        it('영문 월 포맷(MMM D, YYYY 및 MMMM D, YYYY)을 지원한다', () => {
            expect(formatDate('2026-01-04', 'MMM D, YYYY')).toBe('Jan 4, 2026');
            expect(formatDate('2026-06-09', 'MMM D, YYYY')).toBe('Jun 9, 2026');
            expect(formatDate('2026-08-22', 'MMMM D, YYYY')).toBe('August 22, 2026');
        });

        it('한국어 날짜 포맷(YYYY년 M월 D일)을 지원한다', () => {
            expect(formatDate('2026-08-05', 'YYYY년 M월 D일')).toBe('2026년 8월 5일');
            expect(formatDate('2026-08-05', 'YYYY년 MM월 DD일')).toBe('2026년 08월 05일');
        });

        it('연.월(YYYY.MM)만 있는 프로젝트 날짜를 안전하게 처리한다', () => {
            expect(formatDate('2026.01')).toBe('2026.01');
            expect(formatDate('2025.11')).toBe('2025.11');
            expect(formatDate('2025-11', 'YYYY-MM-DD')).toBe('2025-11');
        });

        it('falsy 및 유효하지 않은 입력값에 대해 안전하게 fallback 처리한다', () => {
            expect(formatDate(null)).toBe('');
            expect(formatDate(undefined)).toBe('');
            expect(formatDate('')).toBe('');
            expect(formatDate('invalid-date')).toBe('invalid-date');
        });
    });

    describe('formatKoreanDate', () => {
        it('YYYY년 M월 D일 형태로 포매팅한다', () => {
            expect(formatKoreanDate('2026-06-09')).toBe('2026년 6월 9일');
            expect(formatKoreanDate('2026-01-04')).toBe('2026년 1월 4일');
        });
    });
});
