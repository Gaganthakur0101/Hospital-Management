"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

type AppointmentStatus = "pending" | "accepted" | "in_progress" | "completed" | "cancelled" | "rejected";

type Appointment = {
  id: string;
  queueNumber: number;
  status: AppointmentStatus;
  symptoms: string;
  appointmentDate: string;
  scheduledTime: string;
  hospitalId: string;
  hospitalName: string;
  doctorId: string | null;
  doctorName: string | null;
  patientName: string | null;
};

type QueueData = {
  peopleAhead: number;
  peopleLeft: number;
  estimatedWaitMinutes: number;
};

type User = { role: "doctor" | "patient" };

const getToday = () => {
  const now = new Date();
  return `${now.getFullYear()}-${`${now.getMonth() + 1}`.padStart(2, "0")}-${`${now.getDate()}`.padStart(2, "0")}`;
};

const statusClassMap: Record<AppointmentStatus, string> = {
  pending: "bg-slate-300/15 border-slate-200/30 text-slate-100",
  accepted: "bg-cyan-300/15 border-cyan-200/30 text-cyan-100",
  in_progress: "bg-amber-300/15 border-amber-200/30 text-amber-100",
  completed: "bg-emerald-300/15 border-emerald-200/30 text-emerald-100",
  cancelled: "bg-rose-300/15 border-rose-200/30 text-rose-100",
  rejected: "bg-rose-300/15 border-rose-200/30 text-rose-100",
};

