import { NextResponse } from "next/server";
import prisma from "@/app/core/lib/prisma";
import { getAuthenticatedUser } from "@/app/core/lib/supabase/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";

const updateNameSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
});

export async function PATCH(request: Request) {
  try {
    const authUser = await getAuthenticatedUser();

    // Safety check for authUser
    if (!authUser || !authUser.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validation = updateNameSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        // Changed .errors to .issues to satisfy strict TS checks
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name } = validation.data;

    const updatedUser = await prisma.user.update({
      where: { supabaseId: authUser.id },
      data: { name } as Prisma.UserUpdateInput,
      select: {
        id: true,
        email: true,
        name: true,
      } as Prisma.UserSelect,
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user name:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
