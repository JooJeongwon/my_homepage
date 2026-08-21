import { describe, it, expect } from 'vitest';
import { filterPosts, filterProjects } from '@/lib/search';
import { Post } from '@/core/models/post.model';
import { Project } from '@/core/models/project.model';

describe('Search Utility', () => {
    const mockPosts: Post[] = [
        {
            id: 'post-1',
            slug: 'first-post',
            title: 'TypeScript 조건부 타입과 고급 제네릭',
            description: 'TypeScript의 강력한 타입 시스템 설명글입니다.',
            date: '2026-08-01',
            tags: ['TypeScript', 'Frontend'],
            content: '조건부 타입을 활용하여 복잡한 API 응답을 타입 안전하게 모델링하는 방법을 알아봅니다.',
        },
        {
            id: 'post-2',
            slug: 'second-post',
            title: '리액트 19 클린 아키텍처 가이드',
            description: 'Next.js와 React 19에서의 Layered Clean Architecture 설계',
            date: '2026-08-15',
            tags: ['React', 'Architecture'],
            content: '의존성 역전 원칙과 도메인 레이어 격리를 실천합니다.',
        },
    ];

    const mockProjects: Project[] = [
        {
            id: 'proj-1',
            slug: 'jwjoo-platform',
            title: 'JW Platform 포트폴리오',
            description: 'Next.js 16과 Tailwind CSS v4 기반의 초고속 개발자 플랫폼',
            date: '2026-08-10',
            tags: ['Next.js', 'TailwindCSS'],
            content: '완벽한 반응형 UI와 GitHub 연동 기여도 캘린더를 제공합니다.',
        },
        {
            id: 'proj-2',
            slug: 'clean-arch-starter',
            title: '클린 아키텍처 스타터 킷',
            description: '도메인 주도 설계 및 레이어드 아키텍처 템플릿',
            date: '2026-08-12',
            tags: ['TypeScript', 'CleanArchitecture'],
            content: '복잡한 프론트엔드 비즈니스 로직을 순수 함수와 서비스로 격리합니다.',
        },
    ];

    describe('filterPosts', () => {
        it('빈 검색어 또는 공백 검색어인 경우 원본 목록을 그대로 반환한다', () => {
            expect(filterPosts(mockPosts, '')).toEqual(mockPosts);
            expect(filterPosts(mockPosts, '   ')).toEqual(mockPosts);
        });

        it('대소문자 구분 없이 제목, 설명, 태그, 본문에서 검색된다', () => {
            const byTag = filterPosts(mockPosts, 'typescript');
            expect(byTag).toHaveLength(1);
            expect(byTag[0].slug).toBe('first-post');

            const byDesc = filterPosts(mockPosts, '설명글');
            expect(byDesc).toHaveLength(1);
            expect(byDesc[0].slug).toBe('first-post');

            const byTagCase = filterPosts(mockPosts, 'Architecture');
            expect(byTagCase).toHaveLength(1);
            expect(byTagCase[0].slug).toBe('second-post');
        });

        it('본문 내용에 매칭되는 경우 올바르게 반환한다', () => {
            const result = filterPosts(mockPosts, '조건부 타입');
            expect(result).toHaveLength(1);
            expect(result[0].slug).toBe('first-post');
        });

        it('한글 IME 입력 중 불완전 자모(예: "리액트ㄱ")가 들어와도 매칭한다', () => {
            const result = filterPosts(mockPosts, '리액트ㄱ');
            expect(result).toHaveLength(1);
            expect(result[0].slug).toBe('second-post');
        });

        it('일치하는 결과가 없는 경우 빈 배열을 반환한다', () => {
            const result = filterPosts(mockPosts, '존재하지않는포스트검색어');
            expect(result).toEqual([]);
        });
    });

    describe('filterProjects', () => {
        it('빈 검색어인 경우 원본 목록을 그대로 반환한다', () => {
            expect(filterProjects(mockProjects, '')).toEqual(mockProjects);
        });

        it('프로젝트 제목 및 태그로 정상 검색된다', () => {
            const byTitle = filterProjects(mockProjects, 'JW Platform');
            expect(byTitle).toHaveLength(1);
            expect(byTitle[0].slug).toBe('jwjoo-platform');

            const byTag = filterProjects(mockProjects, 'CleanArchitecture');
            expect(byTag).toHaveLength(1);
            expect(byTag[0].slug).toBe('clean-arch-starter');
        });

        it('한글 자모 보정으로 끝에 불완전 자모가 있어도 매칭된다', () => {
            const result = filterProjects(mockProjects, '스타터 킷ㅎ');
            expect(result).toHaveLength(1);
            expect(result[0].slug).toBe('clean-arch-starter');
        });
    });
});
