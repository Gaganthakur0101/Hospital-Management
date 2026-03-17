'use client';

import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'doctor' | 'patient';
}

const rotatingLines = [
  'Welcome to MediCare',
  'Appoint your doctor in seconds',
  'Book future consultations with confidence',
  'Video calling system is coming soon',
];

const Page = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [lineIndex, setLineIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const currentLine = useMemo(() => rotatingLines[lineIndex], [lineIndex]);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await fetch('/api/users/me', {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          setUser(null);
          return;
        }

        const data = await response.json();
        setUser(data.user ?? null);
      } catch (error) {
        console.error('Error fetching user:', error);
        setUser(null);
      } finally {
        setIsLoadingUser(false);
      }
    };

    checkUser();
  }, []);

  useEffect(() => {
    const speed = isDeleting ? 36 : 65;

    const timer = window.setTimeout(() => {
      if (!isDeleting && displayedText.length < currentLine.length) {
        setDisplayedText(currentLine.slice(0, displayedText.length + 1));
        return;
      }

      if (!isDeleting && displayedText.length === currentLine.length) {
        window.setTimeout(() => setIsDeleting(true), 1100);
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
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-12 h-72 w-72 rounded-full bg-cyan-500/25 blur-3xl animate-float-slow" />
        <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-emerald-400/20 blur-3xl animate-float-fast" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-sky-400/20 blur-3xl animate-float-slow" />
      </div>

      <section className="relative mx-auto grid w-full max-w-6xl items-center gap-10 rounded-3xl border border-white/10 bg-white/6 p-7 shadow-2xl backdrop-blur-xl md:grid-cols-2 md:p-12">
        <div className="animate-rise-up">
          <p className="mb-4 inline-flex rounded-full border border-cyan-300/40 bg-cyan-200/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
            Future-ready digital care
          </p>

          <h1 className="text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl" style={{ fontFamily: '"Segoe UI", "Trebuchet MS", sans-serif' }}>
            Care today.
            <br />
            Health tomorrow.
          </h1>

          <div className="mt-6 min-h-18 text-xl font-semibold text-cyan-100 sm:text-2xl" style={{ fontFamily: '"Lucida Sans", "Gill Sans", sans-serif' }}>
            <span>{displayedText}</span>
            <span className="ml-1 inline-block h-6 w-0.5 animate-cursor bg-cyan-200 align-middle" />
          </div>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-200 sm:text-lg">
            Discover trusted hospitals, choose specialist doctors, and manage appointments from one beautiful experience.
            Soon, you will also be able to connect through secure video consultations.
          </p>

          {!isLoadingUser && !user && (
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/login"
                className="group inline-flex items-center justify-center rounded-xl bg-cyan-400 px-9 py-4 text-lg font-bold text-slate-950 transition duration-300 hover:scale-[1.03] hover:bg-cyan-300"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="group inline-flex items-center justify-center rounded-xl border border-cyan-200/60 bg-transparent px-9 py-4 text-lg font-bold text-cyan-100 transition duration-300 hover:scale-[1.03] hover:bg-cyan-300/10"
              >
                Sign Up
              </Link>
            </div>
          )}

          {!isLoadingUser && user && (
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href={`/profile/${user.id}`}
                className="inline-flex items-center justify-center rounded-xl bg-emerald-400 px-8 py-3 text-base font-bold text-slate-950 transition duration-300 hover:scale-[1.03] hover:bg-emerald-300"
              >
                Go to my profile
              </Link>
              <Link
                href="/hospitalList"
                className="inline-flex items-center justify-center rounded-xl border border-white/30 px-8 py-3 text-base font-bold text-white transition duration-300 hover:scale-[1.03] hover:bg-white/10"
              >
                Explore hospitals
              </Link>
            </div>
          )}
        </div>

        <div className="relative animate-fade-in-delayed">
          <div className="rounded-2xl border border-white/15 bg-linear-to-br from-cyan-300/20 via-sky-300/10 to-emerald-300/20 p-6 shadow-xl">
            <h2 className="text-2xl font-extrabold text-white">What you get in MediCare</h2>
            <ul className="mt-6 space-y-4 text-slate-100">
              <li className="rounded-lg bg-white/10 p-3">Find nearby hospitals with complete details</li>
              <li className="rounded-lg bg-white/10 p-3">Simple appointment flow for patients and doctors</li>
              <li className="rounded-lg bg-white/10 p-3">Secure account system with role-based access</li>
              <li className="rounded-lg bg-white/10 p-3">Upcoming: smooth video calling appointments</li>
            </ul>
          </div>
        </div>
      </section>

    </main>
  );
}

export default Page;