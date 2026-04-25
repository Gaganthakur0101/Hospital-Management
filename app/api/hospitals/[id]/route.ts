import { NextRequest, NextResponse } from "next/server";
import hospital from "@/models/hospitals";
import User from "@/models/userModel";
import { connect } from "@/lib/dbconfig";
import jwt from "jsonwebtoken";

type AuthTokenPayload = jwt.JwtPayload & {
  id: string;
  role?: string;
};

/** Resolve the current user from the request cookie. Returns null if not authenticated. */
async function getCurrentUser(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as AuthTokenPayload;
    if (!decoded?.id) return null;
    return await User.findById(decoded.id);
  } catch {
    return null;
  }
}

// ─── GET /api/hospitals/[id] ─────────────────────────────────────────────────

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connect();
  try {
    const { id } = await params;
    const hospitalData = await hospital.findById(id);
    if (!hospitalData) {
      return NextResponse.json({ message: "Hospital not found" }, { status: 404 });
    }
    return NextResponse.json(hospitalData, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ─── PUT /api/hospitals/[id] ─────────────────────────────────────────────────

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connect();
  try {
    const { id } = await params;

    // Ownership check — only the doctor who created this hospital can edit it
    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized. Please login." }, { status: 401 });
    }

    const existingHospital = await hospital.findById(id);
    if (!existingHospital) {
      return NextResponse.json({ message: "Hospital not found" }, { status: 404 });
    }

    if (existingHospital.doctor.toString() !== currentUser._id.toString()) {
      return NextResponse.json(
        { error: "You are not authorized to edit this hospital." },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Re-derive specialities from doctorSchedules if provided
    if (Array.isArray(body.doctorSchedules) && body.doctorSchedules.length > 0) {
      body.specialities = [
        ...new Set(
          body.doctorSchedules
            .map((s: { specialization?: string }) => s.specialization?.trim())
            .filter(Boolean)
        ),
      ];
    }

    const updatedHospital = await hospital.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json(updatedHospital, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ─── DELETE /api/hospitals/[id] ──────────────────────────────────────────────

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connect();
  try {
    const { id } = await params;

    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized. Please login." }, { status: 401 });
    }

    const existingHospital = await hospital.findById(id);
    if (!existingHospital) {
      return NextResponse.json({ message: "Hospital not found" }, { status: 404 });
    }

    if (existingHospital.doctor.toString() !== currentUser._id.toString()) {
      return NextResponse.json(
        { error: "You are not authorized to delete this hospital." },
        { status: 403 }
      );
    }

    await hospital.findByIdAndDelete(id);
    return NextResponse.json({ message: "Hospital deleted successfully" }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
