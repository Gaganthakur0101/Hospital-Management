import { NextRequest, NextResponse } from "next/server";

const publicRoutes = new Set(["/", "/login", "/signup", "/hospitalList"]);

export default function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    const token = request.cookies.get("token")?.value;
    const isPublicHospitalDetail = path.startsWith("/hospitalList/");

    if ((publicRoutes.has(path) || isPublicHospitalDetail) && !token) {
        return NextResponse.next();
    }

    if ((path === "/login" || path === "/signup") && token) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    if (!publicRoutes.has(path) && !isPublicHospitalDetail && !token) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};
