
import { Link } from '@inertiajs/react';
import type { ReactNode } from 'react';

interface AuthSimpleLayoutProps {
    children: ReactNode;
    title: string;
    description: string;
}

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthSimpleLayoutProps) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-purple-100 via-pink-50 to-purple-200 p-6 dark:from-gray-950 dark:via-purple-950 dark:to-gray-900">

            <div className="mb-8 text-center">
                <Link
                    href="/"
                    className="inline-flex flex-col items-center gap-2"
                >
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-600 text-white shadow-lg shadow-purple-300 dark:shadow-purple-950">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M3 2v7a3 3 0 0 0 6 0V2" />
                            <path d="M6 2v20" />
                            <path d="M19 2v20" />
                            <path d="M19 2a4 4 0 0 0-4 4v4h4" />
                        </svg>
                    </div>

                    <span className="text-xl font-bold text-purple-900 dark:text-purple-200">
                        Restaurant Reservation
                    </span>
                </Link>
            </div>

            <div className="w-full max-w-md rounded-2xl border border-purple-100 bg-white p-8 shadow-xl shadow-purple-200/50 dark:border-purple-800 dark:bg-gray-900 dark:shadow-none">

                <div className="mb-7 text-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {title}
                    </h1>

                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        {description}
                    </p>
                </div>

                {children}

            </div>

            <p className="mt-8 text-center text-xs text-gray-500 dark:text-gray-400">
                © {new Date().getFullYear()} Restaurant Reservation System
            </p>

        </div>
    );
}
