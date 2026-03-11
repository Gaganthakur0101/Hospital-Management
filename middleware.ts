import { NextRequest, NextResponse } from "next/server";

const publicRoutes = new Set(["/", "/login", "/signup", "/hospitalList"]);

export default function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    if (publicRoutes.has(path)) {
        return NextResponse.next();
    }

    const token = request.cookies.get("token")?.value;

    if (!token) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};