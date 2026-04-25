"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type ScheduleEntry = {
    specialization: string;
    days: string[];
    startTime: string;
    endTime: string;
};

type Hospital = {
    _id: string;
    hospitalName: string;
    city: string;
    state: string;
    doctorSchedules: ScheduleEntry[];
};

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
    hospitals?: Hospital[];
};

const formatTime = (time24: string) => {
    if (!time24) return "";
    const [h, m] = time24.split(":");
    const hours = parseInt(h, 10);
    const ampm = hours >= 12 ? "PM" : "AM";
    const hr12 = hours % 12 || 12;
    return `${hr12}:${m} ${ampm}`;
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

                {doctor.hospitals && doctor.hospitals.length > 0 && (
                    <div className="animate-fade-in-delayed rounded-2xl border border-white/15 bg-white/8 p-6 shadow-xl backdrop-blur-xl">
                        <h2 className="mb-5 text-lg font-bold text-cyan-100">Hospital Affiliations & Timings</h2>
                        <div className="space-y-4">
                            {doctor.hospitals.map((hospital) => {
                                const schedules = hospital.doctorSchedules?.filter((s) => s.specialization === doctor.specialization) ?? [];
                                const currentDay = new Date().toLocaleString("en-US", { weekday: "short" });

                                // if there are no schedules matching the doctor's specialization, we just show all schedules
                                const displaySchedules = schedules.length > 0 ? schedules : (hospital.doctorSchedules ?? []);

                                return (
                                    <div key={hospital._id} className="rounded-xl border border-cyan-100/15 bg-slate-900/40 p-4">
                                        <h3 className="text-md font-bold text-white mb-1">{hospital.hospitalName}</h3>
                                        <p className="text-xs text-slate-400 mb-3">{hospital.city}, {hospital.state}</p>
                                        
                                        <div className="space-y-2">
                                            {displaySchedules.map((s, idx) => {
                                                const isAvailableToday = s.days.includes(currentDay);
                                                return (
                                                    <div
                                                        key={idx}
                                                        className={`flex flex-col gap-2 rounded-lg border px-4 py-3 sm:flex-row sm:items-center sm:justify-between transition ${
                                                            isAvailableToday
                                                                ? "border-emerald-500/40 bg-emerald-500/5 shadow-[0_0_15px_rgba(16,185,129,0.05)]"
                                                                : "border-cyan-100/10 bg-slate-900/60"
                                                        }`}
                                                    >
                                                        <span className="inline-flex items-center gap-2 text-sm font-bold text-white">
                                                            <span className={`h-2 w-2 rounded-full flex-shrink-0 ${isAvailableToday ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" : "bg-cyan-400"}`} />
                                                            {s.specialization}
                                                            {isAvailableToday && (
                                                                <span className="ml-1 rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                                                                    Available Today
                                                                </span>
                                                            )}
                                                        </span>

                                                        <div className="flex flex-wrap gap-1.5 sm:justify-center">
                                                            {s.days.length > 0 ? (
                                                                s.days.map((d) => (
                                                                    <span
                                                                        key={d}
                                                                        className={`rounded-full border px-2.5 py-0.5 text-[10px] font-medium ${
                                                                            d === currentDay
                                                                                ? "border-emerald-400/50 bg-emerald-400/20 text-emerald-200 shadow-sm"
                                                                                : "border-cyan-300/20 bg-cyan-300/10 text-cyan-200"
                                                                        }`}
                                                                    >
                                                                        {d}
                                                                    </span>
                                                                ))
                                                            ) : (
                                                                <span className="text-[10px] text-slate-500">Days not specified</span>
                                                            )}
                                                        </div>

                                                        <span className={`text-xs font-medium whitespace-nowrap ${isAvailableToday ? "text-emerald-200" : "text-slate-300"}`}>
                                                            {s.startTime && s.endTime
                                                                ? `${formatTime(s.startTime)} – ${formatTime(s.endTime)}`
                                                                : "Timings not specified"}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                            {displaySchedules.length === 0 && (
                                                <p className="text-xs text-slate-500 italic">No schedules listed for this hospital.</p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

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
                        Book This Doctor
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Page;
