/**
 * 날짜 포매팅 유틸리티 (Pure Domain & Cross-Cutting Utility)
 * 
 * 서버(SSR/SSG)와 클라이언트(브라우저) 간의 Timezone/Locale 불일치로 인한
 * Hydration Mismatch를 원천 방지하기 위해 정규식 기반의 결정론적(Deterministic)
 * 순수 함수로 날짜를 파싱하고 포매팅합니다.
 */

export type DateFormatPattern =
    | 'YYYY.MM.DD'
    | 'YYYY. MM. DD'
    | 'YYYY-MM-DD'
    | 'YYYY년 M월 D일'
    | 'YYYY년 MM월 DD일'
    | 'MMM D, YYYY'
    | 'MMMM D, YYYY'
    | 'YYYY.MM'
    | string;

export interface ParsedDateInfo {
    year: number;
    month: number; // 1-12
    day?: number;  // 1-31
}

const MONTH_NAMES_SHORT = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
] as const;

const MONTH_NAMES_LONG = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
] as const;

/**
 * Timezone 차이로 인한 날짜 왜곡을 방지하기 위해 
 * 입력된 날짜를 안전하게 파싱합니다.
 */
export function parseDate(dateInput: string | Date | number | null | undefined): ParsedDateInfo | null {
    if (dateInput === null || dateInput === undefined) return null;

    if (typeof dateInput === 'number') {
        const d = new Date(dateInput);
        if (isNaN(d.getTime())) return null;
        return {
            year: d.getFullYear(),
            month: d.getMonth() + 1,
            day: d.getDate(),
        };
    }

    if (dateInput instanceof Date) {
        if (isNaN(dateInput.getTime())) return null;
        return {
            year: dateInput.getFullYear(),
            month: dateInput.getMonth() + 1,
            day: dateInput.getDate(),
        };
    }

    const trimmed = String(dateInput).trim();
    if (!trimmed) return null;

    // 1. ISO 8601 문자열 (예: 2026-08-22T04:40:00.000Z)
    // 앞부분의 YYYY-MM-DD를 직접 추출하여 서버/클라이언트 타임존 차이로 인한 날짜 1일 밀림 방지
    const isoMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})(?:T|\s|$)/);
    if (isoMatch) {
        return {
            year: parseInt(isoMatch[1], 10),
            month: parseInt(isoMatch[2], 10),
            day: parseInt(isoMatch[3], 10),
        };
    }

    // 2. YYYY-MM-DD or YYYY.MM.DD or YYYY/MM/DD
    const dateMatch = trimmed.match(/^(\d{4})[-./](\d{1,2})[-./](\d{1,2})$/);
    if (dateMatch) {
        return {
            year: parseInt(dateMatch[1], 10),
            month: parseInt(dateMatch[2], 10),
            day: parseInt(dateMatch[3], 10),
        };
    }

    // 3. YYYY.MM or YYYY-MM
    const yearMonthMatch = trimmed.match(/^(\d{4})[-./](\d{1,2})$/);
    if (yearMonthMatch) {
        return {
            year: parseInt(yearMonthMatch[1], 10),
            month: parseInt(yearMonthMatch[2], 10),
        };
    }

    // Fallback: Date 생성자 파싱 시도
    const fallbackDate = new Date(trimmed);
    if (!isNaN(fallbackDate.getTime())) {
        return {
            year: fallbackDate.getFullYear(),
            month: fallbackDate.getMonth() + 1,
            day: fallbackDate.getDate(),
        };
    }

    return null;
}

/**
 * 날짜 문자열, Date 객체, 타임스탬프를 지정된 포맷으로 변환합니다.
 *
 * @param dateInput - 포매팅할 날짜
 * @param pattern - 출력 포맷 패턴 (기본값: 'YYYY.MM.DD')
 * @returns 포매팅된 날짜 문자열 (유효하지 않은 경우 빈 문자열 또는 원본 문자열 반환)
 */
export function formatDate(
    dateInput: string | Date | number | null | undefined,
    pattern: DateFormatPattern = 'YYYY.MM.DD'
): string {
    const parsed = parseDate(dateInput);
    if (!parsed) {
        return typeof dateInput === 'string' ? dateInput : '';
    }

    const { year, month, day } = parsed;

    // 만약 day 정보가 없고(YYYY.MM), 기본 패턴이 요청된 경우 YYYY.MM으로 안전 처리
    if (day === undefined) {
        if (pattern === 'YYYY.MM.DD' || pattern === 'YYYY. MM. DD') {
            return `${year}.${String(month).padStart(2, '0')}`;
        }
        if (pattern === 'YYYY-MM-DD') {
            return `${year}-${String(month).padStart(2, '0')}`;
        }
    }

    const yyyy = String(year);
    const yy = String(year).slice(-2);
    const mm = String(month).padStart(2, '0');
    const m = String(month);
    const dd = day !== undefined ? String(day).padStart(2, '0') : '';
    const d = day !== undefined ? String(day) : '';
    const mmm = MONTH_NAMES_SHORT[month - 1] ?? '';
    const mmmm = MONTH_NAMES_LONG[month - 1] ?? '';

    let result = pattern;

    // 치환 순서: 긴 토큰부터 우선 치환
    result = result.replace(/YYYY/g, yyyy);
    result = result.replace(/YY/g, yy);
    result = result.replace(/MMMM/g, mmmm);
    result = result.replace(/MMM/g, mmm);
    result = result.replace(/MM/g, mm);
    result = result.replace(/M/g, m);
    result = result.replace(/DD/g, dd);
    result = result.replace(/D/g, d);

    return result;
}

/**
 * 한국어 표준 날짜 표기 ('YYYY년 M월 D일') 포맷 헬퍼
 */
export function formatKoreanDate(dateInput: string | Date | number | null | undefined): string {
    return formatDate(dateInput, 'YYYY년 M월 D일');
}
