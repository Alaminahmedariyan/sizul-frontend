import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";

/**
 * Middleware runs on the Edge — it does NOT hit the database. Better Auth's
 * `getSessionCookie()` only checks that a (signed) session cookie exists;
 * it does NOT verify the session is still valid or fetch the role.
 *
 * So this layer only answers "is someone plausibly logged in?" — good
 * enough to bounce anonymous users away from /admin and /portal instantly
 * without a network round trip. The REAL, trustworthy role check happens
 * server-side in src/app/admin/layout.tsx and src/app/portal/layout.tsx via
 * getCurrentUser(), which actually calls the backend. /redirect does the
 * same to send an already-logged-in user to the RIGHT area (not a guess).
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hasSessionCookie = getSessionCookie(req);

  const isProtectedArea =
    pathname.startsWith("/admin") || pathname.startsWith("/portal");
  const isAuthPage =
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/sign-up") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/verify-otp");

  if (isProtectedArea && !hasSessionCookie) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(signInUrl);
  }

  if (isAuthPage && hasSessionCookie) {
    // Already logged in — don't show sign-in/sign-up again.
    // /redirect fetches the real role server-side and sends them
    // to the correct area (this middleware layer doesn't know the role).
    return NextResponse.redirect(new URL("/redirect", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/portal/:path*",
    "/sign-in",
    "/sign-up",
    "/forgot-password",
    "/verify-otp",
  ],
};
