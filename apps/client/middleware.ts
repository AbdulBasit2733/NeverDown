import { NextRequest, NextResponse } from "next/server";

// Define exactly which routes require authentication
const PROTECTED_PATHS = ["/dashboard"];
const AUTH_PATHS = ["/signin", "/signup", "/login", "/register"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));
  const isAuthRoute = AUTH_PATHS.some((p) => pathname.startsWith(p));

  // Check if the user has a refresh token cookie
  const hasRefreshToken = req.cookies.has("refreshToken");

  // Redirect unauthenticated users to signin
  if (isProtected && !hasRefreshToken) {
    const loginUrl = new URL("/signin", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect already authenticated users to dashboard
  if (isAuthRoute && hasRefreshToken) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};