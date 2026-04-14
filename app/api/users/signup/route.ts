import { connect } from "@/lib/dbconfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
    await connect();
    try {
        const reqBody = await request.json();
        const name = String(reqBody?.name || "").trim();
        const email = String(reqBody?.email || "").trim().toLowerCase();
        const password = String(reqBody?.password || "");
        const confirmPassword = String(reqBody?.confirmPassword || "");
        const role = String(reqBody?.role || "").trim();
        const state = String(reqBody?.state || "").trim();
        const city = String(reqBody?.city || "").trim();

        // Validation
        if (!name || !email || !password || !confirmPassword || !role || !state || !city) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 }
            );
        }


        if (email.indexOf("@") === -1) {
            return NextResponse.json(
                { error: "Please enter a valid email" },
                { status: 400 }
            );
        }

        if (password !== confirmPassword) {
            return NextResponse.json(
                { error: "Passwords do not match" },
                { status: 400 }
            );
        }

        // Check if user already exists
        const check = await User.findOne({ email });

        if (check) {
            return NextResponse.json(
                { error: "User already exists with this email" },
                { status: 400 }
            );
        }


        const newUser = new User({
            name,
            email,
            password,
            role,
            state,
            city
        });

        await newUser.save();

        const response = NextResponse.json(
            { message: "Account created successfully" },
            { status: 201 }
        );

        const generatedToken = jwt.sign(
            {
                id: newUser._id.toString(),
                role: newUser.role,
            },
            process.env.JWT_SECRET as string,
            { expiresIn: "7d" }
        );

        response.cookies.set("token", generatedToken, {
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
