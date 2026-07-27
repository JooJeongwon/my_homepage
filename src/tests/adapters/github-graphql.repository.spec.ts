import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { GithubGraphqlRepository } from '@/adapters/outbound/contribution/github-graphql.repository';

describe('GithubGraphqlRepository Graceful Fallback', () => {
    const originalFetch = global.fetch;

    afterEach(() => {
        global.fetch = originalFetch;
        vi.restoreAllMocks();
    });

    it('토큰이 비어있는 경우 예외를 발생시켜야 한다.', async () => {
        const repo = new GithubGraphqlRepository('');
        await expect(repo.getContributions('testuser')).rejects.toThrow('GitHub Token이 설정되지 않았습니다.');
    });

    it('GraphQL API HTTP 500 에러 시 예외를 발생시켜야 한다.', async () => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: false,
            status: 500,
            text: async () => 'Internal Server Error'
        } as Response);

        const repo = new GithubGraphqlRepository('fake-token');
        await expect(repo.getContributions('testuser')).rejects.toThrow('GitHub GraphQL API 호출 실패');
    });

    it('네트워크 fetch 실패 시 예외를 발생시켜야 한다.', async () => {
        global.fetch = vi.fn().mockRejectedValue(new Error('Network Connection Refused'));

        const repo = new GithubGraphqlRepository('fake-token');
        await expect(repo.getContributions('testuser')).rejects.toThrow('Network Connection Refused');
    });

});
