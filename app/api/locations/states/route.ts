import { NextResponse } from "next/server";

const CSC_BASE = "https://api.countrystatecity.in/v1";

export async function GET() {
    const apiKey = process.env.COUNTRY_STATE_CITY_API_KEY;
    if (!apiKey) {
        return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    try {
        const res = await fetch(`${CSC_BASE}/countries/IN/states`, {
            headers: { "X-CSCAPI-KEY": apiKey },
            // Cache for 24 hours — states never change
            next: { revalidate: 86400 },
        });

        if (!res.ok) {
            return NextResponse.json(
                { error: "Failed to fetch states" },
                { status: res.status }
            );
        }

        const data = await res.json();

        // Return only the fields the UI needs: name + iso2 code (used to fetch cities)
        const states = (data as Array<{ name: string; iso2: string }>)
            .map((s) => ({ name: s.name, code: s.iso2 }))
            .sort((a, b) => a.name.localeCompare(b.name));

        return NextResponse.json(states, { status: 200 });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Something went wrong";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
