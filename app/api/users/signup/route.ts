import { connect } from "@/lib/dbconfig";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    await connect();
    try {
        const reqBody = await request.json();
        const { name, email, password, confirmPassword, role } = reqBody;

        // Validation
        if (!name || !email || !password || !confirmPassword || !role) {
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


        // Create new user (password will be hashed by the pre-save hook)

        // const salt = await bcrypt.genSalt(10);
        // const hashedPassword = await bcrypt.hash(password, salt);

        // const newUser = new User({
        //     name,
        //     email,
        //     password : hashedPassword,
        // });

        // const savedUser = await newUser.save();
        // console.log("Saved user:", savedUser);
        // return NextResponse.json(
        //     { message: "Account created successfully" },
        //     { status: 201 }
        // );

        const newUser = new User({
            name,
            email,
            password,
            role,
        });

        await newUser.save();

        const response = NextResponse.json(
            { message: "Account created successfully" },
            { status: 201 }
        );

        // Set userId cookie (valid for 7 days)
        response.cookies.set("userId", newUser._id.toString(), {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
            secure: process.env.NODE_ENV === "production",
            path: "/",
        });

        return response;

    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}