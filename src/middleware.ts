import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  // Protect these routes - redirect to login if not authenticated
  const protectedRoutes = ["/dashboard", "/checkout", "/cart", "/wishlist"];
  const adminRoutes = ["/admin"];

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAdmin = adminRoutes.some((route) => pathname.startsWith(route));

  if (isProtected && !isLoggedIn) {
    return NextResponse.redirect(
      new URL(`/auth/login?callbackUrl=${pathname}`, req.url)
    );
  }

  if (isAdmin) {
    if (!isLoggedIn) {
      return NextResponse.redirect(
        new URL("/auth/login?callbackUrl=/admin", req.url)
      );
    }
    const role = (req.auth?.user as { role?: string })?.role;
    if (role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
