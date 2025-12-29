export default function Footer() {
    return (
        <footer className="border-t border-neutral-200 dark:border-neutral-800 py-6 mt-auto">
            <div className="max-w-4xl mx-auto px-6 text-center text-neutral-500 text-sm">
                <p>© {new Date().getFullYear()} Jeongwon Joo. All rights reserved.</p>
            </div>
        </footer>
    );
}