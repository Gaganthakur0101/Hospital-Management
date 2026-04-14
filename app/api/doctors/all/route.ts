import { NextResponse } from "next/server";
import doctor from "@/models/doctorModel";
import { connect } from "@/lib/dbconfig";

export async function GET() {
    await connect();
    try {
        const doctorData = await doctor.find();
        return NextResponse.json(doctorData, {status: 200});
    } catch (error) {
        console.error("Error fetching doctor data:", error);
        return NextResponse.json({message: "Internal Server Error"}, {status: 500});
    }
}
