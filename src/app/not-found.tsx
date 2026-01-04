import Link from 'next/link';
import { Home } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <h1 className="text-9xl font-bold text-neutral-200 dark:text-neutral-800 mb-4 select-none">
                404
            </h1>
            <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200 mb-2">
                Page not found
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-8 max-w-md">
                Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
            </p>
            <Link
                href="/"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-medium hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
            >
                <Home className="w-4 h-4" />
                Go back home
            </Link>
        </div>
    );
}
