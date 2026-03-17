"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

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
    __v?: number;
};

const Page = () => {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await fetch("/api/doctors/all");

                if (!response.ok) {
                    throw new Error("Failed to fetch doctor data");
                }

                const data = await response.json();
                setDoctors(Array.isArray(data) ? data : []);
            } catch (error: unknown) {
                const message = error instanceof Error ? error.message : "Error fetching doctor data";
                toast.error(message);
            } finally {
                setLoading(false);
            }
        };

        fetchDoctors();
    }, []);

    return (
        <div className="relative min-h-screen overflow-hidden bg-slate-950 pb-16 pt-12">
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -left-16 top-16 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl animate-float-slow" />
                <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-emerald-400/15 blur-3xl animate-float-fast" />
                <div className="absolute bottom-0 left-1/2 h-72 w-72 rounded-full bg-blue-400/15 blur-3xl animate-float-slow" />
            </div>

            <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <div className="animate-rise-up mb-10 rounded-2xl border border-white/15 bg-white/8 p-5 shadow-2xl backdrop-blur-xl sm:p-6">
                    <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-cyan-400">Medical Team</p>
                    <h1 className="text-3xl font-black text-white sm:text-4xl">Find Your Best Doctors</h1>
                    <p className="mt-3 text-slate-300">{doctors.length} doctors available in your network</p>
                </div>

                {loading ? (
                    <div className="animate-fade-in-delayed rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-sm">
                        <div className="inline-block">
                            <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-600 border-t-cyan-400"></div>
                        </div>
                        <p className="mt-4 text-slate-300">Loading doctors...</p>
                    </div>
                ) : doctors.length > 0 ? (
                    <div className="space-y-6">
                        {doctors.map((doctor, index) => (
                            <div
                                key={doctor._id}
                                style={{
                                    opacity: 0,
                                    animation: `fadeInCard 1s ease-out ${0.2 + index * 0.12}s forwards`,
                                }}
                                className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/15 bg-white/8 shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl md:flex-row"
                            >
                                <div className="relative flex h-44 w-full flex-col justify-center gap-2 border-b border-white/10 bg-slate-900/35 p-4 md:h-auto md:w-52 md:border-b-0 md:border-r">
                                    <p className="text-sm font-semibold text-cyan-100">Photos</p>
                                    <p className="text-xs text-slate-300">Reserved for future upload</p>
                                    <div className="grid grid-cols-2 gap-2">
                                        {[1, 2, 3, 4].map((slot) => (
                                            <div
                                                key={slot}
                                                className="flex h-14 items-center justify-center rounded-md border border-dashed border-cyan-100/30 bg-slate-900/35 text-[10px] font-medium text-cyan-100/80"
                                            >
                                                Slot {slot}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex flex-1 flex-col justify-between bg-slate-900/30 p-5">
                                    <div>
                                        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                                            <h2 className="text-2xl font-bold text-cyan-100 transition-colors duration-300 group-hover:text-cyan-200">
                                                {doctor.doctorName}
                                            </h2>
                                        </div>

                                        <div className="mb-4 flex flex-wrap gap-2">
                                            <span className="rounded-full bg-cyan-300/15 px-3 py-1 text-xs font-medium text-cyan-100 transition hover:bg-cyan-300/25">
                                                {doctor.specialization}
                                            </span>
                                        </div>

                                        <div className="grid gap-3 text-sm text-slate-200 sm:grid-cols-2">
                                            <p><span className="font-semibold text-cyan-100">Experience:</span> {doctor.experience} years</p>
                                            <p><span className="font-semibold text-cyan-100">Consultation Fees:</span> Rs. {doctor.fees}</p>
                                            <p><span className="font-semibold text-cyan-100">Phone:</span> {doctor.phone}</p>
                                            <p><span className="font-semibold text-cyan-100">Email:</span> {doctor.email}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="animate-fade-in-delayed rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-sm">
                        <p className="text-xl text-slate-300">No doctors found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Page;
