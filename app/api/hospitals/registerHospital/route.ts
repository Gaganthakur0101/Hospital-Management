import { NextRequest, NextResponse } from "next/server";
import hospital from "@/models/hospitals";
import User from "@/models/userModel";
import { connect } from "@/lib/dbconfig";
import jwt from "jsonwebtoken";

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

    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    );

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
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}