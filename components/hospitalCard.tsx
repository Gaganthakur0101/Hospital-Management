"use client";
import React from "react";
import { useRouter } from "next/navigation";

interface HospitalCardProps {
  id?: string;
  name?: string;
  specialities?: string[];
  address?: string;
  image?: string;
}

const HospitalCard: React.FC<HospitalCardProps> = ({
  id,
  name,
  specialities,
  address,
  image,
}) => {
  const router = useRouter();

  return (
    <div className="group relative flex flex-col items-stretch overflow-hidden rounded-2xl border border-white/15 bg-white/8 shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl md:flex-row">

      {/* LEFT - Image */}
      <div className="relative h-40 w-full overflow-hidden md:h-auto md:w-48">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt="Hospital"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-slate-900/15 transition duration-300 group-hover:bg-slate-900/30" />
      </div>

      {/* MIDDLE - Content */}
      <div className="flex flex-1 flex-col justify-between bg-slate-900/30 p-5">

        {/* Hospital Name */}
        <h2 className="text-xl font-bold text-cyan-100 transition-colors duration-300 group-hover:text-cyan-200">
          {name}
        </h2>

        {/* Specialities */}
        <div className="mt-2 flex flex-wrap gap-2">
          {(specialities ?? []).map((spec, index) => (
            <span
              key={index}
              className="rounded-full bg-cyan-300/15 px-3 py-1 text-xs font-medium text-cyan-100 transition hover:bg-cyan-300/25"
            >
              {spec}
            </span>
          ))}
        </div>

        {/* Address */}
        <p className="mt-3 line-clamp-2 text-sm text-slate-200">
          📍 {address}
        </p>
      </div>

      {/* RIGHT - Buttons */}
      <div className="flex justify-center gap-3 border-t border-white/10 bg-slate-900/35 p-5 md:flex-col md:border-t-0 md:border-l">

        {/* Show Details */}
        <button 
          onClick={() => router.push(`/hospitalList/${id}`)}
          className="rounded-lg border border-cyan-100/40 px-4 py-2 font-medium text-cyan-100 transition-all duration-300 hover:bg-cyan-300/10"
        >
          Show Details
        </button>

        {/* Book Appointment Button */}
        <button
          onClick={() => router.push(`/hospital/${id}/book  `)}
          className="rounded-lg bg-cyan-400 px-4 py-2 font-semibold text-slate-950 transition-all duration-300 hover:scale-105 hover:bg-cyan-300 hover:shadow-lg"
        >
          Book Appointment
        </button>

      </div>
    </div>
  );
};

export default HospitalCard;