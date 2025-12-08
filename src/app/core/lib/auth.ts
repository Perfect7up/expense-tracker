// src/core/lib/auth.ts
import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "./supabase/server";

export async function requireAuth() {
  const user = await getAuthenticatedUser();

  if (!user) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
      user: null,
    };
  }

  return { error: null, user };
}
