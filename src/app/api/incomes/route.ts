import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/app/core/lib/supabase/server";
import prisma from "@/app/core/lib/prisma";
import { z } from "zod";

// --- ROBUST SCHEMA (Matches Expense Logic) ---
const createIncomeSchema = z.object({
  amount: z.coerce.number().positive("Amount must be positive"),

  // Transform empty strings to null for text fields
  source: z
    .string()
    .nullish()
    .transform((v) => v || null),
  note: z
    .string()
    .nullish()
    .transform((v) => v || null),

  // Safe Date Coercion
  receivedAt: z.union([z.string(), z.date()]).pipe(z.coerce.date()),

  currency: z.string().default("USD"),

  // Safe Category Handling (prevents "Malformed UUID" or FK errors)
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

// --- Helper: Upsert user ---
async function getDbUser(authUser: { id: string; email?: string }) {
  if (!authUser.email) throw new Error("User email is required");
  return prisma.user.upsert({
    where: { supabaseId: authUser.id },
    create: { email: authUser.email, supabaseId: authUser.id },
    update: {},
  });
}

// --- GET All Incomes ---
export async function GET() {
  try {
    const authUser = await getAuthenticatedUser();
    if (!authUser)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const dbUser = await getDbUser(authUser);

    const incomes = await prisma.income.findMany({
      where: { userId: dbUser.id },
      orderBy: { receivedAt: "desc" },
      include: { category: true },
    });

    return NextResponse.json(
      incomes.map((i) => ({
        ...i,
        amount: Number(i.amount),
        categoryName: i.category?.name || "Uncategorized",
      }))
    );
  } catch (error) {
    console.error("GET Income Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// --- CREATE Income ---
export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthenticatedUser();
    if (!authUser)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const validation = createIncomeSchema.safeParse(body);

    if (!validation.success) {
      console.error("Validation Error:", validation.error.format());
      return NextResponse.json(
        { error: "Invalid input", details: validation.error.format() },
        { status: 400 }
      );
    }

    const dbUser = await getDbUser(authUser);
    const data = validation.data;

    // --- CRITICAL FIX: Verify Category Existence ---
    let finalCategoryId = data.categoryId;

    if (finalCategoryId) {
      const categoryExists = await prisma.category.findUnique({
        where: { id: finalCategoryId },
      });

      // If category ID is stale/invalid, force it to null to allow creation
      if (!categoryExists) {
        console.warn(
          `Category ID ${finalCategoryId} not found. Defaulting to Uncategorized.`
        );
        finalCategoryId = null;
      }
    }

    const income = await prisma.income.create({
      data: {
        userId: dbUser.id,
        amount: data.amount,
        source: data.source,
        note: data.note,
        receivedAt: data.receivedAt,
        currency: data.currency,
        categoryId: finalCategoryId,
      },
      include: { category: true },
    });

    return NextResponse.json({
      ...income,
      amount: Number(income.amount),
      categoryName: income.category?.name || "Uncategorized",
    });
  } catch (error) {
    console.error("POST Income Error:", error);
    return NextResponse.json(
      {
        error: "Failed to create income",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
