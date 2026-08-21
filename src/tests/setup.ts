import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// 테스트 환경 시스템 타임존 UTC 명시적 고정
process.env.TZ = 'UTC';

// jsdom 미구현 메서드 기본 모킹
if (typeof window !== 'undefined') {
    window.scrollTo = vi.fn();
}

afterEach(() => {
    cleanup();
});
