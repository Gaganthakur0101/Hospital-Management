"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";

interface ScheduleEntry {
    specialization: string;
    days: string[];
    startTime: string;
    endTime: string;
}

interface Hospital {
    _id: string;
    hospitalName: string;
    hospitalType: "Government" | "Private" | "Clinic";
    address: string;
    city: string;
    state: string;
    pincode: string;
    specialities: string[];
    doctorSchedules: ScheduleEntry[];
    images: string[];
    emergencyAvailable: boolean;
    ambulanceAvailable: boolean;
    registrationFees: number;
    createdAt: string;
}

const Page = () => {
    const router = useRouter();
    const [hospitals, setHospitals] = useState<Hospital[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<string | null>(null);

    useEffect(() => {
        const validateAndFetch = async () => {
            try {
                const meRes = await fetch("/api/users/me", { credentials: "include" });
                if (!meRes.ok) {
                    toast.error("Please login first");
                    router.replace("/login");
                    return;
                }
                const meData = await meRes.json();
                if (meData?.user?.role !== "doctor") {
                    toast.error("Only doctors can access this page");
                    router.replace(`/profile/${meData?.user?.id || ""}`);
                    return;
                }

                const res = await fetch("/api/hospitals/my", { credentials: "include" });
                if (!res.ok) throw new Error("Failed to fetch hospitals");
                const data = await res.json();
                setHospitals(data);
            } catch (err) {
                toast.error(err instanceof Error ? err.message : "Something went wrong");
            } finally {
                setLoading(false);
            }
        };
        validateAndFetch();
    }, [router]);

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete "${name}"? This cannot be undone.`)) return;
        setDeleting(id);
        try {
            const res = await fetch(`/api/hospitals/${id}`, {
                method: "DELETE",
                credentials: "include",
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data?.error || "Delete failed");
            }
            setHospitals((prev) => prev.filter((h) => h._id !== id));
            toast.success(`"${name}" deleted successfully`);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Delete failed");
        } finally {
            setDeleting(null);
        }
    };

    const typeColors: Record<string, string> = {
        Government: "bg-blue-500/15 border-blue-400/30 text-blue-200",
        Private: "bg-emerald-500/15 border-emerald-400/30 text-emerald-200",
        Clinic: "bg-purple-500/15 border-purple-400/30 text-purple-200",
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-slate-950 px-4 pb-16 pt-12">
            {/* Background blobs */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -left-16 top-16 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
                <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-emerald-400/15 blur-3xl" />
                <div className="absolute bottom-0 left-1/2 h-72 w-72 rounded-full bg-blue-400/15 blur-3xl" />
            </div>

            <div className="relative mx-auto max-w-5xl space-y-6">
                {/* Header */}
                <div className="rounded-2xl border border-white/15 bg-white/8 p-6 shadow-2xl backdrop-blur-xl">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400">
                                Doctor Portal
                            </p>
                            <h1 className="mt-2 text-3xl font-black text-white sm:text-4xl">
                                My Hospitals
                            </h1>
                            <p className="mt-2 text-sm text-slate-300">
                                {hospitals.length} hospital{hospitals.length !== 1 ? "s" : ""} registered under your account
                            </p>
                        </div>
                        <Link
                            href="/register/registerHospital"
                            className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:scale-[1.02] hover:bg-cyan-300 whitespace-nowrap"
                        >
                            <span className="text-lg leading-none">+</span> Register New Hospital
                        </Link>
                    </div>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur-sm">
                        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-600 border-t-cyan-400" />
                        <p className="mt-4 text-slate-300">Loading your hospitals...</p>
                    </div>
                ) : hospitals.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-white/20 bg-white/5 p-14 text-center backdrop-blur-sm">
                        <div className="text-5xl mb-4">🏥</div>
                        <p className="text-xl font-semibold text-slate-200">No hospitals yet</p>
                        <p className="mt-2 text-sm text-slate-400">Register your first hospital to get started.</p>
                        <Link
                            href="/register/registerHospital"
                            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
                        >
                            Register Hospital
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {hospitals.map((h) => (
                            <div
                                key={h._id}
                                className="group rounded-2xl border border-white/12 bg-white/8 p-5 shadow-lg backdrop-blur-xl transition hover:border-cyan-400/25 hover:bg-white/10"
                            >
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                                    {/* Thumbnail */}
                                    <div className="flex-shrink-0 overflow-hidden rounded-xl border border-white/10 bg-slate-900/60 w-full sm:w-32 h-24">
                                        {h.images?.[0] ? (
                                            <Image
                                                src={h.images[0]}
                                                alt={h.hospitalName}
                                                width={128}
                                                height={96}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-3xl text-slate-600">
                                                🏥
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-start gap-2">
                                            <h2 className="text-lg font-bold text-white leading-tight">
                                                {h.hospitalName}
                                            </h2>
                                            <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${typeColors[h.hospitalType] || ""}`}>
                                                {h.hospitalType}
                                            </span>
                                            {h.emergencyAvailable && (
                                                <span className="rounded-full border border-red-400/30 bg-red-500/15 px-2.5 py-0.5 text-xs font-semibold text-red-200">
                                                    🚨 Emergency
                                                </span>
                                            )}
                                        </div>

                                        <p className="mt-1 text-sm text-slate-400">
                                            {h.address}, {h.city}, {h.state} — {h.pincode}
                                        </p>

                                        {/* Specializations summary */}
                                        {h.doctorSchedules?.length > 0 ? (
                                            <div className="mt-2 flex flex-wrap gap-1.5">
                                                {h.doctorSchedules.slice(0, 4).map((s, i) => (
                                                    <span
                                                        key={i}
                                                        className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-2.5 py-0.5 text-xs font-medium text-cyan-200"
                                                    >
                                                        {s.specialization}
                                                    </span>
                                                ))}
                                                {h.doctorSchedules.length > 4 && (
                                                    <span className="rounded-full border border-slate-600 px-2.5 py-0.5 text-xs text-slate-400">
                                                        +{h.doctorSchedules.length - 4} more
                                                    </span>
                                                )}
                                            </div>
                                        ) : h.specialities?.length > 0 ? (
                                            <div className="mt-2 flex flex-wrap gap-1.5">
                                                {h.specialities.slice(0, 4).map((s, i) => (
                                                    <span
                                                        key={i}
                                                        className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-2.5 py-0.5 text-xs font-medium text-cyan-200"
                                                    >
                                                        {s}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : null}

                                        <p className="mt-2 text-xs text-slate-500">
                                            Registration fee: ₹{h.registrationFees.toLocaleString("en-IN")}
                                        </p>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-row sm:flex-col gap-2 sm:gap-2 flex-shrink-0">
                                        <button
                                            onClick={() =>
                                                router.push(`/doctors/manage-hospitals/edit/${h._id}`)
                                            }
                                            className="flex items-center gap-1.5 rounded-lg bg-cyan-400/15 border border-cyan-400/30 px-4 py-2 text-xs font-semibold text-cyan-300 transition hover:bg-cyan-400/25 hover:border-cyan-400/50"
                                        >
                                            ✏️ Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(h._id, h.hospitalName)}
                                            disabled={deleting === h._id}
                                            className="flex items-center gap-1.5 rounded-lg bg-red-500/10 border border-red-400/20 px-4 py-2 text-xs font-semibold text-red-300 transition hover:bg-red-500/20 hover:border-red-400/40 disabled:opacity-50"
                                        >
                                            {deleting === h._id ? "Deleting..." : "🗑️ Delete"}
                                        </button>
                                        <Link
                                            href={`/hospitalList/${h._id}`}
                                            className="flex items-center gap-1.5 rounded-lg bg-slate-700/40 border border-slate-600/40 px-4 py-2 text-xs font-semibold text-slate-300 transition hover:bg-slate-700/60"
                                        >
                                            👁️ View
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Page;
