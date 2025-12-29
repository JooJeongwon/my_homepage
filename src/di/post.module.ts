import { PostRepository } from '../domain/ports/post.repository';
import { MdxPostRepository } from '../adapters/outbound/mdx/mdx.repository';
// import { NotionPostRepository } from '../adapters/outbound/notion/notion.repository'; // 나중에 주석 해제

// 싱글톤 인스턴스 저장
let postRepositoryInstance: PostRepository | null = null;

export function getPostRepository(): PostRepository {
    if (postRepositoryInstance) {
        return postRepositoryInstance;
    }

    // ★ 환경변수나 설정에 따라 구현체 교체 (Switching Logic)
    // 지금은 무조건 MDX를 쓰지만, 나중엔 process.env.DATA_SOURCE로 분기 처리
    postRepositoryInstance = new MdxPostRepository();

    return postRepositoryInstance;
}