import { NextResponse } from "next/server";
// Keep your helper import!
import { createServerSupabase } from "@/app/core/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/auth/signin", url));
  }

  // 1. Initialize the client
  const supabase = await createServerSupabase();

  // 2. Exchange the code for a session
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("Auth error:", error);
    // Fix: Corrected typo 'sigin' to 'signin'
    return NextResponse.redirect(new URL("/auth/signin", url));
  }

  // 3. SUCCESS: Redirect to dashboard
  // This part was missing or cut off in your snippet
  return NextResponse.redirect(new URL("/dashboard", url));
}
