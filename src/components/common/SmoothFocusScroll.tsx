'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function SmoothFocusScroll() {
    const pathname = usePathname();

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
                previousScrollY = window.scrollY;
            }
        };

        const handlePointerDown = () => {
            isKeyboardNavigation = false;
        };

        const handleFocusIn = (e: FocusEvent) => {
            if (!isKeyboardNavigation) return;

            const target = e.target as HTMLElement | null;
            if (!target) return;

            const isFixedOrSticky = (el: HTMLElement) => {
                let current: HTMLElement | null = el;
                while (current && current !== document.body && current !== document.documentElement) {
                    if (current.style?.position === 'fixed' || current.style?.position === 'sticky') {
                        return true;
                    }
                    if (typeof window !== 'undefined' && window.getComputedStyle) {
                        const style = window.getComputedStyle(current);
                        if (style.position === 'fixed' || style.position === 'sticky') {
                            return true;
                        }
                    }
                    current = current.parentElement;
                }
                return false;
            };

            const isHeaderElement = target.closest('header') !== null;
            const isTocNav = target.closest('[aria-label="목차"]') !== null;

            if ((isFixedOrSticky(target) || isTocNav) && !isHeaderElement) {
                return;
            }

            if (previousScrollY <= 50) return;

            const rect = target.getBoundingClientRect();
            const absoluteTargetTop = window.scrollY + rect.top;

            const isSkipLink = target.getAttribute('href') === '#main-content';
            const isTopArea = absoluteTargetTop < 150;

            if (isHeaderElement || isSkipLink || isTopArea) {
                if (window.scrollY !== previousScrollY) {
                    window.scrollTo({ top: previousScrollY, behavior: 'instant' });
                }
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth',
                });
                return;
            }

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
