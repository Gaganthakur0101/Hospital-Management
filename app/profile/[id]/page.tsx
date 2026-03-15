'use client';

import Link from 'next/link';
import React, { useEffect, useState, useMemo } from 'react';

interface User {
    id: string;
    name: string;
    email: string;
    role?: 'doctor' | 'patient';
}

const rotatingLines = [
    'Get your best hospital nearby you',
    'Connect with top doctors worldwide',
    'Book appointments with confidence',
    'Experience premium healthcare',
];

const Page = () => {
    const [user, setUser] = useState<User | null>(null);
    const [lineIndex, setLineIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const currentLine = useMemo(() => rotatingLines[lineIndex], [lineIndex]);

    // Fetch user data based on profile ID
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`/api/users/me`, {
                    method: 'GET',
                    credentials: 'include',
                });

                if (response.ok) {
                    const data = await response.json();
                    setUser(data.user ?? null);
                }
            } catch (error) {
                console.error('Error fetching user:', error);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();
    }, []);

    // Typing animation effect
    useEffect(() => {
        const speed = isDeleting ? 36 : 65;

        const timer = window.setTimeout(() => {
            if (!isDeleting && displayedText.length < currentLine.length) {
                setDisplayedText(currentLine.slice(0, displayedText.length + 1));
                return;
            }

            if (!isDeleting && displayedText.length === currentLine.length) {
                window.setTimeout(() => setIsDeleting(true), 1500);
                return;
            }

            if (isDeleting && displayedText.length > 0) {
                setDisplayedText(currentLine.slice(0, displayedText.length - 1));
                return;
            }

            if (isDeleting && displayedText.length === 0) {
                setIsDeleting(false);
                setLineIndex((prev) => (prev + 1) % rotatingLines.length);
            }
        }, speed);

        return () => window.clearTimeout(timer);
    }, [currentLine, displayedText, isDeleting]);

    return (
        <main className="relative min-h-[calc(100vh-64px)] overflow-hidden bg-slate-950 px-4 py-14 sm:px-8">
            {/* Animated background blobs */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -left-24 top-12 h-72 w-72 rounded-full bg-cyan-500/25 blur-3xl animate-float-slow" />
                <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-blue-400/20 blur-3xl animate-float-fast" />
                <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-purple-400/20 blur-3xl animate-float-slow" />
            </div>

            <section className="relative mx-auto w-full max-w-5xl">
                {/* Welcome message with user name */}
                <div className="animate-rise-up mb-6">
                    <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-cyan-400">Welcome Back</p>
                    <h1 className="text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
                        Hello, <span className="text-cyan-400">{user?.name || 'User'}</span>
                    </h1>
                </div>

                {/* Subheading */}
                <div className="animate-rise-up mb-6 delay-100">
                    <h2 className="text-xl font-semibold text-slate-300 sm:text-2xl">
                        Find the best healthcare services
                    </h2>
                </div>

                {/* Typing animation text */}
                <div className="mt-4 min-h-16 mb-3">
                    <p className="text-lg font-medium sm:text-xl animate-color-shift" style={{ fontFamily: '"Lucida Sans", "Gill Sans", sans-serif' }}>
                        <span className="text-transparent bg-linear-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text">{displayedText}</span>
                        <span className="ml-1 inline-block h-6 w-0.5 animate-cursor bg-linear-to-b from-cyan-400 to-blue-500 align-middle" />
                    </p>
                </div>

                {/* Description text */}
                <p className="mt-2 max-w-2xl text-base leading-relaxed text-slate-200 sm:text-lg animate-fade-in-delayed">
                    Explore our comprehensive network of hospitals and connect with world-class doctors. Manage your healthcare journey with ease and confidence.
                </p>

                {/* Two large action buttons */}
                <div className="mt-12 flex flex-col gap-6 sm:flex-row sm:gap-8 animate-fade-in-delayed delay-200">
                    {/* Hospital List Button - Blue */}
                    <Link
                        href="/hospitalList"
                        className="group inline-flex items-center justify-center rounded-xl bg-cyan-500 px-10 py-5 text-xl font-semibold text-white shadow-lg transition duration-300 hover:scale-[1.02] hover:bg-cyan-600 hover:shadow-cyan-500/50 hover:shadow-xl"
                    >
                        Hospital List
                        <span className="ml-3 inline-block transition group-hover:translate-x-1">→</span>
                    </Link>

                    {/* Doctor List Button - White */}
                    <Link
                        href="/hospitalList"
                        className="group inline-flex items-center justify-center rounded-xl border-2 border-slate-400 bg-slate-900/50 px-10 py-5 text-xl font-semibold text-white shadow-lg transition duration-300 hover:scale-[1.02] hover:border-slate-300 hover:bg-slate-800 hover:shadow-lg"
                    >
                        Doctor List
                        <span className="ml-3 inline-block transition group-hover:translate-x-1">→</span>
                    </Link>
                </div>

                {/* Features Section */}
                <div className="mt-16">
                    <h3 className="text-2xl font-bold text-white mb-8 animate-fade-in-delayed delay-300">What MediCare Offers</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Feature Card 1 */}
                        <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-6 backdrop-blur-sm hover:border-cyan-500/60 hover:bg-cyan-500/20 transition duration-300 animate-fade-in-delayed delay-300">
                            <div className="text-3xl mb-3">🏥</div>
                            <h4 className="text-lg font-semibold text-white mb-2">Find Hospitals</h4>
                            <p className="text-slate-300 text-sm">Browse and locate the best hospitals near you with complete details and ratings.</p>
                        </div>

                        {/* Feature Card 2 */}
                        <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-6 backdrop-blur-sm hover:border-blue-500/60 hover:bg-blue-500/20 transition duration-300 animate-fade-in-delayed delay-300">
                            <div className="text-3xl mb-3">👨‍⚕️</div>
                            <h4 className="text-lg font-semibold text-white mb-2">Connect with Doctors</h4>
                            <p className="text-slate-300 text-sm">Access qualified doctors from around the world and book your consultations.</p>
                        </div>

                        {/* Feature Card 3 */}
                        <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-6 backdrop-blur-sm hover:border-purple-500/60 hover:bg-purple-500/20 transition duration-300 animate-fade-in-delayed delay-300">
                            <div className="text-3xl mb-3">📅</div>
                            <h4 className="text-lg font-semibold text-white mb-2">Easy Appointments</h4>
                            <p className="text-slate-300 text-sm">Schedule appointments with ease and manage your healthcare journey efficiently.</p>
                        </div>
                    </div>
                </div>

                {/* Quick Stats Section */}
                <div className="mt-16">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Stat Card 1 */}
                        <div className="rounded-lg border border-white/10 bg-white/5 p-5 text-center animate-fade-in-delayed delay-300">
                            <p className="text-3xl font-bold text-cyan-400">500+</p>
                            <p className="text-sm text-slate-300 mt-2">Hospitals</p>
                        </div>

                        {/* Stat Card 2 */}
                        <div className="rounded-lg border border-white/10 bg-white/5 p-5 text-center animate-fade-in-delayed delay-300">
                            <p className="text-3xl font-bold text-cyan-400">2000+</p>
                            <p className="text-sm text-slate-300 mt-2">Doctors</p>
                        </div>

                        {/* Stat Card 3 */}
                        <div className="rounded-lg border border-white/10 bg-white/5 p-5 text-center animate-fade-in-delayed delay-300">
                            <p className="text-3xl font-bold text-cyan-400">50K+</p>
                            <p className="text-sm text-slate-300 mt-2">Happy Patients</p>
                        </div>

                        {/* Stat Card 4 */}
                        <div className="rounded-lg border border-white/10 bg-white/5 p-5 text-center animate-fade-in-delayed delay-300">
                            <p className="text-3xl font-bold text-cyan-400">24/7</p>
                            <p className="text-sm text-slate-300 mt-2">Support</p>
                        </div>
                    </div>
                </div>

                {/* Profile Info Display */}
                <div className="mt-16 rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-8 backdrop-blur-sm animate-fade-in-delayed delay-300">
                    <h3 className="text-xl font-bold text-white mb-6">Your Profile Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p className="text-sm text-slate-400 mb-1">Full Name</p>
                            <p className="text-lg font-semibold text-white">{user?.name || 'Not Available'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-400 mb-1">Email Address</p>
                            <p className="text-lg font-semibold text-white">{user?.email || 'Not Available'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-400 mb-1">Role</p>
                            <p className="text-lg font-semibold text-cyan-300 font-mono">{user?.role || 'Not Available'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-400 mb-1">Status</p>
                            <p className="text-lg font-semibold text-emerald-400">Active</p>
                        </div>
                    </div>
                </div>

            </section>

            {/* Animations */}
            <style jsx>{`
                .animate-rise-up {
                    animation: riseUp 0.85s ease-out forwards;
                }

                .animate-rise-up.delay-100 {
                    opacity: 0;
                    animation: riseUp 0.85s ease-out 0.1s forwards;
                }

                .animate-fade-in-delayed {
                    opacity: 0;
                    animation: fadeInCard 1s ease-out 0.2s forwards;
                }

                .animate-fade-in-delayed.delay-200 {
                    animation: fadeInCard 1s ease-out 0.4s forwards;
                }

                .animate-fade-in-delayed.delay-300 {
                    animation: fadeInCard 1s ease-out 0.6s forwards;
                }

                .animate-float-slow {
                    animation: floatSlow 10s ease-in-out infinite;
                }

                .animate-float-fast {
                    animation: floatFast 7s ease-in-out infinite;
                }

                .animate-cursor {
                    animation: blink 0.9s steps(1, end) infinite;
                }

                @keyframes riseUp {
                    from {
                        opacity: 0;
                        transform: translateY(24px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes fadeInCard {
                    from {
                        opacity: 0;
                        transform: translateY(22px) scale(0.98);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                @keyframes floatSlow {
                    0%,
                    100% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(-16px);
                    }
                }

                @keyframes floatFast {
                    0%,
                    100% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(-11px);
                    }
                }

                @keyframes blink {
                    0%,
                    49% {
                        opacity: 1;
                    }
                    50%,
                    100% {
                        opacity: 0;
                    }
                }
 `}</style>
        </main>
    );
}

export default Page;
