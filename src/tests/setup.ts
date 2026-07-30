import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// 테스트 환경의 시스템 타임존을 UTC로 명시적 고정 (Deterministic Environment)
process.env.TZ = 'UTC';

afterEach(() => {
    cleanup();
});

