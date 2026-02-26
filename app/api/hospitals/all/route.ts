import { NextResponse } from "next/server";
import hospital from "@/models/hospitals";
import { connect } from "@/lib/dbconfig";


export async function GET() {
    await connect();

    try {
        const hospitals = await hospital.find();

        return NextResponse.json(hospitals, { status: 200 });

    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Something went wrong";
        return NextResponse.json(
            { error: message },
            { status: 500 }
        );
    }
}