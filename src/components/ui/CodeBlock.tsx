"use client";

import React, { useState, useRef } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CodeBlockProps extends React.HTMLAttributes<HTMLPreElement> {
    children?: React.ReactNode;
}

export function CodeBlock({ children, className, ...props }: CodeBlockProps) {
    const [isCopied, setIsCopied] = useState(false);
    const preRef = useRef<HTMLPreElement>(null);

    const copyToClipboard = async () => {
        if (!preRef.current) return;

        const code = preRef.current.textContent;
        if (code) {
            await navigator.clipboard.writeText(code);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }
    };

    return (
        <div className="relative group">
            <pre
                ref={preRef}
                /* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */
                tabIndex={0}
                role="region"
                aria-label="코드 블록"
                className={cn(
                    "relative overflow-x-auto py-4 px-4 rounded-2xl border transition-colors",
                    // Light mode
                    "bg-white border-neutral-200 text-neutral-800",
                    // Dark mode
                    "dark:bg-neutral-900/50 dark:border-neutral-800 dark:text-neutral-200",
                    // Focus styles (Keyboard navigation indicator without layout shift)
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/20 dark:focus-visible:ring-neutral-100/20",
                    className
                )}
                {...props}
            >
                {children}
            </pre>
            <button
                onClick={copyToClipboard}
                className={cn(
                    "absolute top-2 right-2 p-2 rounded-md transition-all duration-200",
                    "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100",
                    "opacity-0 group-hover:opacity-100 focus:opacity-100"
                )}
                aria-label="Copy code"
            >
                {isCopied ? (
                    <Check className="w-4 h-4 text-neutral-900 dark:text-neutral-100" />
                ) : (
                    <Copy className="w-4 h-4" />
                )}
            </button>
        </div>
    );
}
