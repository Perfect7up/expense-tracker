import { NextResponse } from "next/server";
import prisma from "@/app/core/lib/prisma";
import { z } from "zod";

const createUserSchema = z.object({
  supabaseId: z.string(),
  email: z.string().email(),
  name: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createUserSchema.parse(body);

    const user = await prisma.user.upsert({
      where: { supabaseId: parsed.supabaseId },
      update: { name: parsed.name, email: parsed.email },
      create: {
        supabaseId: parsed.supabaseId,
        email: parsed.email,
        name: parsed.name,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
