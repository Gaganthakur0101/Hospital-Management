"use client";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import HospitalCard from "@/components/hospitalCard";

interface Hospital {
    _id: string;
    hospitalName: string;
    phoneNumber: string;
    address: string;
    city: string;
    pincode: string;
    state: string;
    registrationFees: number;
    hospitalType: string;
    description?: string;
    establishedYear?: number;
    emergencyAvailable?: boolean;
    ambulanceAvailable?: boolean;
    specialities: string[];
    images?: string[];
}

interface User {
    _id: string;
    name: string;
    email: string;
    city: string;
    state: string;
    role: string;
}

const Page = () => {
    const [nearbyHospitals, setNearbyHospitals] = useState<Hospital[]>([]);
    const [loading, setLoading] = useState(true);
    const [userCity, setUserCity] = useState("");

    const fetchNearbyHospitals = async () => {
        try {
            setLoading(true);

            const userResponse = await fetch("/api/users/me");
            const userData = await userResponse.json();

            if (!userResponse.ok) {
                toast.error("Failed to fetch user location");
                setLoading(false);
                return;
            }

            const user: User = userData.user;
            setUserCity(user.city);

            const hospitalsResponse = await fetch("/api/hospitals/all");
            const hospitalsData = await hospitalsResponse.json();

            if (!hospitalsResponse.ok) {
                toast.error("Failed to fetch hospitals");
                setLoading(false);
                return;
            }

            const filteredHospitals = hospitalsData.filter(
                (hospital: Hospital) => hospital.city.toLowerCase() === user.city.toLowerCase()
            );

            setNearbyHospitals(filteredHospitals);
            setLoading(false);

            if (filteredHospitals.length === 0) {
                toast(`No hospitals found in ${user.city}`, { icon: '🏥' });
            }

        } catch {
            toast.error("Something went wrong");
            setLoading(false);
        }
    };

    useEffect(() => {
        const run = async () => {
            await fetchNearbyHospitals();
        };
        run();
    }, []);

    return (
        <div className="relative min-h-screen overflow-hidden bg-slate-950 pb-16 pt-12">
            {/* Animated background blobs */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -left-16 top-16 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl animate-float-slow" />
                <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-emerald-400/15 blur-3xl animate-float-fast" />
                <div className="absolute bottom-0 left-1/2 h-72 w-72 rounded-full bg-blue-400/15 blur-3xl animate-float-slow" />
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">

                {/* Header Section */}
                <div className="animate-rise-up mb-10 rounded-2xl border border-white/15 bg-white/8 p-5 shadow-2xl backdrop-blur-xl sm:p-6">
                    <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-cyan-400">
                        📍 Location-Based Healthcare
                    </p>
                    <h1 className="text-3xl font-black text-white sm:text-4xl">
                        Hospitals Near You
                    </h1>
                    <p className="mt-3 text-slate-300">
                        {loading ? (
                            "Finding hospitals in your area..."
                        ) : nearbyHospitals.length > 0 ? (
                            <>
                                Showing <span className="font-semibold text-cyan-400">{nearbyHospitals.length}</span> hospital{nearbyHospitals.length !== 1 ? 's' : ''} in{" "}
                                <span className="font-semibold text-cyan-400">{userCity}</span>
                            </>
                        ) : (
                            `No hospitals found in ${userCity}`
                        )}
                    </p>
                </div>

                {/* Hospital List */}
                <div className="space-y-6">

                    {loading ? (
                        <div className="animate-fade-in-delayed rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-sm">
                            <div className="inline-block">
                                <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-600 border-t-cyan-400"></div>
                            </div>
                            <p className="mt-4 text-slate-300">Finding hospitals near you...</p>
                        </div>
                    ) : nearbyHospitals.length > 0 ? (
                        nearbyHospitals.map((hospital, index) => (
                            <div
                                key={hospital._id}
                                style={{
                                    opacity: 0,
                                    animation: `fadeInCard 1s ease-out ${0.2 + index * 0.15}s forwards`
                                }}
                            >
                                <HospitalCard
                                    id={hospital._id}
                                    name={hospital.hospitalName}
                                    specialities={hospital.specialities}
                                    address={`${hospital.address}, ${hospital.city}, ${hospital.state} - ${hospital.pincode}`}
                                    image={hospital.images?.[0] || ""}
                                />
                            </div>
                        ))
                    ) : (
                        <div className="animate-fade-in-delayed rounded-2xl border border-white/10 bg-white/5 p-12 text-center backdrop-blur-sm">
                            <div className="mb-4 text-6xl">🏥</div>
                            <h3 className="mb-2 text-2xl font-bold text-white">No Hospitals Found</h3>
                            <p className="text-slate-300">
                                We could not find any hospitals in <span className="font-semibold text-cyan-400">{userCity}</span>.
                            </p>
                            <p className="mt-2 text-sm text-slate-400">
                                Try browsing all available hospitals or contact support for assistance.
                            </p>
                            <button
                                onClick={() => window.location.href = '/hospitalList'}
                                className="mt-6 rounded-lg bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition-all duration-300 hover:scale-105 hover:bg-cyan-300"
                            >
                                Browse All Hospitals
                            </button>
                        </div>
                    )}

                </div>
            </div>

            <style jsx>{`
                @keyframes fadeInCard {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
};

export default Page;
