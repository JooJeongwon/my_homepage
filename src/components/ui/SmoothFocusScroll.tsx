'use client';

import { useEffect } from 'react';

export function SmoothFocusScroll() {
    useEffect(() => {
        let isKeyboardNavigation = false;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Tab') {
                isKeyboardNavigation = true;
            }
        };

        const handlePointerDown = () => {
            isKeyboardNavigation = false;
        };

        const handleFocusIn = (e: FocusEvent) => {
            if (!isKeyboardNavigation) return;

            const target = e.target as HTMLElement | null;
            if (!target) return;

            // 현재 스크롤 위치가 50px 이상 내려와 있는 경우에만 처리
            if (window.scrollY <= 50) return;

            const rect = target.getBoundingClientRect();
            const absoluteTargetTop = window.scrollY + rect.top;

            // 1) 헤더 내부 요소이거나 본문 바로가기 스킵 링크 또는 상단 영역(Y < 150)인 경우 -> 최상단(top: 0)으로 부드럽게 스크롤
            const isHeaderElement = target.closest('header') !== null;
            const isSkipLink = target.getAttribute('href') === '#main-content';
            const isTopArea = absoluteTargetTop < 150;

            if (isHeaderElement || isSkipLink || isTopArea) {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth',
                });
                return;
            }

            // 2) 현재 스크롤 위치보다 위쪽에 위치한 요소로 포커스가 올라간 경우
            if (absoluteTargetTop < window.scrollY - 50) {
                const targetY = Math.max(0, absoluteTargetTop - 80);
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
