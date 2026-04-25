import { NextRequest, NextResponse } from "next/server";
import hospital from "@/models/hospitals";
import User from "@/models/userModel";
import { connect } from "@/lib/dbconfig";
import jwt from "jsonwebtoken";

type AuthTokenPayload = jwt.JwtPayload & {
  id: string;
  role?: string;
};

interface ScheduleEntry {
  specialization: string;
  days: string[];
  startTime: string;
  endTime: string;
}

export async function POST(request: NextRequest) {
  await connect();

  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized. Please login." },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as AuthTokenPayload;

    if (!decoded?.id) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    const user = await User.findById(decoded.id);

    if (!user || user.role !== "doctor") {
      return NextResponse.json(
        { error: "Only doctors can register hospitals." },
        { status: 403 }
      );
    }

    const body = await request.json();

    const imageList = Array.isArray(body.images)
      ? body.images.filter(
          (item: unknown): item is string =>
            typeof item === "string" && item.trim().length > 0
        )
      : [];

    // Accept doctorSchedules array; derive specialities from schedule names
    const doctorSchedules: ScheduleEntry[] = Array.isArray(body.doctorSchedules)
      ? body.doctorSchedules.filter(
          (s: unknown): s is ScheduleEntry =>
            typeof s === "object" &&
            s !== null &&
            typeof (s as ScheduleEntry).specialization === "string" &&
            (s as ScheduleEntry).specialization.trim().length > 0
        )
      : [];

    // Derive flat specialities list from schedule for backward compat
    const derivedSpecialities = doctorSchedules.length > 0
      ? [...new Set(doctorSchedules.map((s) => s.specialization.trim()))]
      : Array.isArray(body.specialities)
        ? body.specialities
        : typeof body.specialities === "string"
          ? body.specialities
              .split(",")
              .map((s: string) => s.trim())
              .filter(Boolean)
          : [];

    const newHospital = await hospital.create({
      ...body,
      images: imageList,
      doctorSchedules,
      specialities: derivedSpecialities,
      doctor: user._id,
    });

    return NextResponse.json(
      { message: "Hospital registered successfully", data: newHospital },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
