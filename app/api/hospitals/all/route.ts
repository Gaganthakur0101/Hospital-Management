import { NextRequest, NextResponse } from "next/server";
import hospital from "@/models/hospitals";
import { connect } from "@/lib/dbconfig";


export async function GET() {
    await connect();

    try {
        const hospitals = await hospital.find();

        return NextResponse.json(hospitals, { status: 200 });

    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    await connect();

    try {
        const body = await request.json();

        const existingHospital = await hospital.findById(params.id);

        if (!existingHospital) {
            return NextResponse.json(
                { message: "Hospital not found" },
                { status: 404 }
            );
        }

        const updatedHospital = await hospital.findByIdAndUpdate(
            params.id,
            body,
            { new: true }
        );

        return NextResponse.json(updatedHospital, { status: 200 });

    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}


export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    await connect();

    try {
        const existingHospital = await hospital.findById(params.id);

        if (!existingHospital) {
            return NextResponse.json(
                { message: "Hospital not found" },
                { status: 404 }
            );
        }

        await hospital.findByIdAndDelete(params.id);

        return NextResponse.json(
            { message: "Hospital deleted successfully" },
            { status: 200 }
        );

    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}