'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function SmoothFocusScroll() {
    const pathname = usePathname();

    // 페이지(라우트) 이동 시 항상 즉시(instant) 최상단 스크롤 위치 복원
    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant',
        });
    }, [pathname]);

    useEffect(() => {
        let isKeyboardNavigation = false;
        let previousScrollY = 0;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Tab') {
                isKeyboardNavigation = true;
                previousScrollY = window.scrollY; // Tab 키를 누른 시점의 스크롤 위치 저장
            }
        };

        const handlePointerDown = () => {
            isKeyboardNavigation = false;
        };

        const handleFocusIn = (e: FocusEvent) => {
            if (!isKeyboardNavigation) return;

            const target = e.target as HTMLElement | null;
            if (!target) return;

            // 탭 누르기 전 스크롤 위치가 상단 부근(scrollY <= 50)이면 무시
            if (previousScrollY <= 50) return;

            const rect = target.getBoundingClientRect();
            // 현재 target의 화면 전체 절대 Y 좌표
            const absoluteTargetTop = window.scrollY + rect.top;

            // 1) 헤더 내부 요소이거나 본문 바로가기 스킵 링크 또는 상단 영역(Y < 150)인 경우
            const isHeaderElement = target.closest('header') !== null;
            const isSkipLink = target.getAttribute('href') === '#main-content';
            const isTopArea = absoluteTargetTop < 150;

            if (isHeaderElement || isSkipLink || isTopArea) {
                // 브라우저의 기본 instant 포커스 점프가 발생했을 경우 원래 위치로 복원 후 부드럽게 스크롤
                if (window.scrollY !== previousScrollY) {
                    window.scrollTo({ top: previousScrollY, behavior: 'instant' });
                }
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth',
                });
                return;
            }

            // 2) 포커스가 이전 스크롤 위치(previousScrollY)보다 위쪽에 위치한 요소로 올라간 경우
            if (absoluteTargetTop < previousScrollY - 50) {
                const targetY = Math.max(0, absoluteTargetTop - 80);
                if (window.scrollY !== previousScrollY) {
                    window.scrollTo({ top: previousScrollY, behavior: 'instant' });
                }
                window.scrollTo({
                    top: targetY,
                    behavior: 'smooth',
                });
                return;
            }

            // 3) 포커스가 아래쪽(뷰포트 하단 바깥)으로 내려간 경우 (코드블록, 복사 버튼, 하단 본문 링크 등)
            const viewportHeight = window.innerHeight;
            const isBelowViewport = rect.top > viewportHeight - 120 || rect.bottom > viewportHeight;
            if (isBelowViewport || absoluteTargetTop > previousScrollY + 50) {
                const targetY = Math.max(0, absoluteTargetTop - 150);
                if (window.scrollY !== previousScrollY) {
                    window.scrollTo({ top: previousScrollY, behavior: 'instant' });
                }
                window.scrollTo({
                    top: targetY,
                    behavior: 'smooth',
                });
            }
        };

        window.addEventListener('keydown', handleKeyDown, true);
        window.addEventListener('pointerdown', handlePointerDown, true);
        document.addEventListener('focusin', handleFocusIn, true);

        return () => {
            window.removeEventListener('keydown', handleKeyDown, true);
            window.removeEventListener('pointerdown', handlePointerDown, true);
            document.removeEventListener('focusin', handleFocusIn, true);
        };
    }, []);

    return null;
}
