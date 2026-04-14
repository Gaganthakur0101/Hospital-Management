import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import { getAuthUserFromRequest } from "@/lib/auth";
import { connect } from "@/lib/dbconfig";
import Appointment from "@/models/appointmentModel";
import hospital from "@/models/hospitals";
import User from "@/models/userModel";

const getDayBounds = (dateText: string) => {
  const date = new Date(dateText);
  const start = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0, 0));
  const end = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 23, 59, 59, 999));
  return { start, end };
};

export async function GET(request: NextRequest) {
  await connect();

  try {
    const authUser = getAuthUserFromRequest(request);
    if (!authUser?.id) {
      return NextResponse.json({ error: "Unauthorized. Please login." }, { status: 401 });
    }

    const hospitalId = request.nextUrl.searchParams.get("hospitalId")?.trim();
    const appointmentId = request.nextUrl.searchParams.get("appointmentId")?.trim();
    const dateText = request.nextUrl.searchParams.get("date")?.trim();

    if (!hospitalId || !appointmentId || !dateText) {
      return NextResponse.json(
        { error: "hospitalId, appointmentId and date are required." },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(hospitalId) || !mongoose.Types.ObjectId.isValid(appointmentId)) {
      return NextResponse.json({ error: "Invalid id provided." }, { status: 400 });
    }

    const { start, end } = getDayBounds(dateText);

    const [hospitalData, appointmentData] = await Promise.all([
      hospital.findById(hospitalId).select("avgConsultationMinutes"),
      Appointment.findById(appointmentId).select("queueNumber status hospital doctor appointmentDate"),
    ]);

    if (!appointmentData) {
      return NextResponse.json({ error: "Queue data not found." }, { status: 404 });
    }

    if (!appointmentData.hospital || appointmentData.hospital.toString() !== hospitalId) {
      return NextResponse.json({ error: "Appointment does not belong to this hospital." }, { status: 400 });
    }

    const user = await User.findById(authUser.id).select("role");
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    if (user.role === "patient") {
      const ownerCheck = await Appointment.findOne({ _id: appointmentId, patient: authUser.id }).select("_id");
      if (!ownerCheck) {
        return NextResponse.json({ error: "Access denied for this queue item." }, { status: 403 });
      }
    } else if (user.role === "doctor") {
      const doctorHospital = await hospital.findOne({ _id: hospitalId, doctor: authUser.id }).select("_id");
      if (!doctorHospital) {
        return NextResponse.json({ error: "Access denied for this hospital queue." }, { status: 403 });
      }
    }

    const activeAhead = await Appointment.countDocuments({
      hospital: hospitalId,
      doctor: appointmentData.doctor,
      appointmentDate: { $gte: start, $lte: end },
      queueNumber: { $lt: appointmentData.queueNumber },
      status: { $in: ["accepted", "in_progress"] },
    });

    const totalPending = await Appointment.countDocuments({
      hospital: hospitalId,
      doctor: appointmentData.doctor,
      appointmentDate: { $gte: start, $lte: end },
      status: { $in: ["accepted", "in_progress"] },
    });

    const avgConsultationMinutes = hospitalData?.avgConsultationMinutes || 15;
    const estimatedWaitMinutes = activeAhead * avgConsultationMinutes;

    return NextResponse.json(
      {
        queue: {
          queueNumber: appointmentData.queueNumber,
          status: appointmentData.status,
          peopleAhead: appointmentData.status === "accepted" || appointmentData.status === "in_progress" ? activeAhead : 0,
          peopleLeft: totalPending,
          estimatedWaitMinutes: appointmentData.status === "accepted" || appointmentData.status === "in_progress" ? estimatedWaitMinutes : 0,
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
