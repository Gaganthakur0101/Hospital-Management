import Link from 'next/link';

interface NotificationButtonProps {
    userId: string;
}

export const NotificationButton = ({ userId }: NotificationButtonProps) => {
    return (
        <Link
            href={`/profile/${userId}`}
            className="hidden items-center gap-2 rounded-lg border border-cyan-200/30 bg-cyan-400/10 px-3 py-2 text-sm font-semibold text-cyan-100 transition-all duration-200 hover:bg-cyan-300/20 md:inline-flex"
            title="See your appointment notifications"
        >
            <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
        </Link>
    );
};
