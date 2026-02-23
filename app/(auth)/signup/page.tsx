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

    const onSignup = async (e: any) => {
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


        } catch (err: any) {
            toast.error("Something went wrong");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-8">

            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-7 sm:p-10 animate-slide-up">

                <div className="mb-4">
                    <p className="text-sm font-medium text-gray-500 mb-2">
                        Get started for free
                    </p>

                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                        Create your account
                    </h1>
                </div>

                <form className="space-y-5">

                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                            Full name
                        </label>
                        <input
                            id="name"
                            type="text"
                            placeholder="Enter your full name"
                            value={user.name}
                            onChange={(e) => setUser({ ...user, name: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder:text-gray-400 text-gray-900"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email address
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={user.email}
                            onChange={(e) => setUser({ ...user, email: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder:text-gray-400 text-gray-900"
                        />
                    </div>

                    {/* Role Selection Dropdown */}
                    {/* User can choose between Patient and Doctor roles during signup */}
                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                            Role
                        </label>

                        <select
                            id="role"
                            value={user.role}
                            onChange={(e) => setUser({ ...user, role: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg 
        focus:outline-none focus:ring-2 focus:ring-blue-500 
        focus:border-transparent transition-all duration-200 
        text-gray-900 bg-white"
                        >
                            <option value="patient">Patient</option>
                            <option value="doctor">Doctor</option>
                        </select>
                    {/* Password Section */}
                    {/* User creates a password for account security */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Create a password"
                            value={user.password}
                            onChange={(e) => setUser({ ...user, password: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder:text-gray-400 text-gray-900"
                        />
                    </div>

                    {/* Confirm Password Field */}
                    {/* User re-enters password to ensure it matches and prevent typos */}                       
                    </div>

                    <div>
                        <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm password
                        </label>
                        <input
                            id="confirm-password"
                            type="password"
                            placeholder="Confirm your password"
                            value={user.confirmPassword}
                            onChange={(e) => setUser({ ...user, confirmPassword: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder:text-gray-400 text-gray-900"
                        />
                    </div>

                    <button
                        onClick={onSignup}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 mt-4"
                    >
                        Create account
                    </button>

                </form>

                <p className="text-sm text-center text-gray-600 mt-8">
                    Already have an account?{" "}
                    <a href="/login" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors">
                        Sign in
                    </a>
                </p>

            </div>
        </div>
    );
};

export default Page;
