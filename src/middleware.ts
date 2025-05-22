import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const publicPaths = ["/", "/page", "/login"];
  const isPublicPath = publicPaths.includes(path);
  const token = request.cookies.get("user_id")?.value || undefined;

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
  }

  const isProtectedPath = !isPublicPath && path.startsWith("/dashboard");
  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }
}

export const config = {
  matcher: ["/", "/page", "/login", "/dashboard/:path*", "/teachers/:path*"],
};
