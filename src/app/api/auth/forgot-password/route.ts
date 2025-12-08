import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/app/core/lib/supabase/server";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email)
    return NextResponse.json({ error: "Email is required" }, { status: 400 });

  const supabase = await createServerSupabase();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/reset-password`,
  });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ message: "Check your email for the reset link." });
}
