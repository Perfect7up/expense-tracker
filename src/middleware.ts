// src/middleware.ts
import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/app/core/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  // 1. Let the callback pass through
  // FIX: Must return NextResponse.next() instead of just returning undefined
  if (request.nextUrl.pathname.startsWith("/api/auth/callback")) {
    return NextResponse.next();
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
