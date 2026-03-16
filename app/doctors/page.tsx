"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Doctor {
  _id: string;
  doctorName: string;
  gender: "Male" | "Female" | "Other";
  specialization: string;
  experience: number;
  fees: number;
  email: string;
  phone: string;
  medicalLicenseNumber: string;
}

const Page = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch("/api/doctors/all");

        if (!response.ok) {
          throw new Error("Failed to load doctors");
        }

        const data: Doctor[] = await response.json();
        setDoctors(Array.isArray(data) ? data : []);
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unable to fetch doctors";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 px-4 pb-16 pt-12 sm:px-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-16 top-14 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl animate-float-slow" />
        <div className="absolute right-0 top-1/4 h-80 w-80 rounded-full bg-emerald-400/15 blur-3xl animate-float-fast" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-blue-400/15 blur-3xl animate-float-slow" />
      </div>

      <section className="relative mx-auto w-full max-w-6xl">
        <div className="animate-rise-up mb-10 rounded-2xl border border-white/15 bg-white/8 p-5 shadow-2xl backdrop-blur-xl sm:p-6">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-cyan-400">Doctor Directory</p>
          <h1 className="text-3xl font-black text-white sm:text-4xl">Find Your Specialist</h1>
          <p className="mt-3 max-w-2xl text-slate-300">
            Explore experienced doctors, compare consultation fees, and choose the right specialist for your care.
          </p>
        </div>

        {loading ? (
          <div className="animate-fade-in rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-sm">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-600 border-t-cyan-400" />
            <p className="mt-4 text-slate-300">Loading doctors...</p>
          </div>
        ) : doctors.length === 0 ? (
          <div className="animate-fade-in rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-sm">
            <h2 className="text-xl font-semibold text-white">No doctors found</h2>
            <p className="mt-2 text-slate-300">Please check again later after new registrations.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {doctors.map((doctor, index) => (
              <article
                key={doctor._id}
                style={{
                  opacity: 0,
                  animation: `fadeInCard 0.9s ease-out ${0.15 + index * 0.08}s forwards`,
                }}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xl backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/40 hover:bg-white/8"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-cyan-300">{doctor.specialization}</p>
                    <h2 className="mt-1 text-xl font-bold text-white">{doctor.doctorName}</h2>
                  </div>
                  <span className="rounded-full border border-cyan-200/25 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-100">
                    {doctor.gender}
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border border-white/10 bg-slate-900/40 p-3">
                    <p className="text-xs uppercase tracking-wider text-slate-400">Experience</p>
                    <p className="mt-1 text-sm font-semibold text-white">{doctor.experience} years</p>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-slate-900/40 p-3">
                    <p className="text-xs uppercase tracking-wider text-slate-400">Consultation Fee</p>
                    <p className="mt-1 text-sm font-semibold text-white">INR {doctor.fees}</p>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-slate-900/40 p-3 sm:col-span-2">
                    <p className="text-xs uppercase tracking-wider text-slate-400">Email</p>
                    <p className="mt-1 break-all text-sm font-semibold text-white">{doctor.email}</p>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-slate-900/40 p-3 sm:col-span-2">
                    <p className="text-xs uppercase tracking-wider text-slate-400">Phone</p>
                    <p className="mt-1 text-sm font-semibold text-white">{doctor.phone}</p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
                  <p className="text-xs text-slate-400">License: {doctor.medicalLicenseNumber}</p>
                  <Link
                    href={`/doctors/${doctor._id}`}
                    className="inline-flex items-center rounded-lg bg-cyan-400 px-4 py-2 text-sm font-bold text-slate-950 transition-colors hover:bg-cyan-300"
                  >
                    View Profile
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <style jsx>{`
        .animate-rise-up {
          animation: riseUp 0.85s ease-out forwards;
        }

        .animate-fade-in {
          opacity: 0;
          animation: fadeInCard 0.8s ease-out 0.2s forwards;
        }

        .animate-float-slow {
          animation: floatSlow 10s ease-in-out infinite;
        }

        .animate-float-fast {
          animation: floatFast 7s ease-in-out infinite;
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes riseUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInCard {
          from {
            opacity: 0;
            transform: translateY(18px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes floatSlow {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        @keyframes floatFast {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-11px);
          }
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </main>
  );
};

export default Page;
