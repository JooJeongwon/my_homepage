import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import nextConfig from '../../../next.config';

describe('Next.js Static Export Configuration (FIRST Principles)', () => {
  it('next.config.ts는 output: "export"로 설정되어 있어야 한다', () => {
    expect(nextConfig.output).toBe('export');
  });

  it('next.config.ts는 정적 익스포트를 위해 images.unoptimized: true로 설정되어 있어야 한다', () => {
    expect(nextConfig.images).toBeDefined();
    expect(nextConfig.images?.unoptimized).toBe(true);
  });

  it('public/_headers 파일이 존재하며 이미지 및 정적 자산 Caching 헤더 규칙이 올바르게 정의되어 있어야 한다', () => {
    const headersPath = path.resolve(process.cwd(), 'public/_headers');
    expect(fs.existsSync(headersPath)).toBe(true);

    const content = fs.readFileSync(headersPath, 'utf-8');

    // Next.js static asset bundle rule
    expect(content).toContain('/_next/static/*');
    // Static image extension rules
    expect(content).toContain('/*.png');
    expect(content).toContain('/*.svg');
    expect(content).toContain('/*.webp');
    expect(content).toContain('/*.avif');

    // Immutable Cache-Control rule check
    expect(content).toContain('Cache-Control: public, max-age=31536000, immutable');
    expect(content).toContain('X-Content-Type-Options: nosniff');
  });
});
