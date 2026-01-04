'use client';

import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import clsx from 'clsx';

export function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);

        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <button
            type="button"
            onClick={scrollToTop}
            className={clsx(
                "fixed bottom-8 right-8 p-2.5 hidden sm:flex rounded-full shadow-lg border transition-all duration-300 z-50",
                "bg-neutral-100 dark:bg-neutral-900",
                "border-neutral-200 dark:border-neutral-700",
                "text-neutral-600 dark:text-neutral-400",
                "hover:text-neutral-900 dark:hover:text-neutral-100", // Hover mono text color
                "hover:border-neutral-300 dark:hover:border-neutral-600",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
            )}
            aria-label="Scroll to top"
        >
            <ArrowUp className="w-5 h-5" />
        </button>
    );
}
