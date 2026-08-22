import { describe, it, expect } from 'vitest';
import robots from '@/app/robots';

describe('Robots Specification', () => {
    it('모든 크롤러를 허용하고 sitemap과 host가 명시된 robots 설정을 반환해야 한다', () => {
        const result = robots();

        expect(result).toEqual({
            rules: {
                userAgent: '*',
                allow: '/',
            },
            sitemap: 'https://jwjoo.com/sitemap.xml',
            host: 'https://jwjoo.com',
        });
    });
});