const AppointmentsContent = () => {
  const params = useSearchParams();
  const doctorId = params.get("doctorId")?.trim() || "";
  const hospitalId = params.get("hospitalId")?.trim() || "";

  const [user, setUser] = useState<User | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [queueMap, setQueueMap] = useState<Record<string, QueueData>>({});
  const [doctorTimeMap, setDoctorTimeMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [date, setDate] = useState(getToday());
  const [symptoms, setSymptoms] = useState("");

  const validateContext = () => {
    if (doctorId && hospitalId) {
      toast.error("Invalid booking link. Choose either doctor or hospital.");
      return false;
    }
    if (!doctorId && !hospitalId) {
      return false;
    }
    return true;
  };

  const loadAll = useCallback(async () => {
    try {
      setLoading(true);
      const meRes = await fetch("/api/users/me", { credentials: "include" });
      if (!meRes.ok) {
        throw new Error("Please login first.");
      }
      const meData = await meRes.json();
      const currentUser = meData.user as User;
      setUser(currentUser);

      const appointmentsRes = await fetch("/api/appointments", { credentials: "include" });
      if (!appointmentsRes.ok) {
        const errData = await appointmentsRes.json().catch(() => ({}));
        throw new Error(errData?.error || "Failed to load appointments.");
      }
      const appointmentsData = await appointmentsRes.json();
      const items = (appointmentsData.appointments || []) as Appointment[];
      setAppointments(items);

      if (currentUser.role === "patient") {
        const active = items.filter((item) => item.status === "accepted" || item.status === "in_progress");
        const responses = await Promise.all(
          active.map(async (item) => {
            const url = `/api/appointments/queue?hospitalId=${item.hospitalId}&appointmentId=${item.id}&date=${item.appointmentDate}`;
            const res = await fetch(url, { credentials: "include" });
            if (!res.ok) return null;
            const data = await res.json();
            return { id: item.id, queue: data.queue as QueueData };
          })
        );
        const nextMap: Record<string, QueueData> = {};
        responses.forEach((entry) => {
          if (entry) nextMap[entry.id] = entry.queue;
        });
        setQueueMap(nextMap);
      } else {
        setQueueMap({});
      }
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const onBook = async () => {
    if (!validateContext()) {
      toast.error("Open booking from a doctor or hospital page.");
      return;
    }
    if (date < getToday()) {
      toast.error("Past date booking is not allowed.");
      return;
    }

    try {
      setBooking(true);
      const payload = {
        doctorId: doctorId || undefined,
        hospitalId: hospitalId || undefined,
        appointmentDate: date,
        symptoms,
      };

      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data?.error || "Booking failed.");
        return;
      }

      toast.success("Appointment request sent.");
      setSymptoms("");
      await loadAll();
    } catch {
      toast.error("Booking failed.");
    } finally {
      setBooking(false);
    }
  };

  const onDoctorStatusUpdate = async (appointmentId: string, status: AppointmentStatus) => {
    const scheduledTime = doctorTimeMap[appointmentId]?.trim() || "";
    if (status === "accepted" && !scheduledTime) {
      toast.error("Set time before accepting.");
      return;
    }
    const res = await fetch(`/api/appointments/${appointmentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ status, scheduledTime }),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data?.error || "Failed to update.");
      return;
    }
    toast.success(data.message || "Updated.");
    await loadAll();
  };

  const groupedByHospital = useMemo(
    () =>
      appointments.reduce<Record<string, Appointment[]>>((acc, item) => {
        if (!acc[item.hospitalName]) acc[item.hospitalName] = [];
        acc[item.hospitalName].push(item);
        return acc;
      }, {}),
    [appointments]
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 pb-16 pt-12">
      <div className="relative mx-auto max-w-6xl space-y-6 px-4 sm:px-6 lg:px-8">
        {user?.role === "patient" && (
          <div className="rounded-2xl border border-white/15 bg-white/8 p-5 backdrop-blur-xl">
            <p className="mb-3 text-sm font-semibold text-cyan-200">
              {doctorId ? "Booking for selected doctor" : hospitalId ? "Booking for selected hospital" : "Open from doctor or hospital page"}
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              <input
                type="date"
                min={getToday()}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="rounded-xl border border-cyan-100/30 bg-slate-900/60 px-4 py-3 text-slate-100 outline-none"
              />
              <textarea
                rows={2}
                placeholder="Symptoms (optional)"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                className="rounded-xl border border-cyan-100/30 bg-slate-900/60 px-4 py-3 text-slate-100 outline-none"
              />
              <button
                onClick={onBook}
                disabled={booking || (!doctorId && !hospitalId) || Boolean(doctorId && hospitalId)}
                className="rounded-xl bg-cyan-400 px-4 py-3 font-bold text-slate-950 transition hover:bg-cyan-300 disabled:opacity-60"
              >
                {booking ? "Submitting..." : "Request appointment"}
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <p className="text-slate-300">Loading appointments...</p>
        ) : (
          Object.entries(groupedByHospital).map(([hospitalName, items]) => (
            <div key={hospitalName} className="rounded-2xl border border-white/15 bg-white/8 p-5 shadow-xl backdrop-blur-xl">
              <h2 className="text-xl font-bold text-cyan-100">{hospitalName}</h2>
              <div className="mt-4 space-y-3">
                {items.map((item) => {
                  const queue = queueMap[item.id];
                  return (
                    <div key={item.id} className="rounded-xl border border-white/10 bg-slate-900/40 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-white">Queue #{item.queueNumber} {item.doctorName ? `• Dr. ${item.doctorName}` : ""}</p>
                        <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusClassMap[item.status]}`}>
                          {item.status.replace("_", " ")}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-300">
                        Date: {item.appointmentDate}{item.scheduledTime ? ` • Time: ${item.scheduledTime}` : ""}{item.patientName ? ` • Patient: ${item.patientName}` : ""}
                      </p>

                      {user?.role === "patient" && queue && (
                        <p className="mt-2 text-xs text-cyan-100">Ahead: {queue.peopleAhead} • Wait: {queue.estimatedWaitMinutes} min • Left: {queue.peopleLeft}</p>
                      )}

                      {user?.role === "doctor" && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {item.status === "pending" && (
                            <>
                              <input
                                type="time"
                                value={doctorTimeMap[item.id] || item.scheduledTime || ""}
                                onChange={(e) => setDoctorTimeMap((prev) => ({ ...prev, [item.id]: e.target.value }))}
                                className="rounded-lg border border-cyan-200/30 bg-slate-900/60 px-3 py-1 text-xs text-cyan-100 outline-none"
                              />
                              <button onClick={() => onDoctorStatusUpdate(item.id, "accepted")} className="rounded-lg border border-cyan-200/40 px-3 py-1 text-xs font-semibold text-cyan-100">Accept</button>
                              <button onClick={() => onDoctorStatusUpdate(item.id, "rejected")} className="rounded-lg border border-rose-200/40 px-3 py-1 text-xs font-semibold text-rose-100">Reject</button>
                            </>
                          )}
                          {item.status === "accepted" && (
                            <>
                              <button onClick={() => onDoctorStatusUpdate(item.id, "in_progress")} className="rounded-lg border border-amber-200/40 px-3 py-1 text-xs font-semibold text-amber-100">In progress</button>
                              <button onClick={() => onDoctorStatusUpdate(item.id, "completed")} className="rounded-lg border border-emerald-200/40 px-3 py-1 text-xs font-semibold text-emerald-100">Complete</button>
                            </>
                          )}
                          {item.status === "in_progress" && (
                            <button onClick={() => onDoctorStatusUpdate(item.id, "completed")} className="rounded-lg border border-emerald-200/40 px-3 py-1 text-xs font-semibold text-emerald-100">Complete</button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const AppointmentsPage = () => (
  <Suspense fallback={<div className="min-h-screen bg-slate-950 p-8 text-slate-200">Loading...</div>}>
    <AppointmentsContent />
  </Suspense>
);

export default AppointmentsPage;
