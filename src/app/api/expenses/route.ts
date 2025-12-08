import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/app/core/lib/supabase/server";
import prisma from "@/app/core/lib/prisma";
import { z } from "zod";
import { Expense, Category } from "@prisma/client";

// --- Validation Schema ---
const createExpenseSchema = z.object({
  amount: z.coerce.number().positive("Amount must be positive"),
  note: z.string().optional(),
  occurredAt: z.string().datetime().or(z.string()),
  currency: z.string().default("USD"),
  categoryId: z.string().optional().nullable(),
});

// --- Helper: Get or create DB user ---
async function getDbUser(authUser: { id: string; email?: string }) {
  return prisma.user.upsert({
    where: { supabaseId: authUser.id },
    create: { email: authUser.email!, supabaseId: authUser.id },
    update: {},
  });
}

// --- GET: All expenses ---
export async function GET() {
  try {
    const authUser = await getAuthenticatedUser();
    if (!authUser)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const dbUser = await getDbUser(authUser);

    const expenses = await prisma.expense.findMany({
      where: { userId: dbUser.id },
      orderBy: { occurredAt: "desc" },
      include: { category: true },
    });

    const formattedExpenses = expenses.map(
      (e: Expense & { category: Category | null }) => ({
        ...e,
        amount: Number(e.amount),
        categoryName: e.category?.name || "Uncategorized",
      })
    );

    return NextResponse.json(formattedExpenses);
  } catch (error) {
    console.error("GET Expense Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// --- POST: Create expense ---
export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthenticatedUser();
    if (!authUser)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const validation = createExpenseSchema.safeParse(body);
    if (!validation.success)
      return NextResponse.json(
        { error: "Invalid input", details: validation.error.format() },
        { status: 400 }
      );

    const dbUser = await getDbUser(authUser);
    const data = validation.data;

    const expense = await prisma.expense.create({
      data: {
        userId: dbUser.id,
        amount: data.amount,
        note: data.note || null,
        occurredAt: new Date(data.occurredAt),
        currency: data.currency,
        categoryId: data.categoryId || null,
      },
      include: { category: true },
    });

    return NextResponse.json({
      ...expense,
      amount: Number(expense.amount),
      categoryName: expense.category?.name || "Uncategorized",
    });
  } catch (error) {
    console.error("POST Expense Error:", error);
    return NextResponse.json(
      {
        error: "Failed to create expense",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
