import { match } from "assert";
import { NextResponse , NextRequest } from "next/server";

export default function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    const PublicRoute = path === "/login" || path === "/signup" || path === "/" || path === "/hospitalList";

    const token = request.cookies.get("token")?.value || null;

    if(token === null && !PublicRoute) {
        return NextResponse.redirect(new URL("/login", request.url));
    }
}

export const config = {
    matcher: [
        
    ],
}