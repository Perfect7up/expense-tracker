import { NextResponse } from "next/server";
import { createServerSupabase } from "@/app/core/lib/supabase/server";
import prisma from "@/app/core/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/account/signin", url));
  }

  // Initialize Supabase server client
  const supabase = await createServerSupabase();

  // Exchange magic link/oauth code for session
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    console.error("Auth error:", error);
    return NextResponse.redirect(new URL("/account/signin", url));
  }

  const user = data.user;

  // Extract name safely
  const name =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.user_metadata?.user_name ||
    null;

  // Upsert user in database
  await prisma.user.upsert({
    where: { supabaseId: user.id },
    update: {
      email: user.email,
      name: name || null,
    } as Prisma.UserUncheckedUpdateInput,
    create: {
      supabaseId: user.id,
      email: user.email!,
      name: name || null,
    } as Prisma.UserUncheckedCreateInput,
  });

  // 1. REMOVED: await supabase.auth.signOut(); 
  // We want the session to stay active!

  // 2. CHANGED: Redirect to dashboard instead of signin
  return NextResponse.redirect(new URL("/dashboard", url));
}