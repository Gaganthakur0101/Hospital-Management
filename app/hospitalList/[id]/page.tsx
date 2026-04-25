"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

interface ScheduleEntry {
    specialization: string;
    days: string[];
    startTime: string;
    endTime: string;
}

type Hospital = {
    _id: string;
    hospitalName: string;
    phoneNumber: string;
    address: string;
    city: string;
    pincode: string;
    state: string;
    registrationFees: number;
    hospitalType: "Government" | "Private" | "Clinic";
    description?: string;
    establishedYear?: number;
    emergencyAvailable: boolean;
    ambulanceAvailable: boolean;
    specialities: string[];
    doctorSchedules?: ScheduleEntry[];
    images?: string[];
    avgConsultationMinutes?: number;
};

/** Format "14:00" → "2:00 PM" */
function formatTime(t: string): string {
    if (!t) return "";
    const [h, m] = t.split(":").map(Number);
    if (isNaN(h)) return t;
    const period = h >= 12 ? "PM" : "AM";
    const hour = h % 12 || 12;
    return `${hour}:${String(m).padStart(2, "0")} ${period}`;
}

const Page = () => {
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const id = params?.id;

    const [data, setData] = useState<Hospital | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/hospitals/${id}`);
                if (!response.ok) throw new Error("Failed to fetch hospital data");
                const hospital = await response.json();
                setData(hospital);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Something went wrong");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
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
                        <p className="mt-4 text-slate-300">Loading hospital details...</p>
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

    if (!data) {
        return (
            <div className="relative min-h-screen overflow-hidden bg-slate-950 px-4 pb-16 pt-12 sm:px-6 lg:px-8">
                <div className="relative mx-auto max-w-6xl rounded-2xl border border-white/15 bg-white/8 p-6 text-slate-200 shadow-xl backdrop-blur-xl">
                    No hospital data found.
                </div>
            </div>
        );
    }

    const schedules = data.doctorSchedules?.filter((s) => s.specialization) ?? [];
    const currentDay = new Date().toLocaleString("en-US", { weekday: "short" });

    return (
        <div className="relative min-h-screen overflow-hidden bg-slate-950 pb-16 pt-12">
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -left-16 top-16 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl animate-float-slow" />
                <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-emerald-400/15 blur-3xl animate-float-fast" />
                <div className="absolute bottom-0 left-1/2 h-72 w-72 rounded-full bg-blue-400/15 blur-3xl animate-float-slow" />
            </div>

            <div className="relative mx-auto max-w-6xl space-y-6 px-4 sm:px-6 lg:px-8">

                {/* ── Title ── */}
                <div className="animate-rise-up rounded-2xl border border-white/15 bg-white/8 p-6 shadow-2xl backdrop-blur-xl">
                    <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-cyan-400">Hospital Profile</p>
                    <h1 className="text-3xl font-black text-white sm:text-4xl">{data.hospitalName}</h1>
                    <div className="mt-3 flex flex-wrap gap-2">
                        <span className="inline-flex rounded-full border border-cyan-200/30 bg-cyan-300/10 px-3 py-1 text-xs font-semibold text-cyan-100">
                            {data.hospitalType}
                        </span>
                        {data.emergencyAvailable && (
                            <span className="inline-flex rounded-full border border-red-400/30 bg-red-500/15 px-3 py-1 text-xs font-semibold text-red-200">
                                🚨 Emergency
                            </span>
                        )}
                        {data.ambulanceAvailable && (
                            <span className="inline-flex rounded-full border border-yellow-400/30 bg-yellow-500/10 px-3 py-1 text-xs font-semibold text-yellow-200">
                                🚑 Ambulance
                            </span>
                        )}
                    </div>
                </div>

                {/* ── Photos ── */}
                <div className="animate-fade-in-delayed rounded-2xl border border-white/15 bg-white/8 p-6 shadow-xl backdrop-blur-xl">
                    <h2 className="mb-4 text-lg font-bold text-cyan-100">Photos</h2>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                        {(data.images?.length
                            ? data.images
                            : ["https://images.unsplash.com/photo-1538108149393-fbbd81895907?q=80&w=1200&auto=format&fit=crop"]
                        ).map((src, index) => (
                            <div key={`${src}-${index}`} className="overflow-hidden rounded-xl border border-cyan-100/20 bg-slate-900/30">
                                <Image
                                    src={src}
                                    alt={`${data.hospitalName} ${index + 1}`}
                                    width={600}
                                    height={220}
                                    className="h-36 w-full object-cover"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Hospital Information ── */}
                <div className="animate-fade-in-delayed rounded-2xl border border-white/15 bg-white/8 p-6 shadow-xl backdrop-blur-xl">
                    <h2 className="mb-4 text-lg font-bold text-cyan-100">Hospital Information</h2>
                    <div className="space-y-3 text-sm text-slate-200">
                        <p><span className="font-semibold text-cyan-100">Phone Number:</span> {data.phoneNumber}</p>
                        <p><span className="font-semibold text-cyan-100">Address:</span> {data.address}</p>
                        <p><span className="font-semibold text-cyan-100">City:</span> {data.city}</p>
                        <p><span className="font-semibold text-cyan-100">Pincode:</span> {data.pincode}</p>
                        <p><span className="font-semibold text-cyan-100">State:</span> {data.state}</p>
                        <p><span className="font-semibold text-cyan-100">Registration Fees:</span> ₹{data.registrationFees.toLocaleString("en-IN")}</p>
                        <p><span className="font-semibold text-cyan-100">Established Year:</span> {data.establishedYear ?? "Not specified"}</p>
                        {data.avgConsultationMinutes && (
                            <p><span className="font-semibold text-cyan-100">Avg. Consultation:</span> {data.avgConsultationMinutes} minutes</p>
                        )}
                    </div>
                </div>

                {/* ── Description ── */}
                <div className="animate-fade-in-delayed rounded-2xl border border-white/15 bg-white/8 p-6 shadow-xl backdrop-blur-xl">
                    <h2 className="mb-4 text-lg font-bold text-cyan-100">Description</h2>
                    <p className="text-sm leading-7 text-slate-200">
                        {data.description?.trim() ? data.description : "No description added yet."}
                    </p>
                </div>

                {/* ── Doctor Availability Schedule ── */}
                {schedules.length > 0 ? (
                    <div className="animate-fade-in-delayed rounded-2xl border border-white/15 bg-white/8 p-6 shadow-xl backdrop-blur-xl">
                        <h2 className="mb-5 text-lg font-bold text-cyan-100">Doctor Availability</h2>
                        <div className="space-y-3">
                            {schedules.map((s, idx) => {
                                const isAvailableToday = s.days.includes(currentDay);
                                return (
                                <div
                                    key={idx}
                                    className={`flex flex-col gap-2 rounded-xl border px-5 py-4 sm:flex-row sm:items-center sm:justify-between transition ${
                                        isAvailableToday
                                            ? "border-emerald-500/40 bg-emerald-500/5 shadow-[0_0_15px_rgba(16,185,129,0.05)]"
                                            : "border-cyan-100/15 bg-slate-900/50"
                                    }`}
                                >
                                    {/* Specialization label */}
                                    <span className="inline-flex items-center gap-2 text-sm font-bold text-white">
                                        <span className={`h-2 w-2 rounded-full flex-shrink-0 ${isAvailableToday ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" : "bg-cyan-400"}`} />
                                        {s.specialization}
                                        {isAvailableToday && (
                                            <span className="ml-1 rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                                                Available Today
                                            </span>
                                        )}
                                    </span>

                                    {/* Days */}
                                    <div className="flex flex-wrap gap-1.5 sm:justify-center">
                                        {s.days.length > 0 ? (
                                            s.days.map((d) => (
                                                <span
                                                    key={d}
                                                    className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                                                        d === currentDay
                                                            ? "border-emerald-400/50 bg-emerald-400/20 text-emerald-200 shadow-sm"
                                                            : "border-cyan-300/20 bg-cyan-300/10 text-cyan-200"
                                                    }`}
                                                >
                                                    {d}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-xs text-slate-500">Days not specified</span>
                                        )}
                                    </div>

                                    {/* Time range */}
                                    <span className={`text-sm font-medium whitespace-nowrap ${isAvailableToday ? "text-emerald-200" : "text-slate-300"}`}>
                                        {s.startTime && s.endTime
                                            ? `${formatTime(s.startTime)} – ${formatTime(s.endTime)}`
                                            : "Timings not specified"}
                                    </span>
                                </div>
                                );
                            })}
                        </div>
                    </div>
                ) : data.specialities?.length > 0 ? (
                    /* ── Fallback: flat specialities ── */
                    <div className="animate-fade-in-delayed rounded-2xl border border-white/15 bg-white/8 p-6 shadow-xl backdrop-blur-xl">
                        <h2 className="mb-4 text-lg font-bold text-cyan-100">Specialities</h2>
                        <div className="flex flex-wrap gap-2">
                            {data.specialities.map((item, index) => (
                                <span
                                    key={`${item}-${index}`}
                                    className="rounded-full border border-cyan-200/25 bg-cyan-300/15 px-3 py-1 text-sm font-medium text-cyan-100"
                                >
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="animate-fade-in-delayed rounded-2xl border border-white/15 bg-white/8 p-6 shadow-xl backdrop-blur-xl">
                        <h2 className="mb-4 text-lg font-bold text-cyan-100">Specialities</h2>
                        <p className="text-sm text-slate-300">No specialities listed.</p>
                    </div>
                )}

                {/* ── Book button ── */}
                <div className="animate-fade-in-delayed flex justify-center pb-2">
                    <button
                        onClick={() => router.push(`/appointments?hospitalId=${id}`)}
                        className="w-full max-w-md rounded-lg bg-cyan-400 px-6 py-3 text-sm font-bold text-slate-950 transition-all duration-300 hover:scale-105 hover:bg-cyan-300 hover:shadow-lg md:w-80"
                    >
                        Book This Hospital
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Page;
