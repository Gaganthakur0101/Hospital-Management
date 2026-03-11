"use client"

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const Page = () => {

    const router = useRouter();

    // State management for user signup form
    // Including name, email, password fields and role selection (patient/doctor)
    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "patient", // Default role set to patient
    })

    const onSignup = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const res = await fetch("/api/users/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error);
            } else {
                toast.success(data.message);
                router.push('/login');
            }


        } catch {
            toast.error("Something went wrong");
        }
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-10">
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -left-16 top-10 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
                <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-emerald-400/15 blur-3xl" />
            </div>

            <div className="relative w-full max-w-md rounded-3xl border border-white/15 bg-white/8 p-7 shadow-2xl backdrop-blur-xl sm:p-10">

                <div className="mb-4">
                    <p className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-cyan-200">
                        Get started for free
                    </p>

                    <h1 className="text-3xl font-black tracking-tight text-white">
                        Create your account
                    </h1>
                </div>

                <form className="space-y-5" onSubmit={onSignup}>

                    <div>
                        <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-200">
                            Full name
                        </label>
                        <input
                            id="name"
                            type="text"
                            placeholder="Enter your full name"
                            value={user.name}
                            onChange={(e) => setUser({ ...user, name: e.target.value })}
                            className="w-full rounded-xl border border-cyan-100/30 bg-slate-900/70 px-4 py-3 text-slate-100 placeholder:text-slate-400 outline-none transition focus:border-cyan-300/70 focus:ring-4 focus:ring-cyan-300/15"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-200">
                            Email address
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={user.email}
                            onChange={(e) => setUser({ ...user, email: e.target.value })}
                            className="w-full rounded-xl border border-cyan-100/30 bg-slate-900/70 px-4 py-3 text-slate-100 placeholder:text-slate-400 outline-none transition focus:border-cyan-300/70 focus:ring-4 focus:ring-cyan-300/15"
                        />
                    </div>

                    {/* Role Selection Dropdown */}
                    {/* User can choose between Patient and Doctor roles during signup */}
                    <div>
                        <label htmlFor="role" className="mb-2 block text-sm font-medium text-slate-200">
                            Role
                        </label>

                        <select
                            id="role"
                            value={user.role}
                            onChange={(e) => setUser({ ...user, role: e.target.value })}
                            className="w-full rounded-xl border border-cyan-100/30 bg-slate-900/70 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-300/70 focus:ring-4 focus:ring-cyan-300/15"
                        >
                            <option value="patient">Patient</option>
                            <option value="doctor">Doctor</option>
                        </select>
                    </div>

                    {/* Password Section */}
                    {/* User creates a password for account security */}
                    <div>
                        <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-200">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Create a password"
                            value={user.password}
                            onChange={(e) => setUser({ ...user, password: e.target.value })}
                            className="w-full rounded-xl border border-cyan-100/30 bg-slate-900/70 px-4 py-3 text-slate-100 placeholder:text-slate-400 outline-none transition focus:border-cyan-300/70 focus:ring-4 focus:ring-cyan-300/15"
                        />
                    </div>

                    {/* Confirm Password Field */}
                    {/* User re-enters password to ensure it matches and prevent typos */}
                    <div>
                        <label htmlFor="confirm-password" className="mb-2 block text-sm font-medium text-slate-200">
                            Confirm password
                        </label>
                        <input
                            id="confirm-password"
                            type="password"
                            placeholder="Confirm your password"
                            value={user.confirmPassword}
                            onChange={(e) => setUser({ ...user, confirmPassword: e.target.value })}
                            className="w-full rounded-xl border border-cyan-100/30 bg-slate-900/70 px-4 py-3 text-slate-100 placeholder:text-slate-400 outline-none transition focus:border-cyan-300/70 focus:ring-4 focus:ring-cyan-300/15"
                        />
                    </div>

                    <button
                        type="submit"
                        className="mt-4 w-full rounded-xl bg-cyan-400 py-3 font-bold text-slate-950 transition-all duration-200 hover:scale-[1.01] hover:bg-cyan-300"
                    >
                        Create account
                    </button>

                </form>

                <p className="mt-8 text-center text-sm text-slate-300">
                    Already have an account?{" "}
                    <Link href="/login" className="font-semibold text-cyan-200 transition-colors hover:text-cyan-100 hover:underline">
                        Sign in
                    </Link>
                </p>

            </div>
        </div>
    );
};

export default Page;
