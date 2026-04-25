import { NextRequest, NextResponse } from "next/server";

interface PostOffice {
    Name: string;
    District: string;
    State: string;
    Country: string;
    Pincode: string;
}

interface PincodeResponse {
    Message: string;
    Status: string;
    PostOffice: PostOffice[] | null;
}

export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ pin: string }> }
) {
    try {
        const { pin } = await params;

        if (!/^\d{6}$/.test(pin)) {
            return NextResponse.json({ error: "Invalid pincode" }, { status: 400 });
        }

        const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`, {
            // Cache each pincode for 7 days — postal data barely changes
            next: { revalidate: 604800 },
        });

        if (!res.ok) {
            return NextResponse.json({ error: "Failed to fetch pincode data" }, { status: res.status });
        }

        const data: PincodeResponse[] = await res.json();
        const result = data?.[0];

        if (result?.Status !== "Success" || !result?.PostOffice?.length) {
            return NextResponse.json({ error: "Pincode not found" }, { status: 404 });
        }

        const postOffice = result.PostOffice[0];

        return NextResponse.json(
            {
                state: postOffice.State,
                district: postOffice.District,
                pincode: postOffice.Pincode,
            },
            { status: 200 }
        );
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Something went wrong";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
