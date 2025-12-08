import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/app/core/lib/supabase/server";

export async function POST(req: NextRequest) {
  const { accessToken, password } = await req.json();

  if (!accessToken || !password) {
    return NextResponse.json(
      { error: "Missing token or password" },
      { status: 400 }
    );
  }

  const supabase = await createServerSupabase();

  // Set the session using the access token from the reset link
  const { data: sessionData, error: sessionError } =
    await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: "",
    });

  if (sessionError || !sessionData.user) {
    return NextResponse.json(
      { error: "Invalid or expired reset token" },
      { status: 400 }
    );
  }

  const { error: updateError } = await supabase.auth.updateUser({
    password,
  });

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 400 });
  }

  return NextResponse.json({ message: "Password reset successfully!" });
}
