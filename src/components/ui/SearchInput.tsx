'use client';

import React, { useRef, useEffect, useState, useId } from 'react';
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
    const [isMac, setIsMac] = useState(true);
    const generatedId = useId();
    const inputId = id || generatedId;

    // OS 체크 (서버 사이드 렌더링 시에는 window가 없으므로 useEffect 내에서 실행)
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0);
        }
    }, []);

    // 글로벌 단축키 등록 (⌘K, Ctrl+K, /)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // / 키 누를 때 (input 등에 이미 포커스가 가있을 때는 무시)
            if (e.key === '/' && document.activeElement !== inputRef.current && 
                document.activeElement?.tagName !== 'INPUT' && 
                document.activeElement?.tagName !== 'TEXTAREA') {
                e.preventDefault();
                inputRef.current?.focus();
            }
            // ⌘K 또는 Ctrl+K
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
            {/* Form Control accessibility: 명시적/비시각적 label 연동 */}
            <label
                htmlFor={inputId}
                className={showLabel ? "block text-sm font-medium mb-1.5 text-neutral-700 dark:text-neutral-300" : "sr-only"}
            >
                {label}
            </label>

            <div 
                onClick={() => inputRef.current?.focus()}
                className="cursor-text group relative flex items-center w-full rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 shadow-sm transition-all duration-300 ease-out focus-within:ring-2 focus-within:ring-neutral-900/10 focus-within:border-neutral-900 dark:focus-within:ring-neutral-100/10 dark:focus-within:border-neutral-100 focus-within:bg-white dark:focus-within:bg-neutral-900 focus-within:shadow-md"
            >
                {/* 돋보기 아이콘 (Decorative) */}
                <div className="pl-4 pr-2 text-neutral-500 dark:text-neutral-400 pointer-events-none transition-colors group-focus-within:text-neutral-800 dark:group-focus-within:text-neutral-200">
                    <Search className="w-4 h-4" aria-hidden="true" />
                </div>

                {/* 입력창 */}
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

                {/* 우측 아이콘/배지 영역 */}
                {value && (
                    <div className="absolute right-3 flex items-center gap-1.5 pointer-events-none">
                        {/* 지우기 버튼 */}
                        <button
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
