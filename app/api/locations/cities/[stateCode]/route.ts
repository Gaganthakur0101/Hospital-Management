import { NextRequest, NextResponse } from "next/server";

const CSC_BASE = "https://api.countrystatecity.in/v1";

export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ stateCode: string }> }
) {
    const apiKey = process.env.COUNTRY_STATE_CITY_API_KEY;
    if (!apiKey) {
        return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    try {
        const { stateCode } = await params;

        const res = await fetch(
            `${CSC_BASE}/countries/IN/states/${stateCode}/cities`,
            {
                headers: { "X-CSCAPI-KEY": apiKey },
                // Cache per-state for 24 hours
                next: { revalidate: 86400 },
            }
        );

        if (!res.ok) {
            return NextResponse.json(
                { error: "Failed to fetch cities" },
                { status: res.status }
            );
        }

        const data = await res.json();

        const cities = (data as Array<{ name: string }>)
            .map((c) => c.name)
            .sort((a, b) => a.localeCompare(b));

        return NextResponse.json(cities, { status: 200 });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Something went wrong";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
