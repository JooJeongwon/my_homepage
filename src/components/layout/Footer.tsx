export default function Footer() {
    return (
        <footer className="border-t border-slate-200 dark:border-slate-800 py-10 mt-auto">
            <div className="max-w-4xl mx-auto px-6 text-center text-slate-500 text-sm">
                <p>© {new Date().getFullYear()} Jeongwon Joo. All rights reserved.</p>
                <p className="mt-2">
                    Built with <span className="text-slate-900 dark:text-slate-100 font-medium">Next.js</span> & <span className="text-slate-900 dark:text-slate-100 font-medium">Clean Architecture</span>
                </p>
            </div>
        </footer>
    );
}