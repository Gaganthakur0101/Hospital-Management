"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Doctor = {
    _id: string;
    doctorName: string;
    gender: "Male" | "Female" | "Other";
    specialization: string;
    experience: number;
    fees: number;
    email: string;
    phone: string;
    medicalLicenseNumber: string;
};

const Page = () => {
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const id = params?.id;

    const [doctor, setDoctor] = useState<Doctor | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchDoctor = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(`/api/doctors/${id}`);

                if (!response.ok) {
                    throw new Error("Failed to fetch doctor details");
                }

                const data = await response.json();
                setDoctor(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Something went wrong");
            } finally {
                setLoading(false);
            }
        };

        fetchDoctor();
    }, [id]);

    if (loading) {
        return (
            <div className="relative min-h-screen overflow-hidden bg-slate-950 px-4 pb-16 pt-12 sm:px-6 lg:px-8">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -left-16 top-16 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
                    <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-emerald-400/15 blur-3xl" />
                </div>
                <div className="relative mx-auto max-w-6xl">
                    <div className="rounded-2xl border border-white/15 bg-white/8 p-8 text-center shadow-2xl backdrop-blur-xl">
                        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-600 border-t-cyan-400" />
                        <p className="mt-4 text-slate-300">Loading doctor details...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="relative min-h-screen overflow-hidden bg-slate-950 px-4 pb-16 pt-12 sm:px-6 lg:px-8">
                <div className="relative mx-auto max-w-6xl rounded-2xl border border-red-300/20 bg-red-500/10 p-6 text-red-100 backdrop-blur-xl">
                    {error}
                </div>
            </div>
        );
    }

    if (!doctor) {
        return (
            <div className="relative min-h-screen overflow-hidden bg-slate-950 px-4 pb-16 pt-12 sm:px-6 lg:px-8">
                <div className="relative mx-auto max-w-6xl rounded-2xl border border-white/15 bg-white/8 p-6 text-slate-200 shadow-xl backdrop-blur-xl">
                    No doctor data found.
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen overflow-hidden bg-slate-950 pb-16 pt-12">
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -left-16 top-16 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl animate-float-slow" />
                <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-emerald-400/15 blur-3xl animate-float-fast" />
                <div className="absolute bottom-0 left-1/2 h-72 w-72 rounded-full bg-blue-400/15 blur-3xl animate-float-slow" />
            </div>

            <div className="relative mx-auto max-w-6xl space-y-6 px-4 sm:px-6 lg:px-8">
                <div className="animate-rise-up rounded-2xl border border-white/15 bg-white/8 p-6 shadow-2xl backdrop-blur-xl">
                    <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-cyan-400">Doctor Profile</p>
                    <h1 className="text-3xl font-black text-white sm:text-4xl">{doctor.doctorName}</h1>
                    <div className="mt-3 flex flex-wrap gap-2">
                        <span className="inline-flex rounded-full border border-cyan-200/30 bg-cyan-300/10 px-3 py-1 text-xs font-semibold text-cyan-100">
                            {doctor.specialization}
                        </span>
                        <span className="inline-flex rounded-full border border-cyan-200/30 bg-cyan-300/10 px-3 py-1 text-xs font-semibold text-cyan-100">
                            {doctor.gender}
                        </span>
                    </div>
                </div>

                <div className="animate-fade-in-delayed rounded-2xl border border-white/15 bg-white/8 p-6 shadow-xl backdrop-blur-xl">
                    <h2 className="mb-4 text-lg font-bold text-cyan-100">Profile Snapshot</h2>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-xl border border-cyan-100/20 bg-slate-900/35 p-4">
                            <p className="text-xs uppercase tracking-wide text-slate-300">Experience</p>
                            <p className="mt-2 text-xl font-bold text-cyan-100">{doctor.experience} yrs</p>
                        </div>
                        <div className="rounded-xl border border-cyan-100/20 bg-slate-900/35 p-4">
                            <p className="text-xs uppercase tracking-wide text-slate-300">Consultation Fee</p>
                            <p className="mt-2 text-xl font-bold text-cyan-100">Rs. {doctor.fees}</p>
                        </div>
                        <div className="rounded-xl border border-cyan-100/20 bg-slate-900/35 p-4">
                            <p className="text-xs uppercase tracking-wide text-slate-300">Specialization</p>
                            <p className="mt-2 text-xl font-bold text-cyan-100">{doctor.specialization}</p>
                        </div>
                        <div className="rounded-xl border border-cyan-100/20 bg-slate-900/35 p-4">
                            <p className="text-xs uppercase tracking-wide text-slate-300">License</p>
                            <p className="mt-2 break-all text-sm font-semibold text-cyan-100">{doctor.medicalLicenseNumber}</p>
                        </div>
                    </div>
                </div>

                <div className="animate-fade-in-delayed rounded-2xl border border-white/15 bg-white/8 p-6 shadow-xl backdrop-blur-xl">
                    <h2 className="mb-4 text-lg font-bold text-cyan-100">Contact Information</h2>
                    <div className="space-y-3 text-sm text-slate-200">
                        <p><span className="font-semibold text-cyan-100">Phone Number:</span> {doctor.phone}</p>
                        <p><span className="font-semibold text-cyan-100">Email Address:</span> {doctor.email}</p>
                    </div>
                </div>

                <div className="animate-fade-in-delayed flex flex-col justify-center gap-3 pb-2 sm:flex-row">
                    <button
                        onClick={() => router.push("/doctors")}
                        className="w-full rounded-lg border border-cyan-100/40 px-6 py-3 text-sm font-semibold text-cyan-100 transition-all duration-300 hover:bg-cyan-300/10 sm:w-52"
                    >
                        Back to Doctors
                    </button>
                    <button
                        onClick={() => router.push(`/appointments?doctorId=${id}`)}
                        className="w-full rounded-lg bg-cyan-400 px-6 py-3 text-sm font-bold text-slate-950 transition-all duration-300 hover:scale-105 hover:bg-cyan-300 hover:shadow-lg sm:w-60"
                    >
                        Schedule Visit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Page;
