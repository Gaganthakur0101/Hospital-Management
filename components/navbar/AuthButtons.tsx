import Link from 'next/link';

export const AuthButtons = () => {
    return (
        <>
            <Link
                href="/login"
                className="rounded-lg border border-cyan-200/40 px-4 py-2 text-sm font-semibold text-cyan-100 transition-all duration-200 hover:bg-cyan-300/10"
            >
                Login
            </Link>
            <Link
                href="/signup"
                className="rounded-lg bg-cyan-400 px-4 py-2 text-sm font-bold text-slate-950 transition-all duration-200 hover:scale-[1.02] hover:bg-cyan-300"
            >
                Sign Up
            </Link>
        </>
    );
};
