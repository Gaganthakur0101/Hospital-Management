'use client';

import Link from 'next/link';
import React, { useEffect, useMemo, useRef, useState } from 'react';

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

const statConfigs = [
    { key: 'hospitals', label: 'Hospitals', target: 500, suffix: '+' },
    { key: 'doctors', label: 'Doctors', target: 2000, suffix: '+' },
    { key: 'patients', label: 'Happy Patients', target: 50, suffix: 'K+' },
    { key: 'support', label: 'Support', target: 24, suffix: '/7' },
] as const;

type StatKey = (typeof statConfigs)[number]['key'];
type AnimatedStats = Record<StatKey, number>;

const Page = () => {
    const [user, setUser] = useState<User | null>(null);
    const [lineIndex, setLineIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [hasStartedCountUp, setHasStartedCountUp] = useState(false);
    const [animatedStats, setAnimatedStats] = useState<AnimatedStats>({
        hospitals: 0,
        doctors: 0,
        patients: 0,
        support: 0,
    });
    const statsSectionRef = useRef<HTMLDivElement | null>(null);

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

    // Start number animation only when stats section enters the viewport.
    useEffect(() => {
        const section = statsSectionRef.current;

        if (!section || hasStartedCountUp) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                if (entry.isIntersecting) {
                    setHasStartedCountUp(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.35 }
        );

        observer.observe(section);

        return () => observer.disconnect();
    }, [hasStartedCountUp]);

    useEffect(() => {
        if (!hasStartedCountUp) {
            return;
        }

        const animationFrameIds: number[] = [];
        const startedAt = performance.now();

        statConfigs.forEach((stat, index) => {
            const statDelay = index * 140;
            const duration = 1150 + index * 220;

            const animate = (now: number) => {
                const elapsed = now - startedAt - statDelay;
                const progress = Math.min(Math.max(elapsed / duration, 0), 1);
                const easedProgress = 1 - Math.pow(1 - progress, 3);
                const nextValue = Math.round(stat.target * easedProgress);

                setAnimatedStats((prev) => {
                    if (prev[stat.key] === nextValue) {
                        return prev;
                    }

                    return { ...prev, [stat.key]: nextValue };
                });

                if (progress < 1) {
                    const id = window.requestAnimationFrame(animate);
                    animationFrameIds.push(id);
                }
            };

            const id = window.requestAnimationFrame(animate);
            animationFrameIds.push(id);
        });

        return () => {
            animationFrameIds.forEach((id) => window.cancelAnimationFrame(id));
        };
    }, [hasStartedCountUp]);

    const formatStatValue = (key: StatKey, value: number, suffix: string) => {
        if (key === 'doctors') {
            return `${value.toLocaleString()}${suffix}`;
        }

        return `${value}${suffix}`;
    };

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
                        <span className="text-cyan-100 drop-shadow-[0_0_14px_rgba(34,211,238,0.55)]">{displayedText}</span>
                        <span className="ml-1 inline-block h-6 w-0.5 animate-cursor bg-linear-to-b from-cyan-200 to-white align-middle" />
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
                <div ref={statsSectionRef} className="mt-16">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {statConfigs.map((stat) => (
                            <div key={stat.key} className="rounded-lg border border-white/10 bg-white/5 p-5 text-center animate-fade-in-delayed delay-300">
                                <p className="text-3xl font-bold text-cyan-400">
                                    {formatStatValue(stat.key, animatedStats[stat.key], stat.suffix)}
                                </p>
                                <p className="text-sm text-slate-300 mt-2">{stat.label}</p>
                            </div>
                        ))}
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
        </main>
    );
}

export default Page;
