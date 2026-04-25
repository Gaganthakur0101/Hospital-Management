import { NextRequest, NextResponse } from "next/server";
import doctor from "@/models/doctorModel";
import hospital from "@/models/hospitals"; // Import hospital model
import { connect } from "@/lib/dbconfig";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    await connect();

    try {
        const { id } = await params;
        const doctorData = await doctor.findById(id).lean();

        if (!doctorData) {
            return NextResponse.json({ message: "Doctor not found" }, { status: 404 });
        }

        // Fetch hospitals associated with this doctor's user ID
        let hospitals: any[] = [];
        if (doctorData.user) {
            hospitals = await hospital.find({ doctor: doctorData.user }).lean();
        }

        return NextResponse.json({ ...doctorData, hospitals }, { status: 200 });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Something went wrong";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    await connect();

    try {
        const { id } = await params;
        const doctorData = await doctor.findById(id);
        if (!doctorData) {
            return NextResponse.json({message: "Doctor not found"}, {status: 404});
        }
        const updatedData = await request.json();
        const updatedDoctor = await doctor.findByIdAndUpdate(id, updatedData, {new: true});
        return NextResponse.json(updatedDoctor, {status: 200});
    } catch (error) {
        console.error("Error updating doctor data:", error);
        return NextResponse.json({message: "Internal Server Error"}, {status: 500});
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    await connect();

    try {
        const { id } = await params;
        const doctorData = await doctor.findById(id);
        if (!doctorData) {
            return NextResponse.json({message: "Doctor not found"}, {status: 404});
        }
        await doctor.findByIdAndDelete(id);
        return NextResponse.json({message: "Doctor deleted successfully"}, {status: 200});
    } catch (error) {
        console.error("Error deleting doctor data:", error);
        return NextResponse.json({message: "Internal Server Error"}, {status: 500});
    }
}
