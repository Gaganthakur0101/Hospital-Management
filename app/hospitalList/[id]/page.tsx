"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Hospital = {
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
};

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

                if (!response.ok) {
                    throw new Error("Failed to fetch hospital data");
                }

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

    return (
        <div className="relative min-h-screen overflow-hidden bg-slate-950 pb-16 pt-12">
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -left-16 top-16 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl animate-float-slow" />
                <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-emerald-400/15 blur-3xl animate-float-fast" />
                <div className="absolute bottom-0 left-1/2 h-72 w-72 rounded-full bg-blue-400/15 blur-3xl animate-float-slow" />
            </div>

            <div className="relative mx-auto max-w-6xl space-y-6 px-4 sm:px-6 lg:px-8">
                <div className="animate-rise-up rounded-2xl border border-white/15 bg-white/8 p-6 shadow-2xl backdrop-blur-xl">
                    <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-cyan-400">Hospital Profile</p>
                    <h1 className="text-3xl font-black text-white sm:text-4xl">{data.hospitalName}</h1>
                    <p className="mt-3 inline-flex rounded-full border border-cyan-200/30 bg-cyan-300/10 px-3 py-1 text-xs font-semibold text-cyan-100">
                        {data.hospitalType}
                    </p>
                </div>

                <div className="animate-fade-in-delayed rounded-2xl border border-white/15 bg-white/8 p-6 shadow-xl backdrop-blur-xl">
                    <h2 className="mb-4 text-lg font-bold text-cyan-100">Photos</h2>
                    <p className="mb-4 text-sm text-slate-300">Photo gallery section is reserved for future uploads.</p>
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                        {[1, 2, 3, 4].map((slot) => (
                            <div
                                key={slot}
                                className="flex h-28 items-center justify-center rounded-lg border border-dashed border-cyan-100/30 bg-slate-900/35 text-xs font-medium text-cyan-100/80"
                            >
                                Photo Slot {slot}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="animate-fade-in-delayed rounded-2xl border border-white/15 bg-white/8 p-6 shadow-xl backdrop-blur-xl">
                    <h2 className="mb-4 text-lg font-bold text-cyan-100">Hospital Information</h2>
                    <div className="space-y-3 text-sm text-slate-200">
                        <p><span className="font-semibold text-cyan-100">Phone Number:</span> {data.phoneNumber}</p>
                        <p><span className="font-semibold text-cyan-100">Address:</span> {data.address}</p>
                        <p><span className="font-semibold text-cyan-100">City:</span> {data.city}</p>
                        <p><span className="font-semibold text-cyan-100">Pincode:</span> {data.pincode}</p>
                        <p><span className="font-semibold text-cyan-100">State:</span> {data.state}</p>
                        <p><span className="font-semibold text-cyan-100">Registration Fees:</span> Rs. {data.registrationFees}</p>
                        <p><span className="font-semibold text-cyan-100">Established Year:</span> {data.establishedYear ?? "Not specified"}</p>
                        <p><span className="font-semibold text-cyan-100">Emergency Available:</span> {data.emergencyAvailable ? "Yes" : "No"}</p>
                        <p><span className="font-semibold text-cyan-100">Ambulance Available:</span> {data.ambulanceAvailable ? "Yes" : "No"}</p>
                    </div>
                </div>

                <div className="animate-fade-in-delayed rounded-2xl border border-white/15 bg-white/8 p-6 shadow-xl backdrop-blur-xl">
                    <h2 className="mb-4 text-lg font-bold text-cyan-100">Description</h2>
                    <p className="text-sm leading-7 text-slate-200">
                        {data.description?.trim() ? data.description : "No description added yet."}
                    </p>
                </div>

                <div className="animate-fade-in-delayed rounded-2xl border border-white/15 bg-white/8 p-6 shadow-xl backdrop-blur-xl">
                    <h2 className="mb-4 text-lg font-bold text-cyan-100">Specialities</h2>
                    {data.specialities?.length ? (
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
                    ) : (
                        <p className="text-sm text-slate-300">No specialities listed.</p>
                    )}
                </div>

                <div className="animate-fade-in-delayed flex justify-center pb-2">
                    <button
                        onClick={() => router.push(`/appointments?hospitalId=${id}`)}
                        className="w-full max-w-md rounded-lg bg-cyan-400 px-6 py-3 text-sm font-bold text-slate-950 transition-all duration-300 hover:scale-105 hover:bg-cyan-300 hover:shadow-lg md:w-80"
                    >
                        Book Appointment
                    </button>
                </div>
            </div>

        </div>
    );
};

export default Page;
