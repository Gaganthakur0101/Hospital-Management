import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import { connect } from "@/lib/dbconfig";
import doctor from "@/models/doctorModel";
import User from "@/models/userModel";

type AuthTokenPayload = jwt.JwtPayload & {
    id: string;
    role?: string;
};

type DoctorPayload = {
    doctorName?: string;
    gender?: string;
    specialization?: string;
    experience?: number;
    fees?: number;
    email?: string;
    phone?: string;
    medicalLicenseNumber?: string;
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
                { error: "Only doctors can register doctor profiles." },
                { status: 403 }
            );
        }

        const body = (await request.json()) as DoctorPayload;

        const doctorName = body.doctorName?.trim() || "";
        const gender = body.gender?.trim() || "";
        const specialization = body.specialization?.trim() || "";
        const email = body.email?.trim().toLowerCase() || "";
        const phone = body.phone?.trim() || "";
        const medicalLicenseNumber = body.medicalLicenseNumber?.trim() || "";
        const experience = Number(body.experience);
        const fees = Number(body.fees);

        if (
            !doctorName ||
            !gender ||
            !specialization ||
            !email ||
            !phone ||
            !medicalLicenseNumber
        ) {
            return NextResponse.json(
                { error: "Please fill in all required fields." },
                { status: 400 }
            );
        }

        if (!["Male", "Female", "Other"].includes(gender)) {
            return NextResponse.json(
                { error: "Gender must be Male, Female, or Other." },
                { status: 400 }
            );
        }

        if (Number.isNaN(experience) || experience < 0) {
            return NextResponse.json(
                { error: "Experience must be a valid non-negative number." },
                { status: 400 }
            );
        }

        if (Number.isNaN(fees) || fees < 0) {
            return NextResponse.json(
                { error: "Fees must be a valid non-negative number." },
                { status: 400 }
            );
        }

        const existingDoctor = await doctor.findOne({
            $or: [{ email }, { medicalLicenseNumber }],
        });

        if (existingDoctor) {
            if (existingDoctor.email === email) {
                return NextResponse.json(
                    { error: "A doctor profile with this email already exists." },
                    { status: 409 }
                );
            }

            return NextResponse.json(
                { error: "A doctor profile with this medical license number already exists." },
                { status: 409 }
            );
        }

        const newDoctor = await doctor.create({
            doctorName,
            gender,
            specialization,
            experience,
            fees,
            email,
            phone,
            medicalLicenseNumber,
        });

        return NextResponse.json(
            { message: "Doctor registered successfully", data: newDoctor },
            { status: 201 }
        );
    } catch (error: unknown) {
        if (error instanceof jwt.JsonWebTokenError) {
            return NextResponse.json(
                { error: "Invalid token" },
                { status: 401 }
            );
        }

        const message = error instanceof Error ? error.message : "Something went wrong";

        return NextResponse.json(
            { error: message },
            { status: 500 }
        );
    }
}