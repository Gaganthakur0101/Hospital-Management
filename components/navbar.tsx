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
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo - Left Side */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href={user ? `/profile/${user.id}` : "/"} className="flex items-center space-x-2">
                            <Image 
                                src={Logo} 
                                alt="Hospital Management Logo" 
                                width={40} 
                                height={40}
                                className="rounded-lg"
                            />
                            <span className="text-xl font-bold text-blue-600 hidden sm:block">
                                MediCare
                            </span>
                        </Link>
                    </div>

                    {/* Navigation Links - Middle */}
                    <div className="hidden md:flex space-x-8 items-center">
                        <Link 
                            href={user ? `/profile/${user.id}` : "/"} 
                            className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                            Home
                        </Link>
                        <Link 
                            href="/hospitalList" 
                            className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                            Hospitals List
                        </Link>
                        
                        {/* Show these links only when user is logged in */}
                        {user && (
                            <>
                                <Link 
                                    href="/hospitals/popular" 
                                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    Popular Hospitals
                                </Link>
                                <Link 
                                    href="/about" 
                                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    About
                                </Link>
                                <Link 
                                    href="/contact" 
                                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
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
                                {/* Register Hospital Button - Only for Doctors */}
                                {user.role === 'doctor' && (
                                    <Link
                                        href="/registerHospital"
                                        className="hidden md:block bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
                                    >
                                        Register Hospital
                                    </Link>
                                )}

                                {/* User Profile */}
                                <div className="relative">
                                    <button
                                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                                        className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
                                    >
                                        {getInitials(user.name)}
                                    </button>

                                    {/* Profile Dropdown */}
                                    {showProfileMenu && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200">
                                            <div className="px-4 py-2 border-b border-gray-200">
                                                <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                                                <p className="text-xs text-gray-500">{user.email}</p>
                                                <p className="text-xs text-blue-600 capitalize mt-1">{user.role}</p>
                                            </div>
                                            <Link
                                                href={`/profile/${user.id}`}
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                onClick={() => setShowProfileMenu(false)}
                                            >
                                                My Profile
                                            </Link>
                                            <Link
                                                href="/profile"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                onClick={() => setShowProfileMenu(false)}
                                            >
                                                Settings
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
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
                                    className="text-blue-600 hover:text-blue-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/signup"
                                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden text-gray-700 hover:text-blue-600 p-2"
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
                    <div className="md:hidden border-t border-gray-200">
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            <Link
                                href={user ? `/profile/${user.id}` : "/"}
                                className="block text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md text-base font-medium"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Home
                            </Link>
                            <Link
                                href="/hospitals"
                                className="block text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md text-base font-medium"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Hospitals List
                            </Link>
                            
                            {/* Show these links only when user is logged in */}
                            {user && (
                                <>
                                    <Link
                                        href="/hospitals/popular"
                                        className="block text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md text-base font-medium"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Popular Hospitals
                                    </Link>
                                    <Link
                                        href="/about"
                                        className="block text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md text-base font-medium"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        About
                                    </Link>
                                    <Link
                                        href="/contact"
                                        className="block text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md text-base font-medium"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Contact
                                    </Link>
                                </>
                            )}
                            
                            {user?.role === 'doctor' && (
                                <Link
                                    href="/registerHospital"
                                    className="block bg-green-600 text-white px-3 py-2 rounded-md text-base font-medium hover:bg-green-700"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Register Hospital
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;

    