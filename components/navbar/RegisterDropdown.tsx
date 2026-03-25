'use client';

import { useState } from 'react';
import Link from 'next/link';

export const RegisterDropdown = () => {
    const [showMenu, setShowMenu] = useState(false);

    return (
        <div className="relative hidden md:block">
            <button
                onClick={() => setShowMenu(!showMenu)}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-400 px-4 py-2 text-sm font-bold text-slate-950 transition-all duration-200 hover:scale-[1.02] hover:bg-emerald-300"
            >
                Register
                <svg
                    className={`h-4 w-4 transition-transform ${showMenu ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {showMenu && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-white/15 bg-slate-900/95 py-1 shadow-2xl backdrop-blur-xl">
                    <Link
                        href="/register/registerHospital"
                        className="block px-4 py-2 text-sm text-slate-100 transition-colors hover:bg-white/10"
                        onClick={() => setShowMenu(false)}
                    >
                        Register your hospital
                    </Link>
                    <Link
                        href="/register/registerDoctor"
                        className="block px-4 py-2 text-sm text-slate-100 transition-colors hover:bg-white/10"
                        onClick={() => setShowMenu(false)}
                    >
                        Register as a Doctor
                    </Link>
                </div>
            )}
        </div>
    );
};
