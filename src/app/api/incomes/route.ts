import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/app/core/lib/supabase/server";
import prisma from "@/app/core/lib/prisma";
import { z } from "zod";

// --- ROBUST SCHEMA ---
const createIncomeSchema = z.object({
  amount: z.coerce.number().positive("Amount must be positive"),
  
  // Transform empty strings to null
  source: z.string().nullish().transform((v) => v || null),
  note: z.string().nullish().transform((v) => v || null),

  // Safe Date Coercion
  receivedAt: z.union([z.string(), z.date()]).pipe(z.coerce.date()),

  currency: z.string().default("USD"),

  // Safe Category Handling
  categoryId: z.string().nullish().transform((val) => {
    if (!val || val === "" || val === "none" || val === "uncategorized") {
      return null;
    }
    return val;
  }),

  // New: Investment Link
  investmentId: z.string().uuid().nullish().transform((v) => v || null),
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
      include: { 
        category: true,
        investment: { // Include investment details
          select: { id: true, name: true, symbol: true }
        }
      },
    });

    return NextResponse.json(
      incomes.map((i) => ({
        ...i,
        amount: Number(i.amount),
        categoryName: i.category?.name || "Uncategorized",
        // Flatten investment details for easier frontend use
        investmentName: i.investment?.name || null,
        investmentSymbol: i.investment?.symbol || null,
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

    // 1. Verify Category (Existing Logic)
    let finalCategoryId = data.categoryId;
    if (finalCategoryId) {
      const categoryExists = await prisma.category.findUnique({
        where: { id: finalCategoryId },
      });
      if (!categoryExists) {
        finalCategoryId = null;
      }
    }

    // 2. Verify Investment (New Logic)
    // Ensure the investment belongs to the user before linking
    let finalInvestmentId = data.investmentId;
    if (finalInvestmentId) {
      const investmentExists = await prisma.investment.findFirst({
        where: { id: finalInvestmentId, userId: dbUser.id },
      });
      if (!investmentExists) {
        return NextResponse.json(
          { error: "Investment not found or access denied" },
          { status: 404 }
        );
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
        investmentId: finalInvestmentId, // Link created
      },
      include: { 
        category: true,
        investment: true 
      },
    });

    return NextResponse.json({
      ...income,
      amount: Number(income.amount),
      categoryName: income.category?.name || "Uncategorized",
      investmentName: income.investment?.name || null,
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