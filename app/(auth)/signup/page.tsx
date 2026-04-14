"use client"

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import AuthCard from "@/components/signup/authCard";
import FormInput from "@/components/signup/formInput";
import FormSelect from "@/components/signup/formSelect";

const Page = () => {

    const router = useRouter();

    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "patient",
        city: "",
        state: "",
    })

    const onSignup = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const cleaned = {
            name: user.name.trim(),
            email: user.email.trim(),
            role: user.role.trim(),
            city: user.city.trim(),
            state: user.state.trim(),
            password: user.password,
            confirmPassword: user.confirmPassword,
        };

        if (!cleaned.name || !cleaned.email || !cleaned.role || !cleaned.city || !cleaned.state || !cleaned.password || !cleaned.confirmPassword) {
            toast.error("All fields are required");
            return;
        }

        // Create payload in the correct order
        const payload = cleaned;

        try {
            const res = await fetch("/api/users/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
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
        <AuthCard
            title="Create your account"
            subtitle="Get started for free"
        >
            <form className="space-y-5" onSubmit={onSignup}>

                <FormInput
                    id="name"
                    label="Full name"
                    type="text"
                    placeholder="Enter your full name"
                    value={user.name}
                    onChange={(value) => setUser({ ...user, name: value })}
                />

                <FormInput
                    id="email"
                    label="Email address"
                    type="email"
                    placeholder="Enter your email"
                    value={user.email}
                    onChange={(value) => setUser({ ...user, email: value })}
                />

                <FormSelect
                    id="role"
                    label="Role"
                    value={user.role}
                    onChange={(value) => setUser({ ...user, role: value })}
                    options={[
                        { value: "patient", label: "Patient" },
                        { value: "doctor", label: "Doctor" },
                    ]}
                />

                <FormInput
                    id="city"
                    label="City"
                    type="text"
                    placeholder="Enter your city"
                    value={user.city}
                    onChange={(value) => setUser({ ...user, city: value })}
                />

                <FormInput
                    id="state"
                    label="State"
                    type="text"
                    placeholder="Enter your state"
                    value={user.state}
                    onChange={(value) => setUser({ ...user, state: value })}
                />

                <FormInput
                    id="password"
                    label="Password"
                    type="password"
                    placeholder="Create a password"
                    value={user.password}
                    onChange={(value) => setUser({ ...user, password: value })}
                />

                <FormInput
                    id="confirm-password"
                    label="Confirm password"
                    type="password"
                    placeholder="Confirm your password"
                    value={user.confirmPassword}
                    onChange={(value) => setUser({ ...user, confirmPassword: value })}
                />

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

        </AuthCard>
    );
};

export default Page;

