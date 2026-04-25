"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import StateCitySelector from "@/components/StateCitySelector";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ScheduleEntry {
    specialization: string;
    days: string[];
    startTime: string;
    endTime: string;
}

interface HospitalForm {
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
    avgConsultationMinutes: number;
}

const ALL_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const SPECIALIZATION_SUGGESTIONS = [
    "Cardiology", "Orthopedics", "Pediatrics", "Neurology", "Dermatology",
    "Dentistry", "Ophthalmology", "ENT", "Gynecology", "Psychiatry",
    "Oncology", "Radiology", "Urology", "Gastroenterology", "Nephrology",
    "Pulmonology", "Endocrinology", "Rheumatology", "General Surgery", "Emergency Medicine",
];

// ─── Schedule Builder ─────────────────────────────────────────────────────────

const ScheduleBuilder = ({
    schedules,
    onChange,
}: {
    schedules: ScheduleEntry[];
    onChange: (updated: ScheduleEntry[]) => void;
}) => {
    const addRow = () =>
        onChange([...schedules, { specialization: "", days: [], startTime: "", endTime: "" }]);

    const removeRow = (idx: number) =>
        onChange(schedules.filter((_, i) => i !== idx));

    const updateRow = (idx: number, patch: Partial<ScheduleEntry>) =>
        onChange(schedules.map((s, i) => (i === idx ? { ...s, ...patch } : s)));

    const toggleDay = (idx: number, day: string) => {
        const current = schedules[idx].days;
        const next = current.includes(day)
            ? current.filter((d) => d !== day)
            : [...current, day];
        updateRow(idx, { days: next });
    };

    const inputCls =
        "w-full rounded-lg border border-cyan-100/20 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/15 transition";

    return (
        <div className="space-y-4">
            {schedules.map((entry, idx) => (
                <div key={idx} className="rounded-xl border border-cyan-100/15 bg-slate-900/50 p-4 space-y-3 relative">
                    <button
                        type="button"
                        onClick={() => removeRow(idx)}
                        className="absolute top-3 right-3 flex items-center justify-center w-6 h-6 rounded-full bg-red-500/20 text-red-300 hover:bg-red-500/40 transition text-xs font-bold"
                    >
                        ✕
                    </button>

                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Specialization *</label>
                        <input
                            type="text"
                            list={`spec-list-edit-${idx}`}
                            placeholder="e.g. Cardiology"
                            value={entry.specialization}
                            onChange={(e) => updateRow(idx, { specialization: e.target.value })}
                            className={inputCls}
                        />
                        <datalist id={`spec-list-edit-${idx}`}>
                            {SPECIALIZATION_SUGGESTIONS.map((s) => <option key={s} value={s} />)}
                        </datalist>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-2">Available Days</label>
                        <div className="flex flex-wrap gap-2">
                            {ALL_DAYS.map((day) => {
                                const selected = entry.days.includes(day);
                                return (
                                    <button
                                        key={day}
                                        type="button"
                                        onClick={() => toggleDay(idx, day)}
                                        className={`px-3 py-1 rounded-full text-xs font-semibold border transition ${selected
                                            ? "bg-cyan-400/25 border-cyan-400/60 text-cyan-200"
                                            : "border-slate-600 text-slate-400 hover:border-slate-400"
                                            }`}
                                    >
                                        {day}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1">Start Time</label>
                            <input
                                type="time"
                                value={entry.startTime}
                                onChange={(e) => updateRow(idx, { startTime: e.target.value })}
                                className={inputCls}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1">End Time</label>
                            <input
                                type="time"
                                value={entry.endTime}
                                onChange={(e) => updateRow(idx, { endTime: e.target.value })}
                                className={inputCls}
                            />
                        </div>
                    </div>
                </div>
            ))}

            <button
                type="button"
                onClick={addRow}
                className="flex items-center gap-2 rounded-xl border border-dashed border-cyan-400/40 px-4 py-2.5 text-sm font-medium text-cyan-300 hover:border-cyan-400/70 hover:bg-cyan-300/5 transition w-full justify-center"
            >
                <span className="text-lg leading-none">+</span> Add Specialization Schedule
            </button>
        </div>
    );
};

// ─── Main Edit Page ───────────────────────────────────────────────────────────

const Page = () => {
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const id = params?.id;

    const [form, setForm] = useState<HospitalForm>({
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
        images: [],
        emergencyAvailable: false,
        ambulanceAvailable: false,
        avgConsultationMinutes: 15,
    });

    const [schedules, setSchedules] = useState<ScheduleEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!id) return;

        const fetchHospital = async () => {
            try {
                // Auth check
                const meRes = await fetch("/api/users/me", { credentials: "include" });
                if (!meRes.ok) { router.replace("/login"); return; }
                const meData = await meRes.json();
                if (meData?.user?.role !== "doctor") {
                    toast.error("Only doctors can edit hospitals");
                    router.replace(`/profile/${meData?.user?.id || ""}`);
                    return;
                }

                // Fetch hospital
                const res = await fetch(`/api/hospitals/${id}`);
                if (!res.ok) throw new Error("Hospital not found");
                const data = await res.json();

                setForm({
                    hospitalName: data.hospitalName ?? "",
                    phoneNumber: data.phoneNumber ?? "",
                    address: data.address ?? "",
                    city: data.city ?? "",
                    pincode: data.pincode ?? "",
                    state: data.state ?? "",
                    registrationFees: data.registrationFees ?? 0,
                    hospitalType: data.hospitalType ?? "Private",
                    description: data.description ?? "",
                    establishedYear: data.establishedYear ?? new Date().getFullYear(),
                    images: data.images ?? [],
                    emergencyAvailable: data.emergencyAvailable ?? false,
                    ambulanceAvailable: data.ambulanceAvailable ?? false,
                    avgConsultationMinutes: data.avgConsultationMinutes ?? 15,
                });

                // Populate schedules — if doctorSchedules exists use it, otherwise build from specialities
                if (Array.isArray(data.doctorSchedules) && data.doctorSchedules.length > 0) {
                    setSchedules(data.doctorSchedules);
                } else if (Array.isArray(data.specialities) && data.specialities.length > 0) {
                    setSchedules(
                        data.specialities.map((s: string) => ({
                            specialization: s,
                            days: [],
                            startTime: "",
                            endTime: "",
                        }))
                    );
                }
            } catch (err) {
                toast.error(err instanceof Error ? err.message : "Failed to load hospital");
            } finally {
                setLoading(false);
            }
        };

        fetchHospital();
    }, [id, router]);

    const handlePincodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const pin = e.target.value;
        setForm((prev) => ({ ...prev, pincode: pin }));

        if (pin.length === 6) {
            try {
                const res = await fetch(`/api/locations/pincode/${pin}`);
                if (res.ok) {
                    const data = await res.json();
                    setForm((prev) => ({
                        ...prev,
                        state: data.state || prev.state,
                        city: data.district || prev.city,
                    }));
                    toast.success("Location auto-filled from pincode", { icon: "📍" });
                }
            } catch {
                // Silently ignore if auto-fill fails
            }
        }
    };

    const onUploadImages = async (files: FileList | null) => {
        if (!files || files.length === 0) return;
        try {
            const uploadedUrls = await Promise.all(
                Array.from(files).map(async (file) => {
                    const formData = new FormData();
                    formData.append("file", file);
                    const res = await fetch("/api/uploads/hospital-photo", {
                        method: "POST",
                        credentials: "include",
                        body: formData,
                    });
                    const data = await res.json();
                    if (!res.ok) throw new Error(data?.error || "Upload failed");
                    return data.imageUrl as string;
                })
            );
            setForm((prev) => ({
                ...prev,
                images: [...prev.images, ...uploadedUrls].slice(0, 6),
            }));
            toast.success("Images uploaded");
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Image upload failed");
        }
    };

    const removeImage = (idx: number) => {
        setForm((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== idx),
        }));
    };

    const onSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (!form.hospitalName || !form.phoneNumber || !form.address || !form.city || !form.state || !form.description) {
            toast.error("Please fill in all required fields");
            return;
        }
        for (const s of schedules) {
            if (!s.specialization.trim()) {
                toast.error("Each schedule must have a specialization name");
                return;
            }
        }

        // Validate Pincode and State Match
        try {
            const pinRes = await fetch(`/api/locations/pincode/${form.pincode}`);
            if (!pinRes.ok) {
                toast.error("Invalid pincode. Please enter a valid 6-digit pincode.");
                return;
            }
            const pinData = await pinRes.json();
            if (pinData.state.toLowerCase() !== form.state.toLowerCase()) {
                toast.error(`The pincode ${form.pincode} does not belong to ${form.state}.`);
                return;
            }
        } catch {
            // Proceed if the API fails, to prevent blocking saves on API downtime
        }

        setSaving(true);
        try {
            const res = await fetch(`/api/hospitals/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ ...form, doctorSchedules: schedules }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.error || "Update failed");
            toast.success("Hospital updated successfully!");
            router.push("/doctors/manage-hospitals");
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setSaving(false);
        }
    };

    const inputClass =
        "w-full rounded-xl border border-cyan-100/30 bg-slate-900/70 px-4 py-3 text-slate-100 placeholder:text-slate-400 shadow-sm outline-none transition focus:border-cyan-300/70 focus:ring-4 focus:ring-cyan-300/15";

    if (loading) {
        return (
            <div className="relative min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-600 border-t-cyan-400" />
                    <p className="mt-4 text-slate-300">Loading hospital data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-10">
            <div className="pointer-events-none absolute -top-20 -right-24 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-16 h-80 w-80 rounded-full bg-emerald-400/15 blur-3xl" />

            <div className="mx-auto w-full max-w-3xl">
                {/* Header */}
                <div className="mb-8 rounded-3xl border border-white/15 bg-white/8 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
                                Hospital Management
                            </p>
                            <h1 className="mt-2 text-2xl font-black text-white sm:text-3xl">
                                Edit Hospital
                            </h1>
                            <p className="mt-2 text-sm text-slate-300 font-medium truncate max-w-xs">
                                {form.hospitalName}
                            </p>
                        </div>
                        <button
                            onClick={() => router.push("/doctors/manage-hospitals")}
                            className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-slate-300 hover:bg-white/10 transition"
                        >
                            ← Back
                        </button>
                    </div>
                </div>

                <div className="rounded-3xl border border-white/15 bg-white/8 p-6 shadow-2xl backdrop-blur-xl sm:p-10">
                    <form className="space-y-7">

                        {/* ── Hospital Information ── */}
                        <section className="space-y-4">
                            <h2 className="text-lg font-semibold text-white">Hospital information</h2>

                            <div>
                                <label htmlFor="edit-hospitalName" className="block text-sm font-medium text-slate-200">
                                    Hospital name *
                                </label>
                                <input
                                    id="edit-hospitalName"
                                    type="text"
                                    value={form.hospitalName}
                                    onChange={(e) => setForm({ ...form, hospitalName: e.target.value })}
                                    className={inputClass}
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="edit-phoneNumber" className="block text-sm font-medium text-slate-200">
                                        Phone number *
                                    </label>
                                    <input
                                        id="edit-phoneNumber"
                                        type="tel"
                                        value={form.phoneNumber}
                                        onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                                        className={inputClass}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="edit-hospitalType" className="block text-sm font-medium text-slate-200">
                                        Hospital type *
                                    </label>
                                    <select
                                        id="edit-hospitalType"
                                        value={form.hospitalType}
                                        onChange={(e) =>
                                            setForm({ ...form, hospitalType: e.target.value as HospitalForm["hospitalType"] })
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

                        {/* ── Location Details ── */}
                        <section className="space-y-4">
                            <h2 className="text-lg font-semibold text-white">Location details</h2>

                            <div>
                                <label htmlFor="edit-address" className="block text-sm font-medium text-slate-200">
                                    Address *
                                </label>
                                <input
                                    id="edit-address"
                                    type="text"
                                    value={form.address}
                                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                                    className={inputClass}
                                />
                            </div>

                            <StateCitySelector
                                state={form.state}
                                city={form.city}
                                onStateChange={(stateName) =>
                                    setForm({ ...form, state: stateName, city: "" })
                                }
                                onCityChange={(c) => setForm({ ...form, city: c })}
                                inputClass={inputClass}
                            />

                            <div>
                                <label htmlFor="edit-pincode" className="block text-sm font-medium text-slate-200">
                                    Pincode *
                                </label>
                                <input
                                    id="edit-pincode"
                                    type="text"
                                    value={form.pincode}
                                    onChange={handlePincodeChange}
                                    className={inputClass}
                                />
                            </div>
                        </section>

                        {/* ── Registration Details ── */}
                        <section className="space-y-4">
                            <h2 className="text-lg font-semibold text-white">Registration details</h2>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="edit-registrationFees" className="block text-sm font-medium text-slate-200">
                                        Registration fees *
                                    </label>
                                    <input
                                        id="edit-registrationFees"
                                        type="number"
                                        min={0}
                                        value={form.registrationFees}
                                        onChange={(e) => setForm({ ...form, registrationFees: Number(e.target.value) || 0 })}
                                        className={inputClass}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="edit-establishedYear" className="block text-sm font-medium text-slate-200">
                                        Established year
                                    </label>
                                    <input
                                        id="edit-establishedYear"
                                        type="number"
                                        min={1800}
                                        max={new Date().getFullYear()}
                                        value={form.establishedYear}
                                        onChange={(e) => setForm({ ...form, establishedYear: Number(e.target.value) || 0 })}
                                        className={inputClass}
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="edit-avgConsultationMinutes" className="block text-sm font-medium text-slate-200">
                                    Average consultation minutes
                                </label>
                                <input
                                    id="edit-avgConsultationMinutes"
                                    type="number"
                                    min={5}
                                    max={120}
                                    value={form.avgConsultationMinutes}
                                    onChange={(e) =>
                                        setForm({ ...form, avgConsultationMinutes: Number(e.target.value) || 15 })
                                    }
                                    className={inputClass}
                                />
                            </div>
                        </section>

                        {/* ── Availability ── */}
                        <section className="space-y-4">
                            <h2 className="text-lg font-semibold text-white">Availability</h2>
                            <div className="grid gap-3 sm:grid-cols-2">
                                <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/8 px-4 py-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={form.emergencyAvailable}
                                        onChange={(e) => setForm({ ...form, emergencyAvailable: e.target.checked })}
                                        className="h-4 w-4 rounded text-cyan-300"
                                    />
                                    <span className="text-sm text-slate-100">24/7 emergency available</span>
                                </label>
                                <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/8 px-4 py-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={form.ambulanceAvailable}
                                        onChange={(e) => setForm({ ...form, ambulanceAvailable: e.target.checked })}
                                        className="h-4 w-4 rounded text-cyan-300"
                                    />
                                    <span className="text-sm text-slate-100">Ambulance available</span>
                                </label>
                            </div>
                        </section>

                        {/* ── Description ── */}
                        <section className="space-y-4">
                            <h2 className="text-lg font-semibold text-white">Hospital description *</h2>
                            <textarea
                                id="edit-description"
                                rows={4}
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                className={`${inputClass} min-h-[8rem]`}
                            />
                        </section>

                        {/* ── Schedule Builder ── */}
                        <section className="space-y-4">
                            <div>
                                <h2 className="text-lg font-semibold text-white">Specializations & Availability</h2>
                                <p className="mt-1 text-xs text-slate-400">
                                    Update your specializations and available timings for this hospital.
                                </p>
                            </div>
                            <ScheduleBuilder schedules={schedules} onChange={setSchedules} />
                        </section>

                        {/* ── Photos ── */}
                        <section className="space-y-3">
                            <h2 className="text-lg font-semibold text-white">Hospital photos</h2>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => onUploadImages(e.target.files)}
                                className="w-full rounded-xl border border-cyan-100/30 bg-slate-900/70 px-4 py-3 text-slate-100"
                            />
                            {form.images.length > 0 && (
                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                    {form.images.map((src, idx) => (
                                        <div key={`${src}-${idx}`} className="group relative overflow-hidden rounded-lg border border-cyan-100/20">
                                            <Image
                                                src={src}
                                                alt={`hospital-${idx + 1}`}
                                                width={400}
                                                height={120}
                                                className="h-28 w-full object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(idx)}
                                                className="absolute top-1.5 right-1.5 hidden group-hover:flex items-center justify-center h-6 w-6 rounded-full bg-red-500/80 text-white text-xs font-bold"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* ── Actions ── */}
                        <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
                            <button
                                onClick={onSave}
                                disabled={saving}
                                className="inline-flex items-center justify-center rounded-xl bg-cyan-400 px-8 py-3 text-sm font-bold text-slate-950 transition duration-200 hover:scale-[1.01] hover:bg-cyan-300 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {saving ? "Saving..." : "Save Changes"}
                            </button>
                            <button
                                type="button"
                                onClick={() => router.push("/doctors/manage-hospitals")}
                                className="text-sm text-slate-400 hover:text-slate-200 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Page;
