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
    <div className="group relative flex flex-col md:flex-row items-stretch bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-1">

      {/* LEFT - Image */}
      <div className="relative w-full md:w-48 h-40 md:h-auto overflow-hidden">
        <img
          src={image}
          alt="Hospital"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition duration-300" />
      </div>

      {/* MIDDLE - Content */}
      <div className="flex-1 p-5 flex flex-col justify-between bg-gray-50">

        {/* Hospital Name */}
        <h2 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
          {name}
        </h2>

        {/* Specialities */}
        <div className="mt-2 flex flex-wrap gap-2">
          {specialities.map((spec, index) => (
            <span
              key={index}
              className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium hover:bg-blue-200 transition"
            >
              {spec}
            </span>
          ))}
        </div>

        {/* Address */}
        <p className="mt-3 text-sm text-gray-600 line-clamp-2">
          📍 {address}
        </p>
      </div>

      {/* RIGHT - Buttons */}
      <div className="flex md:flex-col justify-center gap-3 p-5 bg-white border-t md:border-t-0 md:border-l border-gray-200">

        {/* Show Details */}
        <button
          onClick={() => router.push(`/hospitalList/${id}`)}
          className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 hover:shadow-md transition-all duration-300"
        >
          Show Details
        </button>

        {/* Queue Button */}
        <button
          onClick={() => router.push(`/hospital/${id}/queue`)}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
        >
          Queue
        </button>

      </div>
    </div>
  );
};

export default HospitalCard;