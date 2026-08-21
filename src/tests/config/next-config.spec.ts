import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import nextConfig from '../../../next.config';

describe('Next.js Config', () => {
    it('output: "export"로 설정되어 있어야 한다', () => {
        expect(nextConfig.output).toBe('export');
    });

    it('images.unoptimized: true로 설정되어 있어야 한다', () => {
        expect(nextConfig.images?.unoptimized).toBe(true);
    });

    it('public/_headers 파일에 정적 자산 캐싱 헤더가 정의되어 있어야 한다', () => {
        const headersPath = path.resolve(process.cwd(), 'public/_headers');
        expect(fs.existsSync(headersPath)).toBe(true);

        const content = fs.readFileSync(headersPath, 'utf-8');
        expect(content).toContain('/_next/static/*');
        expect(content).toContain('Cache-Control: public, max-age=31536000, immutable');
        expect(content).toContain('X-Content-Type-Options: nosniff');
    });
});
