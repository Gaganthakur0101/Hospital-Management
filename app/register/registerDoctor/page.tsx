"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface doctorData {
    doctorName: string;
    gender: string;
    specialization: string;
    experience: number;
    fees: number;
    email: string;
    phone: string;
    medicalLicenseNumber: string;
}

const Page = () => {
    const router = useRouter();

    const [doctor, setDoctor] = useState<doctorData>({
        doctorName: "",
        gender: "",
        specialization: "",
        experience: 0,
        fees: 0,
        email: "",
        phone: "",
        medicalLicenseNumber: "",
    });

    const getFriendlyError = (error: unknown): string => {
        if (typeof error === "string" && error.trim().startsWith("[")) {
            try {
                const parsed = JSON.parse(error);
                return getFriendlyError(parsed);
            } catch {
                return error;
            }
        }

        if (Array.isArray(error) && error.length > 0) {
            const messages = (error as Array<{ path?: unknown; message?: string }>).map((issue) => {
                const field = Array.isArray(issue?.path) ? issue.path[0] : undefined;

                if (field === "doctorName") return "Doctor name is invalid";
                if (field === "gender") return "Gender is invalid";
                if (field === "specialization") return "Specialization is invalid";
                if (field === "experience") return "Experience is invalid";
                if (field === "fees") return "Consultation fees is invalid";
                if (field === "email") return "Email is invalid";
                if (field === "phone") return "Phone number is invalid";
                if (field === "medicalLicenseNumber") return "Medical license number is invalid";

                return issue?.message || "Invalid input";
            });

            return messages.join(" | ");
        }

        if (typeof error === "string") return error;
        return "Registration failed";
    };

    const onRegister = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (
            !doctor.doctorName ||
            !doctor.gender ||
            !doctor.specialization ||
            !doctor.email ||
            !doctor.phone ||
            !doctor.medicalLicenseNumber
        ) {
            toast.error("Please fill in all required fields");
            return;
        }

        try {
            const res = await fetch("/api/doctors/registerDoctor", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(doctor),
            });

            const data = await res.json();

            if (!res.ok) {
                const rawError = data?.error ?? data?.message ?? data;
                toast.error(getFriendlyError(rawError));
                return;
            }

            toast.success(data.message || "Doctor registered successfully");
            router.push("/doctors");
        } catch {
            toast.error("Something went wrong");
        }
    };

    const inputClass =
        "w-full rounded-xl border border-cyan-100/30 bg-slate-900/70 px-4 py-3 text-slate-100 placeholder:text-slate-400 shadow-sm outline-none transition focus:border-cyan-300/70 focus:ring-4 focus:ring-cyan-300/15";

    return (
        <div className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-10">
            <div className="pointer-events-none absolute -top-20 -right-24 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-16 h-80 w-80 rounded-full bg-emerald-400/15 blur-3xl" />

            <div className="mx-auto w-full max-w-3xl">
                <div className="mb-8 rounded-3xl border border-white/15 bg-white/8 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
                                Doctor onboarding
                            </p>
                            <h1 className="mt-2 text-3xl font-black text-white sm:text-4xl">
                                Register as a doctor
                            </h1>
                            <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-200">
                                Share your profile details so patients can discover and connect with your practice.
                            </p>
                        </div>
                        <div className="rounded-2xl border border-cyan-100/30 bg-cyan-300/10 px-4 py-3 text-sm text-slate-200">
                            <p className="font-medium text-cyan-100">Need help?</p>
                            <p>Our support team is here for you.</p>
                        </div>
                    </div>
                </div>

                <div className="rounded-3xl border border-white/15 bg-white/8 p-6 shadow-2xl backdrop-blur-xl sm:p-10">
                    <form className="space-y-7">
                        <section className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-white">Doctor information</h2>
                                <span className="rounded-full bg-cyan-300/15 px-3 py-1 text-xs font-medium text-cyan-100">
                                    Required
                                </span>
                            </div>

                            <div>
                                <label htmlFor="doctorName" className="block text-sm font-medium text-slate-200">
                                    Doctor name *
                                </label>
                                <input
                                    id="doctorName"
                                    type="text"
                                    placeholder="e.g. Dr. Neha Sharma"
                                    value={doctor.doctorName}
                                    onChange={(e) => setDoctor({ ...doctor, doctorName: e.target.value })}
                                    className={inputClass}
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="gender" className="block text-sm font-medium text-slate-200">
                                        Gender *
                                    </label>
                                    <select
                                        id="gender"
                                        value={doctor.gender}
                                        onChange={(e) => setDoctor({ ...doctor, gender: e.target.value })}
                                        className={inputClass}
                                    >
                                        <option value="">Select gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="specialization" className="block text-sm font-medium text-slate-200">
                                        Specialization *
                                    </label>
                                    <input
                                        id="specialization"
                                        type="text"
                                        placeholder="e.g. Cardiology"
                                        value={doctor.specialization}
                                        onChange={(e) => setDoctor({ ...doctor, specialization: e.target.value })}
                                        className={inputClass}
                                    />
                                </div>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-lg font-semibold text-white">Professional details</h2>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="experience" className="block text-sm font-medium text-slate-200">
                                        Experience (years) *
                                    </label>
                                    <input
                                        id="experience"
                                        type="number"
                                        min={0}
                                        placeholder="0"
                                        value={doctor.experience}
                                        onChange={(e) =>
                                            setDoctor({
                                                ...doctor,
                                                experience: Number(e.target.value) || 0,
                                            })
                                        }
                                        className={inputClass}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="fees" className="block text-sm font-medium text-slate-200">
                                        Consultation fees *
                                    </label>
                                    <input
                                        id="fees"
                                        type="number"
                                        min={0}
                                        placeholder="0"
                                        value={doctor.fees}
                                        onChange={(e) =>
                                            setDoctor({
                                                ...doctor,
                                                fees: Number(e.target.value) || 0,
                                            })
                                        }
                                        className={inputClass}
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="medicalLicenseNumber" className="block text-sm font-medium text-slate-200">
                                    Medical license number *
                                </label>
                                <input
                                    id="medicalLicenseNumber"
                                    type="text"
                                    placeholder="Enter your registration/license number"
                                    value={doctor.medicalLicenseNumber}
                                    onChange={(e) => setDoctor({ ...doctor, medicalLicenseNumber: e.target.value })}
                                    className={inputClass}
                                />
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-lg font-semibold text-white">Contact details</h2>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-slate-200">
                                        Email *
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="doctor@example.com"
                                        value={doctor.email}
                                        onChange={(e) => setDoctor({ ...doctor, email: e.target.value })}
                                        className={inputClass}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-slate-200">
                                        Phone number *
                                    </label>
                                    <input
                                        id="phone"
                                        type="tel"
                                        placeholder="10-digit phone number"
                                        value={doctor.phone}
                                        onChange={(e) => setDoctor({ ...doctor, phone: e.target.value })}
                                        className={inputClass}
                                    />
                                </div>
                            </div>
                        </section>

                        <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
                            <button
                                onClick={onRegister}
                                className="inline-flex items-center justify-center rounded-xl bg-cyan-400 px-6 py-3 text-sm font-bold text-slate-950 transition duration-200 hover:scale-[1.01] hover:bg-cyan-300"
                            >
                                Register doctor
                            </button>

                            <p className="text-sm text-slate-300">
                                Already registered?{" "}
                                <Link href="/login" className="font-semibold text-cyan-200 hover:text-cyan-100">
                                    Sign in here
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Page;
