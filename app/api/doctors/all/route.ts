import {NextRequest , NextResponse} from "next/server";
import doctor from "@/models/doctorModel";

export async function GET(request: NextRequest) {
    try {
        const doctorData = await doctor.find();
        return NextResponse.json(doctorData, {status: 200});
    } catch (error) {
        console.error("Error fetching doctor data:", error);
        return NextResponse.json({message: "Internal Server Error"}, {status: 500});
    }
}