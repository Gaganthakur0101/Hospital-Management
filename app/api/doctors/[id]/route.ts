import {NextRequest , NextResponse} from "next/server";
import doctor from "@/models/doctorModel";

export async function PUT(request: NextRequest, {params} : {params : {id : string}}) {
    try {
        const doctorData = await doctor.findById(params.id);
        if (!doctorData) {
            return NextResponse.json({message: "Doctor not found"}, {status: 404});
        }
        const updatedData = await request.json();
        const updatedDoctor = await doctor.findByIdAndUpdate(params.id, updatedData, {new: true});
        return NextResponse.json(updatedDoctor, {status: 200});
    } catch (error) {
        console.error("Error updating doctor data:", error);
        return NextResponse.json({message: "Internal Server Error"}, {status: 500});
    }
}

export async function DELETE(request: NextRequest, {params} : {params : {id : string}}) {
    try {
        const doctorData = await doctor.findById(params.id);
        if (!doctorData) {
            return NextResponse.json({message: "Doctor not found"}, {status: 404});
        }
        await doctor.findByIdAndDelete(params.id);
        return NextResponse.json({message: "Doctor deleted successfully"}, {status: 200});
    } catch (error) {
        console.error("Error deleting doctor data:", error);
        return NextResponse.json({message: "Internal Server Error"}, {status: 500});
    }
}
