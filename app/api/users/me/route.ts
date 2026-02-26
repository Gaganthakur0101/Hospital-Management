import { connect } from "@/lib/dbconfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

type AuthTokenPayload = jwt.JwtPayload & {
    id?: string;
};

export async function GET(request: NextRequest) {
    await connect();

    try {
        // Get userId from cookie
        const checkingToken = request.cookies.get("token")?.value;

        if (!checkingToken) {
            return NextResponse.json(
                { message: "Not authenticated" },
                { status: 401 }
            );
        }

        // Verify token
        const decodedToken = jwt.verify(
            checkingToken,
            process.env.JWT_SECRET as string
        ) as AuthTokenPayload;

        if (!decodedToken.id) {
            return NextResponse.json(
                { message: "Invalid token" },
                { status: 401 }
            );
        }
        
        // Find user from database
        const user = await User.findById(decodedToken.id);

        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                user: {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            },
            { status: 200 }
        );
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Something went wrong";
        return NextResponse.json(
            { error: message },
            { status: 500 }
        );
    }
}
