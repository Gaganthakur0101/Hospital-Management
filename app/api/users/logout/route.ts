import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/lib/dbconfig";


export async function POST(request: NextRequest) {
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
    catch (error) {
        return NextResponse.json(
            { error: "An error occurred while logging out" },
            { status: 500 }
        );
    }
}