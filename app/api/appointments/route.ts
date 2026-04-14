import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/lib/dbconfig";
import { getAuthUserFromRequest } from "@/lib/auth";
import Appointment from "@/models/appointmentModel";
import hospital from "@/models/hospitals";
import doctor from "@/models/doctorModel";
import Notification from "@/models/notificationModel";
import User from "@/models/userModel";

const formatDateKey = (date: Date) => {
  const year = date.getUTCFullYear();
  const month = `${date.getUTCMonth() + 1}`.padStart(2, "0");
  const day = `${date.getUTCDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getDayBounds = (dateText: string) => {
  const date = new Date(dateText);
  const start = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0, 0));
  const end = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 23, 59, 59, 999));
  return { start, end };
};

export async function POST(request: NextRequest) {
  await connect();

  try {
    const authUser = getAuthUserFromRequest(request);
    if (!authUser?.id) {
      return NextResponse.json({ error: "Unauthorized. Please login." }, { status: 401 });
    }

    const user = await User.findById(authUser.id);
    if (!user || user.role !== "patient") {
      return NextResponse.json({ error: "Only patients can book appointments." }, { status: 403 });
    }

    const body = await request.json();
    const doctorIdRaw = (body?.doctorId as string | undefined)?.trim();
    const hospitalIdRaw = (body?.hospitalId as string | undefined)?.trim();
    const appointmentDateRaw = (body?.appointmentDate as string | undefined)?.trim();
    const symptoms = ((body?.symptoms as string | undefined) || "").trim();

    if (!appointmentDateRaw) {
      return NextResponse.json({ error: "Appointment date is required." }, { status: 400 });
    }

    if ((!doctorIdRaw && !hospitalIdRaw) || (doctorIdRaw && hospitalIdRaw)) {
      return NextResponse.json(
        { error: "Choose either doctor or hospital for booking." },
        { status: 400 }
      );
    }

    if (doctorIdRaw && !/^[a-f\d]{24}$/i.test(doctorIdRaw)) {
      return NextResponse.json({ error: "Invalid doctor id." }, { status: 400 });
    }
    if (hospitalIdRaw && !/^[a-f\d]{24}$/i.test(hospitalIdRaw)) {
      return NextResponse.json({ error: "Invalid hospital id." }, { status: 400 });
    }

    const appointmentDate = new Date(appointmentDateRaw);
    if (Number.isNaN(appointmentDate.getTime())) {
      return NextResponse.json({ error: "Invalid appointment date." }, { status: 400 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(appointmentDate);
    selectedDate.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      return NextResponse.json({ error: "Past date booking is not allowed." }, { status: 400 });
    }

    const { start, end } = getDayBounds(appointmentDateRaw);

    let created;
    let estimatedWaitMinutes = 0;

    if (doctorIdRaw) {
      const doctorData = await doctor.findById(doctorIdRaw).select("_id email user");
      if (!doctorData) {
        return NextResponse.json({ error: "Doctor not found." }, { status: 404 });
      }

      let doctorUser = doctorData.user ? await User.findById(doctorData.user).select("_id") : null;
      if (!doctorUser && doctorData.email) {
        doctorUser = await User.findOne({ email: doctorData.email }).select("_id");
      }
      if (doctorUser && doctorUser._id.toString() === user._id.toString()) {
        return NextResponse.json({ error: "You cannot book appointment with yourself." }, { status: 400 });
      }

      const bookingHospital = doctorUser
        ? await hospital.findOne({ doctor: doctorUser._id }).select("_id avgConsultationMinutes")
        : null;

      const latest = await Appointment.findOne({
        doctor: doctorData._id,
        appointmentDate: { $gte: start, $lte: end },
      }).sort({ queueNumber: -1 }).select("queueNumber");

      const nextQueueNumber = (latest?.queueNumber ?? 0) + 1;
      estimatedWaitMinutes = Math.max(0, nextQueueNumber - 1) * (bookingHospital?.avgConsultationMinutes || 15);

      created = await Appointment.create({
        patient: user._id,
        hospital: bookingHospital?._id || null,
        doctor: doctorData._id,
        symptoms,
        appointmentDate,
        status: "pending",
        queueNumber: nextQueueNumber,
      });

      if (doctorUser) {
        await Notification.create({
          user: doctorUser._id,
          title: "New appointment request",
          message: `${user.name} requested appointment for ${formatDateKey(appointmentDate)}.`,
          type: "appointment_request",
          appointment: created._id,
        });
      }
    } else {
      const bookingHospital = await hospital.findById(hospitalIdRaw).select("_id doctor avgConsultationMinutes hospitalName");
      if (!bookingHospital) {
        return NextResponse.json({ error: "Hospital not found." }, { status: 404 });
      }

      if (bookingHospital.doctor.toString() === user._id.toString()) {
        return NextResponse.json({ error: "You cannot book your own hospital." }, { status: 400 });
      }

      const latest = await Appointment.findOne({
        hospital: bookingHospital._id,
        doctor: null,
        appointmentDate: { $gte: start, $lte: end },
      }).sort({ queueNumber: -1 }).select("queueNumber");

      const nextQueueNumber = (latest?.queueNumber ?? 0) + 1;
      estimatedWaitMinutes = Math.max(0, nextQueueNumber - 1) * (bookingHospital.avgConsultationMinutes || 15);

      created = await Appointment.create({
        patient: user._id,
        hospital: bookingHospital._id,
        doctor: null,
        symptoms,
        appointmentDate,
        status: "pending",
        queueNumber: nextQueueNumber,
      });

      await Notification.create({
        user: bookingHospital.doctor,
        title: "New hospital appointment request",
        message: `${user.name} requested appointment for ${bookingHospital.hospitalName} on ${formatDateKey(appointmentDate)}.`,
        type: "appointment_request",
        appointment: created._id,
      });
    }

    return NextResponse.json(
      {
        message: "Appointment booked successfully",
        appointment: {
          id: created._id.toString(),
          queueNumber: created.queueNumber,
          estimatedWaitMinutes,
          appointmentDate: formatDateKey(appointmentDate),
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  await connect();

  try {
    const authUser = getAuthUserFromRequest(request);
    if (!authUser?.id) {
      return NextResponse.json({ error: "Unauthorized. Please login." }, { status: 401 });
    }

    const user = await User.findById(authUser.id);
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const search = request.nextUrl.searchParams;
    const dateParam = search.get("date");
    const filters: Record<string, unknown> = {};

    if (dateParam) {
      const { start, end } = getDayBounds(dateParam);
      filters.appointmentDate = { $gte: start, $lte: end };
    }

    if (user.role === "patient") {
      filters.patient = user._id;
    } else if (user.role === "doctor") {
      const [hospitals, doctorProfiles] = await Promise.all([
        hospital.find({ doctor: user._id }).select("_id"),
        doctor.find({ $or: [{ user: user._id }, { email: user.email }] }).select("_id"),
      ]);

      const hospitalIds = hospitals.map((h) => h._id);
      const doctorIds = doctorProfiles.map((d) => d._id);

      filters.$or = [
        { hospital: { $in: hospitalIds } },
        { doctor: { $in: doctorIds } },
      ];
    }

    const appointments = await Appointment.find(filters)
      .sort({ createdAt: -1 })
      .populate("hospital", "hospitalName avgConsultationMinutes")
      .populate("doctor", "doctorName specialization")
      .populate("patient", "name email");

    const result = appointments.map((item) => {
      const hospitalData = item.hospital as unknown as { hospitalName?: string; avgConsultationMinutes?: number };
      const doctorData = item.doctor as unknown as { doctorName?: string; specialization?: string } | null;
      const patientData = item.patient as unknown as { name?: string; email?: string } | null;

      return {
        id: item._id.toString(),
        queueNumber: item.queueNumber,
        status: item.status,
        symptoms: item.symptoms,
        appointmentDate: formatDateKey(new Date(item.appointmentDate)),
        scheduledTime: item.scheduledTime || "",
        hospitalId: item.hospital?._id?.toString?.() || "",
        hospitalName: hospitalData?.hospitalName || "Unknown Hospital",
        doctorId: item.doctor?._id?.toString?.() || null,
        doctorName: doctorData?.doctorName || null,
        doctorSpecialization: doctorData?.specialization || null,
        patientId: item.patient?._id?.toString?.() || null,
        patientName: patientData?.name || null,
        patientEmail: patientData?.email || null,
        avgConsultationMinutes: hospitalData?.avgConsultationMinutes || 15,
      };
    });

    return NextResponse.json({ appointments: result }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
