import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/app/core/lib/supabase/server";
import prisma from "@/app/core/lib/prisma";
import { z } from "zod";

// --- ROBUST SCHEMA ---
const createExpenseSchema = z.object({
  amount: z.coerce.number().positive("Amount must be positive"),

  // Transform empty/undefined notes to null
  note: z
    .string()
    .nullish()
    .transform((v) => v || null),

  // Handle various date formats safely
  occurredAt: z.union([z.string(), z.date()]).pipe(z.coerce.date()),

  currency: z.string().default("USD"),

  // Aggressively clean up categoryId
  categoryId: z
    .string()
    .nullish()
    .transform((val) => {
      if (!val || val === "" || val === "none" || val === "uncategorized") {
        return null;
      }
      return val;
    }),
});

async function getDbUser(authUser: { id: string; email?: string }) {
  if (!authUser.email) throw new Error("User email is required");
  return prisma.user.upsert({
    where: { supabaseId: authUser.id },
    create: { email: authUser.email, supabaseId: authUser.id },
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

    const formattedExpenses = expenses.map((e) => ({
      ...e,
      amount: Number(e.amount),
      categoryName: e.category?.name || "Uncategorized",
    }));

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

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    // 1. Validate Input
    const validation = createExpenseSchema.safeParse(body);
    if (!validation.success) {
      console.error("Validation Error:", validation.error.format());
      return NextResponse.json(
        { error: "Invalid input", details: validation.error.format() },
        { status: 400 }
      );
    }

    const dbUser = await getDbUser(authUser);
    const data = validation.data;

    // 2. SAFETY CHECK: Verify Category ID exists
    let finalCategoryId = data.categoryId;

    if (finalCategoryId) {
      const categoryExists = await prisma.category.findUnique({
        where: { id: finalCategoryId },
      });

      // If the category ID sent by frontend doesn't exist in DB, force null
      if (!categoryExists) {
        console.warn(
          `Category ID ${finalCategoryId} not found. Defaulting to Uncategorized.`
        );
        finalCategoryId = null;
      }
    }

    // 3. Create in Prisma
    const expense = await prisma.expense.create({
      data: {
        userId: dbUser.id,
        amount: data.amount,
        note: data.note,
        occurredAt: data.occurredAt,
        currency: data.currency,
        categoryId: finalCategoryId, // Uses the verified ID or null
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

    // Handle specific Prisma foreign key error just in case
    if ((error as any).code === "P2003") {
      return NextResponse.json(
        { error: "Invalid Category or User reference." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to create expense",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
