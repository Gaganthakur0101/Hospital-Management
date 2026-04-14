"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";

interface HospitalData {
    hospitalName: string;
    phoneNumber: string;
    address: string;
    city: string;
    pincode: string;
    state: string;
    registrationFees: number;
    hospitalType: "Government" | "Private" | "Clinic";
    description: string;
    establishedYear: number;
    images: string[];
    emergencyAvailable: boolean;
    ambulanceAvailable: boolean;
    specialities: string;
    avgConsultationMinutes: number;
}

const Page = () => {
    const router = useRouter();

    const [hospital, setHospital] = useState<HospitalData>({
        hospitalName: "",
        phoneNumber: "",
        address: "",
        city: "",
        pincode: "",
        state: "",
        registrationFees: 0,
        hospitalType: "Private",
        description: "",
        establishedYear: new Date().getFullYear(),
        emergencyAvailable: false,
        ambulanceAvailable: false,
        specialities: "",
        avgConsultationMinutes: 15,
        images: [],
    });

    const [checkingAccess, setCheckingAccess] = useState(true);

    useEffect(() => {
        const validateAccess = async () => {
            try {
                const res = await fetch("/api/users/me", { credentials: "include" });
                if (!res.ok) {
                    toast.error("Please login first");
                    router.replace("/login");
                    return;
                }
                const data = await res.json();
                if (data?.user?.role !== "doctor") {
                    toast.error("Only doctors can register hospitals");
                    router.replace(`/profile/${data?.user?.id || ""}`);
                    return;
                }
            } catch {
                toast.error("Please login first");
                router.replace("/login");
            } finally {
                setCheckingAccess(false);
            }
        };

        validateAccess();
    }, [router]);

    const getFriendlyError = (error: unknown): string => {
        if (typeof error === "string" && error.trim().startsWith("[")) {
            try {
                const parsed = JSON.parse(error);
                return getFriendlyError(parsed);
            } catch {
                return error;
            }
        }

        if (Array.isArray(error) && error.length > 0) {
            const labelMap: Record<string, string> = {
                hospitalName: "Hospital name",
                phoneNumber: "Phone number",
                description: "Description",
                pincode: "Pincode",
                registrationFees: "Registration fees",
                establishedYear: "Established year",
                hospitalType: "Hospital type",
                address: "Address",
                city: "City",
                state: "State",
            };

            const messages = (error as Array<{ path?: unknown; message?: string }>).map((issue) => {
                const field = Array.isArray(issue?.path) ? issue.path[0] : undefined;
                const label = field ? labelMap[field] || "Field" : "Field";

                if (field === "phoneNumber") return "Phone number is invalid";
                if (field === "description") return "Description is too short";
                if (field === "hospitalName") return "Hospital name is too short";
                if (field === "pincode") return "Pincode is invalid";
                if (field === "registrationFees") return "Registration fees is invalid";
                if (field === "establishedYear") return "Established year is invalid";
                if (field === "hospitalType") return "Hospital type is invalid";
                if (field === "address") return "Address is invalid";
                if (field === "city") return "City is invalid";
                if (field === "state") return "State is invalid";

                return issue?.message || `${label} is invalid`;
            });

            return messages.join(" | ");
        }

        if (typeof error === "string") return error;
        return "Registration failed";
    };

    const onRegister = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (
            !hospital.hospitalName ||
            !hospital.phoneNumber ||
            !hospital.address ||
            !hospital.city ||
            !hospital.pincode ||
            !hospital.state ||
            !hospital.description
        ) {
            toast.error("Please fill in all required fields");
            return;
        }

        try {
            const res = await fetch("/api/hospitals/registerHospital", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    hospitalName: hospital.hospitalName,
                    address: hospital.address,
                    city: hospital.city,
                    state: hospital.state,
                    pincode: hospital.pincode,
                    registrationFees: hospital.registrationFees,
                    hospitalType: hospital.hospitalType,
                    description: hospital.description,
                    establishedYear: hospital.establishedYear,
                    phoneNumber: hospital.phoneNumber,
                    emergencyAvailable: hospital.emergencyAvailable,
                    ambulanceAvailable: hospital.ambulanceAvailable,
                    images: hospital.images,
                    avgConsultationMinutes: hospital.avgConsultationMinutes,
                    specialities: hospital.specialities
                        .split(",")
                        .map((item) => item.trim())
                        .filter(Boolean),
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                const rawError = data?.error ?? data?.message ?? data;
                toast.error(getFriendlyError(rawError));
            } else {
                toast.success(data.message);
                router.push("/hospitalList");
            }
        } catch {
            toast.error("Something went wrong");
        }
    };

    const onUploadImages = async (files: FileList | null) => {
        if (!files || files.length === 0) return;

        const selected = Array.from(files);
        try {
            const uploadedUrls = await Promise.all(
                selected.map(async (file) => {
                    const formData = new FormData();
                    formData.append("file", file);

                    const res = await fetch("/api/uploads/hospital-photo", {
                        method: "POST",
                        credentials: "include",
                        body: formData,
                    });
                    const data = await res.json();

                    if (!res.ok) {
                        throw new Error(data?.error || "Upload failed");
                    }

                    return data.imageUrl as string;
                })
            );

            setHospital((prev) => ({
                ...prev,
                images: [...prev.images, ...uploadedUrls].slice(0, 6),
            }));
            toast.success("Images uploaded");
        } catch (error: unknown) {
            toast.error(error instanceof Error ? error.message : "Image upload failed");
        }
    };

    const inputClass =
        "w-full rounded-xl border border-cyan-100/30 bg-slate-900/70 px-4 py-3 text-slate-100 placeholder:text-slate-400 shadow-sm outline-none transition focus:border-cyan-300/70 focus:ring-4 focus:ring-cyan-300/15";

    if (checkingAccess) {
        return (
            <div className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-10">
                <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-white/15 bg-white/8 p-8 text-center text-slate-200 backdrop-blur-xl">
                    Verifying access...
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-10">
            <div className="pointer-events-none absolute -top-20 -right-24 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-16 h-80 w-80 rounded-full bg-emerald-400/15 blur-3xl" />

            <div className="mx-auto w-full max-w-3xl">
                <div className="mb-8 rounded-3xl border border-white/15 bg-white/8 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
                                Hospital onboarding
                            </p>
                            <h1 className="mt-2 text-3xl font-black text-white sm:text-4xl">
                                Register your hospital
                            </h1>
                            <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-200">
                                Provide core details and clinical capabilities so patients can find your facility faster.
                            </p>
                        </div>
                        <div className="rounded-2xl border border-cyan-100/30 bg-cyan-300/10 px-4 py-3 text-sm text-slate-200">
                            <p className="font-medium text-cyan-100">Need help?</p>
                            <p>Call our onboarding team.</p>
                        </div>
                    </div>
                </div>

                <div className="rounded-3xl border border-white/15 bg-white/8 p-6 shadow-2xl backdrop-blur-xl sm:p-10">
                    <form className="space-y-7">
                        <section className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-white">Hospital information</h2>
                                <span className="rounded-full bg-cyan-300/15 px-3 py-1 text-xs font-medium text-cyan-100">
                                    Required
                                </span>
                            </div>

                            <div>
                                <label htmlFor="hospitalName" className="block text-sm font-medium text-slate-200">
                                    Hospital name *
                                </label>
                                <input
                                    id="hospitalName"
                                    type="text"
                                    placeholder="e.g. Mercy Multispecialty Hospital"
                                    value={hospital.hospitalName}
                                    onChange={(e) => setHospital({ ...hospital, hospitalName: e.target.value })}
                                    className={inputClass}
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-slate-200">
                                        Phone number *
                                    </label>
                                    <input
                                        id="phoneNumber"
                                        type="tel"
                                        placeholder="10-digit phone number"
                                        value={hospital.phoneNumber}
                                        onChange={(e) => setHospital({ ...hospital, phoneNumber: e.target.value })}
                                        className={inputClass}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="hospitalType" className="block text-sm font-medium text-slate-200">
                                        Hospital type *
                                    </label>
                                    <select
                                        id="hospitalType"
                                        value={hospital.hospitalType}
                                        onChange={(e) =>
                                            setHospital({
                                                ...hospital,
                                                hospitalType: e.target.value as HospitalData["hospitalType"],
                                            })
                                        }
                                        className={inputClass}
                                    >
                                        <option value="Government">Government</option>
                                        <option value="Private">Private</option>
                                        <option value="Clinic">Clinic</option>
                                    </select>
                                </div>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-lg font-semibold text-white">Location details</h2>

                            <div>
                                <label htmlFor="address" className="block text-sm font-medium text-slate-200">
                                    Address *
                                </label>
                                <input
                                    id="address"
                                    type="text"
                                    placeholder="Street, building, landmark"
                                    value={hospital.address}
                                    onChange={(e) => setHospital({ ...hospital, address: e.target.value })}
                                    className={inputClass}
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="city" className="block text-sm font-medium text-slate-200">
                                        City *
                                    </label>
                                    <input
                                        id="city"
                                        type="text"
                                        placeholder="Enter city"
                                        value={hospital.city}
                                        onChange={(e) => setHospital({ ...hospital, city: e.target.value })}
                                        className={inputClass}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="state" className="block text-sm font-medium text-slate-200">
                                        State *
                                    </label>
                                    <input
                                        id="state"
                                        type="text"
                                        placeholder="Enter state"
                                        value={hospital.state}
                                        onChange={(e) => setHospital({ ...hospital, state: e.target.value })}
                                        className={inputClass}
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="pincode" className="block text-sm font-medium text-slate-200">
                                    Pincode *
                                </label>
                                <input
                                    id="pincode"
                                    type="text"
                                    placeholder="6-digit pincode"
                                    value={hospital.pincode}
                                    onChange={(e) => setHospital({ ...hospital, pincode: e.target.value })}
                                    className={inputClass}
                                />
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-lg font-semibold text-white">Registration details</h2>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="registrationFees" className="block text-sm font-medium text-slate-200">
                                        Registration fees *
                                    </label>
                                    <input
                                        id="registrationFees"
                                        type="number"
                                        min={0}
                                        placeholder="0"
                                        value={hospital.registrationFees}
                                        onChange={(e) =>
                                            setHospital({
                                                ...hospital,
                                                registrationFees: Number(e.target.value) || 0,
                                            })
                                        }
                                        className={inputClass}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="establishedYear" className="block text-sm font-medium text-slate-200">
                                        Established year *
                                    </label>
                                    <input
                                        id="establishedYear"
                                        type="number"
                                        min={1800}
                                        max={new Date().getFullYear()}
                                        value={hospital.establishedYear}
                                        onChange={(e) =>
                                            setHospital({
                                                ...hospital,
                                                establishedYear: Number(e.target.value) || 0,
                                            })
                                        }
                                        className={inputClass}
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="avgConsultationMinutes" className="block text-sm font-medium text-slate-200">
                                    Average consultation minutes *
                                </label>
                                <input
                                    id="avgConsultationMinutes"
                                    type="number"
                                    min={5}
                                    max={120}
                                    value={hospital.avgConsultationMinutes}
                                    onChange={(e) =>
                                        setHospital({
                                            ...hospital,
                                            avgConsultationMinutes: Number(e.target.value) || 15,
                                        })
                                    }
                                    className={inputClass}
                                />
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-lg font-semibold text-white">Availability</h2>

                            <div className="grid gap-3 sm:grid-cols-2">
                                <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/8 px-4 py-3">
                                    <input
                                        type="checkbox"
                                        checked={hospital.emergencyAvailable}
                                        onChange={(e) =>
                                            setHospital({
                                                ...hospital,
                                                emergencyAvailable: e.target.checked,
                                            })
                                        }
                                        className="h-4 w-4 rounded border-slate-300 text-cyan-300 focus:ring-4 focus:ring-cyan-300/20"
                                    />
                                    <span className="text-sm text-slate-100">24/7 emergency available</span>
                                </label>

                                <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/8 px-4 py-3">
                                    <input
                                        type="checkbox"
                                        checked={hospital.ambulanceAvailable}
                                        onChange={(e) =>
                                            setHospital({
                                                ...hospital,
                                                ambulanceAvailable: e.target.checked,
                                            })
                                        }
                                        className="h-4 w-4 rounded border-slate-300 text-cyan-300 focus:ring-4 focus:ring-cyan-300/20"
                                    />
                                    <span className="text-sm text-slate-100">Ambulance available</span>
                                </label>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-lg font-semibold text-white">Hospital description *</h2>
                            <textarea
                                id="description"
                                rows={4}
                                placeholder="Describe services, departments, and special capabilities"
                                value={hospital.description}
                                onChange={(e) => setHospital({ ...hospital, description: e.target.value })}
                                className={`${inputClass} min-h-30`}
                            />
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-lg font-semibold text-white">Specialities</h2>
                            <input
                                id="specialities"
                                type="text"
                                placeholder="Cardiology, Orthopedics, Pediatrics"
                                value={hospital.specialities}
                                onChange={(e) => setHospital({ ...hospital, specialities: e.target.value })}
                                className={inputClass}
                            />
                            <p className="text-xs text-slate-300">Separate each speciality with a comma.</p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-lg font-semibold text-white">Hospital photos</h2>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => onUploadImages(e.target.files)}
                                className="w-full rounded-xl border border-cyan-100/30 bg-slate-900/70 px-4 py-3 text-slate-100"
                            />
                            {hospital.images.length > 0 && (
                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                    {hospital.images.map((src, idx) => (
                                        <div key={`${src}-${idx}`} className="overflow-hidden rounded-lg border border-cyan-100/20">
                                            <Image
                                                src={src}
                                                alt={`hospital-${idx + 1}`}
                                                width={400}
                                                height={120}
                                                className="h-28 w-full object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                        <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
                            <button
                                onClick={onRegister}
                                className="inline-flex items-center justify-center rounded-xl bg-cyan-400 px-6 py-3 text-sm font-bold text-slate-950 transition duration-200 hover:scale-[1.01] hover:bg-cyan-300"
                            >
                                Register hospital
                            </button>

                            <p className="text-sm text-slate-300">
                                Already registered?{" "}
                                <Link href="/login" className="font-semibold text-cyan-200 hover:text-cyan-100">
                                    Sign in here
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Page;
