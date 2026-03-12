'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import Logo from "../assets/Gemini_Generated_Image_853s5w853s5w853s.png";

interface User {
    id: string;
    name: string;
    email: string;
    role: 'doctor' | 'patient';
}

const Navbar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<User | null>(null);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showRegisterMenu, setShowRegisterMenu] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Check if user is logged in by verifying with database
    useEffect(() => {
        const checkUser = async () => {
            try {
                const response = await fetch('/api/users/me', {
                    method: 'GET',
                    credentials: 'include', // Include cookies in the request
                });

                if (response.ok) {
                    const data = await response.json();
                    setUser(data.user);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error('Error fetching user:', error);
                setUser(null);
            }
        };

        // Check on mount and pathname change
        checkUser();
    }, [pathname]); // Re-check when pathname changes

    // Hide navbar on auth pages (login, signup, forgotPassword)
    const isAuthPage = pathname?.startsWith('/login') || 
                       pathname?.startsWith('/signup') || 
                       pathname?.startsWith('/forgotPassword');

    if (isAuthPage) {
        return null;
    }

    const handleLogout = async () => {
        try {
            await fetch('/api/users/logout', { method: 'POST' });
            setUser(null);
            setShowProfileMenu(false);
            router.push('/');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 shadow-[0_10px_35px_rgba(6,182,212,0.12)] backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo - Left Side */}
                    <div className="shrink-0 flex items-center">
                        <Link href={user ? `/profile/${user.id}` : "/"} className="flex items-center space-x-2">
                            <Image 
                                src={Logo} 
                                alt="Hospital Management Logo" 
                                width={40} 
                                height={40}
                                className="rounded-lg"
                            />
                            <span className="hidden text-xl font-extrabold text-cyan-200 sm:block">
                                MediCare
                            </span>
                        </Link>
                    </div>

                    {/* Navigation Links - Middle */}
                    <div className="hidden md:flex space-x-8 items-center">
                        <Link 
                            href={user ? `/profile/${user.id}` : "/"} 
                            className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-200 transition-all duration-200 hover:bg-white/10 hover:text-cyan-200"
                        >
                            Home
                        </Link>
                        <Link 
                            href="/hospitalList" 
                            className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-200 transition-all duration-200 hover:bg-white/10 hover:text-cyan-200"
                        >
                            Hospitals List
                        </Link>
                        
                        {/* Show these links only when user is logged in */}
                        {user && (
                            <>
                                <Link 
                                    href="/doctors" 
                                    className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-200 transition-all duration-200 hover:bg-white/10 hover:text-cyan-200"
                                >
                                    Doctors List
                                </Link>
                                <Link 
                                    href="/about" 
                                    className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-200 transition-all duration-200 hover:bg-white/10 hover:text-cyan-200"
                                >
                                    About
                                </Link>
                                <Link 
                                    href="/contact" 
                                    className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-200 transition-all duration-200 hover:bg-white/10 hover:text-cyan-200"
                                >
                                    Contact
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Right Side - Auth & Profile */}
                    <div className="flex items-center space-x-4">
                        {user ? (
                            <>
                                {/* Register Dropdown */}
                                <div className="relative hidden md:block">
                                    <button
                                        onClick={() => {
                                            setShowRegisterMenu(!showRegisterMenu);
                                            setShowProfileMenu(false);
                                        }}
                                        className="inline-flex items-center gap-2 rounded-lg bg-emerald-400 px-4 py-2 text-sm font-bold text-slate-950 transition-all duration-200 hover:scale-[1.02] hover:bg-emerald-300"
                                    >
                                        Register
                                        <svg
                                            className={`h-4 w-4 transition-transform ${showRegisterMenu ? 'rotate-180' : ''}`}
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            viewBox="0 0 24 24"
                                            aria-hidden="true"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    {showRegisterMenu && (
                                        <div className="absolute right-0 mt-2 w-56 rounded-xl border border-white/15 bg-slate-900/95 py-1 shadow-2xl backdrop-blur-xl">
                                            <Link
                                                href="/register/registerHospital"
                                                className="block px-4 py-2 text-sm text-slate-100 transition-colors hover:bg-white/10"
                                                onClick={() => setShowRegisterMenu(false)}
                                            >
                                                Register your hospital
                                            </Link>
                                            <Link
                                                href="/register/registerDoctor"
                                                className="block px-4 py-2 text-sm text-slate-100 transition-colors hover:bg-white/10"
                                                onClick={() => setShowRegisterMenu(false)}
                                            >
                                                Register as a Doctor
                                            </Link>
                                        </div>
                                    )}
                                </div>

                                {/* Notification Button - Only for Logged In Users */}
                                <Link
                                    href={`/profile/${user.id}`}
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

                                {/* User Profile */}
                                <div className="relative">
                                    <button
                                        onClick={() => {
                                            setShowProfileMenu(!showProfileMenu);
                                            setShowRegisterMenu(false);
                                        }}
                                        className="flex h-10 w-10 items-center justify-center rounded-full border border-cyan-200/30 bg-cyan-400/20 font-semibold text-cyan-100 transition-all duration-200 hover:bg-cyan-300/30"
                                    >
                                        {getInitials(user.name)}
                                    </button>

                                    {/* Profile Dropdown */}
                                    {showProfileMenu && (
                                        <div className="absolute right-0 mt-2 w-52 rounded-xl border border-white/15 bg-slate-900/95 py-1 shadow-2xl backdrop-blur-xl">
                                            <div className="border-b border-white/10 px-4 py-2">
                                                <p className="text-sm font-semibold text-cyan-100">{user.name}</p>
                                                <p className="text-xs text-slate-300">{user.email}</p>
                                                <p className="mt-1 text-xs capitalize text-cyan-300">{user.role}</p>
                                            </div>
                                            <Link
                                                href={`/profile/${user.id}`}
                                                className="block px-4 py-2 text-sm text-slate-100 transition-colors hover:bg-white/10"
                                                onClick={() => setShowProfileMenu(false)}
                                            >
                                                My Profile
                                            </Link>
                                            <Link
                                                href={`/profile/${user.id}`}
                                                className="block px-4 py-2 text-sm text-slate-100 transition-colors hover:bg-white/10"
                                                onClick={() => setShowProfileMenu(false)}
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
                            </>
                        ) : (
                            <>
                                {/* Login & Signup Buttons - Not Logged In */}
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
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 text-slate-200 transition-colors hover:text-cyan-200 md:hidden"
                        >
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                {isMobileMenuOpen ? (
                                    <path d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="border-t border-white/10 bg-slate-900/95 md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            <Link
                                href={user ? `/profile/${user.id}` : "/"}
                                className="block rounded-lg px-3 py-2 text-base font-semibold text-slate-100 transition-colors hover:bg-white/10"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Home
                            </Link>
                            <Link
                                href="/hospitalList"
                                className="block rounded-lg px-3 py-2 text-base font-semibold text-slate-100 transition-colors hover:bg-white/10"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Hospitals List
                            </Link>
                            
                            {/* Show these links only when user is logged in */}
                            {user && (
                                <>
                                    <Link
                                        href="/hospitals/popular"
                                        className="block rounded-lg px-3 py-2 text-base font-semibold text-slate-100 transition-colors hover:bg-white/10"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Popular Hospitals
                                    </Link>
                                    <Link
                                        href="/about"
                                        className="block rounded-lg px-3 py-2 text-base font-semibold text-slate-100 transition-colors hover:bg-white/10"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        About
                                    </Link>
                                    <Link
                                        href="/contact"
                                        className="block rounded-lg px-3 py-2 text-base font-semibold text-slate-100 transition-colors hover:bg-white/10"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Contact
                                    </Link>
                                    <Link
                                        href={`/profile/${user.id}`}
                                        className="block rounded-lg border border-cyan-200/30 bg-cyan-400/10 px-3 py-2 text-base font-semibold text-cyan-100 transition-colors hover:bg-cyan-300/20"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Notifications
                                    </Link>
                                </>
                            )}
                            
                            {user && (
                                <div className="space-y-1 pt-1">
                                    <p className="px-3 text-xs font-semibold uppercase tracking-wider text-emerald-300">Register</p>
                                    <Link
                                        href="/register/registerHospital"
                                        className="block rounded-lg bg-emerald-400 px-3 py-2 text-base font-bold text-slate-950 transition-colors hover:bg-emerald-300"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Register your hospital
                                    </Link>
                                    <Link
                                        href="/signup"
                                        className="block rounded-lg border border-cyan-200/40 px-3 py-2 text-base font-semibold text-cyan-100 transition-colors hover:bg-cyan-300/10"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Register as a Doctor
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;

    