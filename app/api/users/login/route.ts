import { connect } from "@/lib/dbconfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
    await connect();

    try {
        const reqBody = await request.json();
        const { email, password } = reqBody;

        const check = await User.findOne({ email });

        if (!check) {
            return NextResponse.json(
                { message: "Email doesn't exist" },
                { status: 400 }
            );
        }

        const isMatch = await bcrypt.compare(password, check.password);

        if (!isMatch) {
            return NextResponse.json(
                { message: "Invalid password" },
                { status: 400 }
            );
        }

        // generating jwt token 

        const generatedToken = jwt.sign(
            {
                id: check._id.toString(),
                role: check.role,
            },
            process.env.JWT_SECRET as string,
            { expiresIn: "7d" }
        )

        const response = NextResponse.json(
            {
                message: "Login successful",
                user: {
                    id: check._id.toString(),
                    name: check.name,
                    email: check.email,
                    role: check.role,
                },
            },
            { status: 200 }
        );

        response.cookies.set("token", generatedToken,{
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60,
            secure: process.env.NODE_ENV === "production",
            path: "/",
        });

        return response;

    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Something went wrong";
        return NextResponse.json(
            { error: message },
            { status: 500 }
        );
    }
}