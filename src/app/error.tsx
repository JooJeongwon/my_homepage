'use client'; // Error boundaries must be Client Components

import { useEffect } from 'react';
import { RefreshCcw } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <h1 className="text-9xl font-bold text-neutral-200 dark:text-neutral-800 mb-4 select-none">
                Oops!
            </h1>
            <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200 mb-2">
                Something went wrong
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-8 max-w-md">
                We apologize for the inconvenience. An unexpected error has occurred.
            </p>
            <button
                onClick={
                    // Attempt to recover by trying to re-render the segment
                    () => reset()
                }
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-medium hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
            >
                <RefreshCcw className="w-4 h-4" />
                Try again
            </button>
        </div>
    );
}
