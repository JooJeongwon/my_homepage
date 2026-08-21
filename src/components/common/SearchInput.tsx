'use client';

import React, { useRef, useEffect, useId } from 'react';
import { Search, X } from 'lucide-react';

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    id?: string;
    label?: string;
    showLabel?: boolean;
}

export default function SearchInput({ 
    value, 
    onChange, 
    placeholder = 'Search...',
    id,
    label = '검색',
    showLabel = false
}: SearchInputProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const generatedId = useId();
    const inputId = id || generatedId;

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === '/' && document.activeElement !== inputRef.current && 
                document.activeElement?.tagName !== 'INPUT' && 
                document.activeElement?.tagName !== 'TEXTAREA') {
                e.preventDefault();
                inputRef.current?.focus();
            }
            const isModKey = e.metaKey || e.ctrlKey;
            if (isModKey && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                inputRef.current?.focus();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange('');
        inputRef.current?.focus();
    };

    return (
        <div className="relative w-full max-w-md">
            <label
                htmlFor={inputId}
                className={showLabel ? "block text-sm font-medium mb-1.5 text-neutral-700 dark:text-neutral-300" : "sr-only"}
            >
                {label}
            </label>

            <div 
                className="cursor-text group relative flex items-center w-full rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 shadow-sm transition-all duration-300 ease-out focus-within:ring-2 focus-within:ring-neutral-900/10 focus-within:border-neutral-900 dark:focus-within:ring-neutral-100/10 dark:focus-within:border-neutral-100 focus-within:bg-white dark:focus-within:bg-neutral-900 focus-within:shadow-md"
            >
                <div className="pl-4 pr-2 text-neutral-500 dark:text-neutral-400 pointer-events-none transition-colors group-focus-within:text-neutral-800 dark:group-focus-within:text-neutral-200">
                    <Search className="w-4 h-4" aria-hidden="true" />
                </div>

                <input
                    ref={inputRef}
                    id={inputId}
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full py-3 pr-12 text-sm bg-transparent outline-none border-none ring-0 shadow-none focus:outline-none focus:ring-0 focus:border-none focus:shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-none text-neutral-800 dark:text-neutral-200 placeholder-neutral-500 dark:placeholder-neutral-400"
                    style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}
                />

                {value && (
                    <div className="absolute right-3 flex items-center gap-1.5 pointer-events-none">
                        <button
                            type="button"
                            onClick={handleClear}
                            className="p-1 rounded-full text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors pointer-events-auto"
                            aria-label="Clear search"
                        >
                            <X className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
