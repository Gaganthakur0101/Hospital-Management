import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import { connect } from "@/lib/dbconfig";
import { getAuthUserFromRequest } from "@/lib/auth";
import Appointment from "@/models/appointmentModel";
import doctor from "@/models/doctorModel";
import hospital from "@/models/hospitals";
import Notification from "@/models/notificationModel";
import User from "@/models/userModel";

const ALLOWED_STATUS = new Set(["accepted", "in_progress", "completed", "cancelled", "rejected"]);

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connect();

  const authUser = getAuthUserFromRequest(request);
  if (!authUser?.id) {
    return NextResponse.json({ error: "Unauthorized. Please login." }, { status: 401 });
  }

  const user = await User.findById(authUser.id);
  if (!user || user.role !== "doctor") {
    return NextResponse.json({ error: "Only doctors can update queue." }, { status: 403 });
  }

  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid appointment id." }, { status: 400 });
    }

    const body = await request.json();
    const nextStatus = (body?.status as string | undefined)?.trim();
    const scheduledTime = ((body?.scheduledTime as string | undefined) || "").trim();

    if (!nextStatus || !ALLOWED_STATUS.has(nextStatus)) {
      return NextResponse.json({ error: "Invalid status value." }, { status: 400 });
    }

    if (nextStatus === "accepted" && !scheduledTime) {
      return NextResponse.json({ error: "Scheduled time is required when accepting appointment." }, { status: 400 });
    }

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return NextResponse.json({ error: "Appointment not found." }, { status: 404 });
    }

    const myHospitals = await hospital.find({ doctor: user._id }).select("_id");
    const allowedHospitalIds = new Set(myHospitals.map((item) => item._id.toString()));

    if (appointment.hospital && !allowedHospitalIds.has(appointment.hospital.toString())) {
      return NextResponse.json({ error: "You can only update your hospitals queue." }, { status: 403 });
    }

    if (!appointment.hospital && appointment.doctor) {
      const doctorProfile = await doctor.findById(appointment.doctor).select("user email");
      const doctorUserByEmail = doctorProfile?.email
        ? await User.findOne({ email: doctorProfile.email }).select("_id")
        : null;

      const doctorUserId = doctorProfile?.user || doctorUserByEmail?._id || null;
      const normalizedDoctorUserId =
        typeof doctorUserId === "string"
          ? doctorUserId
          : doctorUserId?.toString?.();

      if (!normalizedDoctorUserId || normalizedDoctorUserId !== user._id.toString()) {
        return NextResponse.json({ error: "You can only update your own doctor queue." }, { status: 403 });
      }
    }

    appointment.status = nextStatus;
    if (scheduledTime) {
      appointment.scheduledTime = scheduledTime;
    }
    await appointment.save();

    await Notification.create({
      user: appointment.patient,
      title: "Appointment updated",
      message:
        nextStatus === "accepted"
          ? `Doctor accepted your appointment. Scheduled time: ${scheduledTime}.`
          : `Doctor updated your appointment status to ${nextStatus.replace("_", " ")}.`,
      type: "appointment_update",
      appointment: appointment._id,
    });

    return NextResponse.json({ message: "Queue updated successfully." }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
