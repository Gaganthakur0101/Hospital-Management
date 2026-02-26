import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { connect } from "@/lib/dbconfig";

export async function POST(req: NextRequest) {
    await connect();

    try {
        const res = await req.json();
        const { email } = res;

        const check = await User.findOne({email});

        if (!check) {
            return NextResponse.json(
                { message: "email doesn't exsist" },
                { status: 400 },
            )
        } else {
            return NextResponse.json(
                { message: "OTP sent to your email" },
                { status: 200 },
            )
        }



    } catch (error: unknown) {
        const message = error instanceof Error
            ? error.message
            : "Something went wrong try again later";
        return NextResponse.json(
            { message },
            { status: 400 },
        )
    }
}