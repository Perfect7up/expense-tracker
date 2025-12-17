import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/app/core/lib/supabase/server";
import prisma from "@/app/core/lib/prisma";
import { z } from "zod";

// --- ROBUST SCHEMA with subscriptionId ---
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

  // NEW: Optional subscriptionId field
  subscriptionId: z
    .string()
    .nullish()
    .transform((val) => {
      if (!val || val === "" || val === "none") {
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
      include: { 
        category: {
          select: {
            id: true,
            name: true,
            type: true,
          }
        },
        subscription: {
          select: {
            id: true,
            name: true,
            amount: true,
            currency: true,
            cycle: true,
            nextBilling: true,
            isActive: true,
            startDate: true,
            endDate: true,
            note: true,
            autoExpense: true,
          }
        },
      },
    });

    // Log to debug
    console.log("📊 Expenses from DB:", expenses.length);
    expenses.forEach((expense, index) => {
      console.log(`Expense ${index + 1}:`, {
        id: expense.id,
        subscriptionId: expense.subscriptionId,
        hasSubscription: !!expense.subscription,
        subscription: expense.subscription
      });
    });

    const formattedExpenses = expenses.map((e) => {
      const subscriptionName = e.subscription?.name || null;
      const subscriptionAmount = e.subscription?.amount ? Number(e.subscription.amount) : null;
      
      return {
        // Basic expense fields
        id: e.id,
        amount: Number(e.amount),
        currency: e.currency,
        note: e.note,
        occurredAt: e.occurredAt,
        userId: e.userId,
        categoryId: e.categoryId,
        subscriptionId: e.subscriptionId,
        createdAt: e.createdAt,
        updatedAt: e.updatedAt,
        
        // Related data
        category: e.category ? {
          id: e.category.id,
          name: e.category.name,
          type: e.category.type,
        } : null,
        
        subscription: e.subscription ? {
          id: e.subscription.id,
          name: e.subscription.name,
          amount: subscriptionAmount,
          currency: e.subscription.currency,
          cycle: e.subscription.cycle,
          nextBilling: e.subscription.nextBilling,
          isActive: e.subscription.isActive,
          startDate: e.subscription.startDate,
          endDate: e.subscription.endDate,
          note: e.subscription.note,
          autoExpense: e.subscription.autoExpense,
        } : null,
        
        // Derived fields for easy display
        categoryName: e.category?.name || "Uncategorized",
        subscriptionName: subscriptionName,
      };
    });

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

    // 3. SAFETY CHECK: Verify Subscription ID exists and belongs to user
    let finalSubscriptionId = data.subscriptionId;

    if (finalSubscriptionId) {
      const subscriptionExists = await prisma.subscription.findFirst({
        where: { 
          id: finalSubscriptionId,
          userId: dbUser.id, // Ensure it belongs to the user
        },
      });

      if (!subscriptionExists) {
        console.warn(
          `Subscription ID ${finalSubscriptionId} not found or doesn't belong to user. Setting to null.`
        );
        finalSubscriptionId = null;
      } else {
        // If subscription has a category, use it if no category was provided
        if (!finalCategoryId && subscriptionExists.categoryId) {
          finalCategoryId = subscriptionExists.categoryId;
          console.log(`Using category from subscription: ${finalCategoryId}`);
        }
      }
    }

    // 4. Create in Prisma
    const expense = await prisma.expense.create({
      data: {
        userId: dbUser.id,
        amount: data.amount,
        note: data.note,
        occurredAt: data.occurredAt,
        currency: data.currency,
        categoryId: finalCategoryId,
        subscriptionId: finalSubscriptionId, // Link to subscription
      },
      include: { 
        category: true,
        subscription: true,
      },
    });

    return NextResponse.json({
      ...expense,
      amount: Number(expense.amount),
      categoryName: expense.category?.name || "Uncategorized",
      subscriptionName: expense.subscription?.name || null,
    });
  } catch (error) {
    console.error("POST Expense Error:", error);

    // Handle specific Prisma foreign key error just in case
    if ((error as any).code === "P2003") {
      return NextResponse.json(
        { error: "Invalid Category, Subscription, or User reference." },
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