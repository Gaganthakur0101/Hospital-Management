import {NextRequest , NextResponse} from "next/server";
import doctor from "@/models/doctorModel";

export async function GET(request: NextRequest, {params} : {params : {id : string}}) {
    try {
        const doctorData = await doctor.findById(params.id);
        if (!doctorData) {
            return NextResponse.json({message: "Doctor not found"}, {status: 404});
        }
        return NextResponse.json(doctorData, {status: 200});
    } catch (error) {
        console.error("Error fetching doctor data:", error);
        return NextResponse.json({message: "Internal Server Error"}, {status: 500});
    }
}