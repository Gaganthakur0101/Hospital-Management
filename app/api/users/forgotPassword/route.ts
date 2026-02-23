import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { connect } from "@/lib/dbconfig";

export async function POST(req: NextRequest) {
    await connect();

    try {
        const res = await req.json();
        const { email } = res;

        const check = await User.findOne({email});

        if (!check) {
            return NextResponse.json(
                { message: "email doesn't exsist" },
                { status: 400 },
            )
        } else {
            
        }



    } catch (error: any) {
        return NextResponse.json(
            { message: "Something went wrong try again later" },
            { status: 400 },
        )
    }
}