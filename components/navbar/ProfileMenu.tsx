'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getInitials } from '../utils/navbarUtils';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'doctor' | 'patient';
}

interface ProfileMenuProps {
    user: User;
    onLogout: () => void;
}

export const ProfileMenu = ({ user, onLogout }: ProfileMenuProps) => {
    const [showMenu, setShowMenu] = useState(false);
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await fetch('/api/users/logout', { method: 'POST' });
            setShowMenu(false);
            onLogout();
            router.push('/');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-cyan-200/30 bg-cyan-400/20 font-semibold text-cyan-100 transition-all duration-200 hover:bg-cyan-300/30"
            >
                {getInitials(user.name)}
            </button>

            {showMenu && (
                <div className="absolute right-0 mt-2 w-52 rounded-xl border border-white/15 bg-slate-900/95 py-1 shadow-2xl backdrop-blur-xl">
                    <div className="border-b border-white/10 px-4 py-2">
                        <p className="text-sm font-semibold text-cyan-100">{user.name}</p>
                        <p className="text-xs text-slate-300">{user.email}</p>
                        <p className="mt-1 text-xs capitalize text-cyan-300">{user.role}</p>
                    </div>
                    <Link
                        href={`/profile/${user.id}`}
                        className="block px-4 py-2 text-sm text-slate-100 transition-colors hover:bg-white/10"
                        onClick={() => setShowMenu(false)}
                    >
                        My Profile
                    </Link>
                    <Link
                        href={`/profile/${user.id}`}
                        className="block px-4 py-2 text-sm text-slate-100 transition-colors hover:bg-white/10"
                        onClick={() => setShowMenu(false)}
                    >
                        Settings
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="block w-full px-4 py-2 text-left text-sm text-rose-300 transition-colors hover:bg-white/10"
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
};
