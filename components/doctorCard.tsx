"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface DoctorCardProps {
	id: string;
	name: string;
	specialization: string;
	experience: number;
	fees: number;
	email: string;
	phone: string;
	gender: "Male" | "Female" | "Other";
}

const DoctorCard: React.FC<DoctorCardProps> = ({
	id,
	name,
	specialization,
	experience,
	fees,
	email,
	phone,
	gender,
}) => {
	const router = useRouter();

	return (
		<div className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/15 bg-white/8 shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl md:flex-row">
			<div className="relative flex h-44 w-full flex-col items-center justify-center gap-3 border-b border-white/10 bg-slate-900/35 p-4 md:h-auto md:w-52 md:border-b-0 md:border-r">
				<div className="flex h-16 w-16 items-center justify-center rounded-full bg-cyan-300/20 text-xl font-bold text-cyan-100">
					{name?.charAt(0)?.toUpperCase() || "D"}
				</div>
				<p className="text-sm font-semibold text-cyan-100">Doctor Profile</p>
				<span className="rounded-full border border-cyan-200/30 bg-cyan-300/15 px-3 py-1 text-xs font-medium text-cyan-100">
					{gender}
				</span>
			</div>

			<div className="flex flex-1 flex-col justify-between bg-slate-900/30 p-5">
				<h2 className="text-2xl font-bold text-cyan-100 transition-colors duration-300 group-hover:text-cyan-200">
					{name}
				</h2>

				<div className="mt-2 flex flex-wrap gap-2">
					<span className="rounded-full bg-cyan-300/15 px-3 py-1 text-xs font-medium text-cyan-100 transition hover:bg-cyan-300/25">
						{specialization}
					</span>
				</div>

				<div className="mt-4 grid gap-2 text-sm text-slate-200 sm:grid-cols-2">
					<p><span className="font-semibold text-cyan-100">Experience:</span> {experience} years</p>
					<p><span className="font-semibold text-cyan-100">Consultation Fees:</span> Rs. {fees}</p>
					<p><span className="font-semibold text-cyan-100">Phone:</span> {phone}</p>
					<p><span className="font-semibold text-cyan-100">Email:</span> {email}</p>
				</div>
			</div>

			<div className="flex justify-center gap-3 border-t border-white/10 bg-slate-900/35 p-5 md:flex-col md:border-l md:border-t-0">
				<button
					onClick={() => router.push(`/doctors/${id}`)}
					className="rounded-lg border border-cyan-100/40 px-4 py-2 font-medium text-cyan-100 transition-all duration-300 hover:bg-cyan-300/10"
				>
					Show Details
				</button>

				<button
					onClick={() => router.push(`/appointments?doctorId=${id}`)}
					className="rounded-lg bg-cyan-400 px-4 py-2 font-semibold text-slate-950 transition-all duration-300 hover:scale-105 hover:bg-cyan-300 hover:shadow-lg"
				>
					Request Appointment
				</button>
			</div>
		</div>
	);
};

export default DoctorCard;
