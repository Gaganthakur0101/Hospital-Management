import { NextRequest, NextResponse } from "next/server";
import hospital from "@/models/hospitals";
import User from "@/models/userModel";
import { connect } from "@/lib/dbconfig";
import jwt from "jsonwebtoken";

type AuthTokenPayload = jwt.JwtPayload & {
  id: string;
  role?: string;
};

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

    const newHospital = await hospital.create({
      ...body,
      doctor: user._id,
    });

    return NextResponse.json(
      { message: "Hospital registered successfully", data: newHospital },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}