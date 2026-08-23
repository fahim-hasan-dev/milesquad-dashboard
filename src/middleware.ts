import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Public auth routes that unauthenticated users can access
const authRoutes = ["/login", "/forgot-password", "/reset-password", "/otp-verify"];

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const token = request.cookies.get("accessToken")?.value;

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // 1. If accessing a protected route without a token -> Redirect to /login
  if (!token && !isAuthRoute) {
    const loginUrl = new URL("/login", request.url);
    if (pathname !== "/") {
      loginUrl.searchParams.set("redirect", `${pathname}${search}`);
    }
    return NextResponse.redirect(loginUrl);
  }

  // 2. If accessing auth route (/login) with a valid token -> Redirect to dashboard root (/)
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api routes (/api/*)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, logo.png, images, etc.
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
