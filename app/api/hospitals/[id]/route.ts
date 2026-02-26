import { NextRequest, NextResponse } from "next/server";
import hospital from "@/models/hospitals";
import { connect } from "@/lib/dbconfig";

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    await connect();

    try {
        const { id } = await params;
        const body = await request.json();

        const existingHospital = await hospital.findById(id);

        if (!existingHospital) {
            return NextResponse.json(
                { message: "Hospital not found" },
                { status: 404 }
            );
        }

        const updatedHospital = await hospital.findByIdAndUpdate(
            id,
            body,
            { new: true }
        );

        return NextResponse.json(updatedHospital, { status: 200 });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Something went wrong";
        return NextResponse.json(
            { error: message },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    await connect();

    try {
        const { id } = await params;
        const existingHospital = await hospital.findById(id);

        if (!existingHospital) {
            return NextResponse.json(
                { message: "Hospital not found" },
                { status: 404 }
            );
        }

        await hospital.findByIdAndDelete(id);

        return NextResponse.json(
            { message: "Hospital deleted successfully" },
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
