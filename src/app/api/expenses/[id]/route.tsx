import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/app/core/lib/supabase/server";
import prisma from "@/app/core/lib/prisma";
import { z } from "zod";

// --- FIXED VALIDATION SCHEMA (Matches POST logic) ---
const updateExpenseSchema = z.object({
  amount: z.coerce.number().positive().optional(),
  note: z
    .string()
    .nullish()
    .transform((v) => v || null),
  occurredAt: z.union([z.string(), z.date()]).pipe(z.coerce.date()).optional(),
  currency: z.string().optional(),
  categoryId: z
    .string()
    .nullish()
    .transform((val) =>
      !val || val === "" || val === "none" || val === "uncategorized"
        ? null
        : val
    ),
});

async function getDbUser(authUser: { id: string; email?: string }) {
  return prisma.user.upsert({
    where: { supabaseId: authUser.id },
    create: { email: authUser.email!, supabaseId: authUser.id },
    update: {},
  });
}

// --- PUT/PATCH Handler ---
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await getAuthenticatedUser();
    if (!authUser)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params; // Ensure params are awaited (Next.js 15)

    const body = await request.json();
    const validation = updateExpenseSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validation.error.format() },
        { status: 400 }
      );
    }

    const dbUser = await getDbUser(authUser);

    // Verify ownership
    const existingExpense = await prisma.expense.findFirst({
      where: { id, userId: dbUser.id },
    });

    if (!existingExpense) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    const data = validation.data;
    const updatedExpense = await prisma.expense.update({
      where: { id },
      data: {
        // Only update if provided (undefined check)
        amount: data.amount ?? existingExpense.amount,
        note: data.note, // Can be null, so we use the value directly
        occurredAt: data.occurredAt ?? existingExpense.occurredAt,
        currency: data.currency ?? existingExpense.currency,
        categoryId: data.categoryId, // Validation handles the logic for null vs string
      },
      include: { category: true },
    });

    return NextResponse.json({
      ...updatedExpense,
      amount: Number(updatedExpense.amount),
    });
  } catch (error) {
    console.error("PUT Expense Error:", error);
    return NextResponse.json(
      { error: "Failed to update expense" },
      { status: 500 }
    );
  }
}

// --- DELETE Handler ---
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await getAuthenticatedUser();
    if (!authUser)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    const dbUser = await getDbUser(authUser);

    // Check if exists AND belongs to user
    const existingExpense = await prisma.expense.findFirst({
      where: { id, userId: dbUser.id },
    });

    if (!existingExpense) {
      console.log(
        `DELETE failed: Expense ${id} not found for user ${dbUser.id}`
      );
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    await prisma.expense.delete({
      where: { id },
    });

    return NextResponse.json(
      { success: true, message: "Expense deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE Expense Error:", error);
    return NextResponse.json(
      {
        error: "Failed to delete expense",
        details: error instanceof Error ? error.message : "Unknown",
      },
      { status: 500 }
    );
  }
}

// Keeping GET for completeness if needed in [id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authUser = await getAuthenticatedUser();
  if (!authUser)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const dbUser = await getDbUser(authUser);
  const expense = await prisma.expense.findFirst({
    where: { id, userId: dbUser.id },
    include: { category: true },
  });
  if (!expense)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ...expense, amount: Number(expense.amount) });
}
