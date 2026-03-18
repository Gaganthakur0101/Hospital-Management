"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DoctorCard from "@/components/doctorCard";

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
                                className="opacity-0"
                            >
                                <DoctorCard
                                    id={doctor._id}
                                    name={doctor.doctorName}
                                    specialization={doctor.specialization}
                                    experience={doctor.experience}
                                    fees={doctor.fees}
                                    email={doctor.email}
                                    phone={doctor.phone}
                                    gender={doctor.gender}
                                />
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
