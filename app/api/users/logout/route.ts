import { NextResponse } from "next/server";
import { connect } from "@/lib/dbconfig";


export async function POST() {
    await connect();
    try {
        const response = NextResponse.json({
            message: "Logged out successfully",
            status: 200,
        });

        // Clear userId cookie
        response.cookies.set("token", "", {
            httpOnly: true,
            maxAge: 0,
            path: "/",
        });

        return response;
    }
    catch (error: unknown) {
        const message = error instanceof Error
            ? error.message
            : "An error occurred while logging out";
        return NextResponse.json(
            { error: message },
            { status: 500 }
        );
    }
}