import { NextResponse } from "next/server";
import { auth } from "@/auth";

const publicRoutes = ["/", "/login", "/register", "/pending-approval"];
const authRoutes = ["/login", "/register"];
const apiAuthPrefix = "/api/auth";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const user = req.auth?.user;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isClientDashboard = nextUrl.pathname.startsWith("/dashboard");

  if (isApiAuthRoute) {
    return null;
  }

  if (!isLoggedIn && !isPublicRoute) {
    const callbackUrl = `${nextUrl.pathname}${nextUrl.search}`;
    return NextResponse.redirect(
      new URL(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`, nextUrl),
    );
  }

  if (!isLoggedIn) {
    return null;
  }

  if (isAuthRoute) {
    return NextResponse.redirect(new URL(user?.role === "ADMIN" ? "/admin" : "/dashboard", nextUrl));
  }

  if (isAdminRoute && user?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  if (isClientDashboard && user?.role === "CLIENT" && user?.isApproved === false) {
    return NextResponse.redirect(new URL("/pending-approval", nextUrl));
  }

  return null;
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
