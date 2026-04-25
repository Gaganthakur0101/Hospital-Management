import { NextRequest, NextResponse } from "next/server";
import hospital from "@/models/hospitals";
import User from "@/models/userModel";
import { connect } from "@/lib/dbconfig";
import jwt from "jsonwebtoken";

type AuthTokenPayload = jwt.JwtPayload & { id: string };

export async function GET(request: NextRequest) {
  await connect();

  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized. Please login." }, { status: 401 });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as AuthTokenPayload;

    if (!decoded?.id) {
      return NextResponse.json({ error: "Invalid token." }, { status: 401 });
    }

    const user = await User.findById(decoded.id);
    if (!user || user.role !== "doctor") {
      return NextResponse.json(
        { error: "Only doctors can access this resource." },
        { status: 403 }
      );
    }

    const hospitals = await hospital
      .find({ doctor: user._id })
      .sort({ createdAt: -1 });

    return NextResponse.json(hospitals, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
