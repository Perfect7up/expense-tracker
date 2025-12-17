import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/app/core/lib/supabase/server";
import prisma from "@/app/core/lib/prisma";
import { z } from "zod";

const createSubscriptionSchema = z.object({
  name: z.string().min(1, "Name is required"),
  amount: z.coerce.number().positive("Amount must be positive"),
  currency: z.string().default("USD"),
  cycle: z.enum(["DAILY", "WEEKLY", "MONTHLY", "YEARLY"]),
  
  startDate: z.union([z.string(), z.date()]).pipe(z.coerce.date()),
  nextBilling: z.union([z.string(), z.date()]).pipe(z.coerce.date()),

  endDate: z
    .union([z.string(), z.date()])
    .nullish()
    .transform((val) => (val ? new Date(val) : null)),

  autoExpense: z.boolean().default(true),
  isActive: z.boolean().default(true),

  note: z
    .string()
    .nullish()
    .transform((v) => v || null),

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

// --- GET: All Subscriptions ---
export async function GET() {
  try {
    const authUser = await getAuthenticatedUser();
    if (!authUser)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const dbUser = await getDbUser(authUser);

    const subscriptions = await prisma.subscription.findMany({
      where: { userId: dbUser.id },
      orderBy: { nextBilling: "asc" },
      include: { category: true },
    });

    const formattedSubscriptions = subscriptions.map((s) => ({
      ...s,
      amount: Number(s.amount),
      categoryName: s.category?.name || "Uncategorized",
    }));

    return NextResponse.json(formattedSubscriptions);
  } catch (error) {
    console.error("GET Subscription Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// --- POST: Create Subscription ---
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
    const validation = createSubscriptionSchema.safeParse(body);
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

      if (!categoryExists) {
        console.warn(
          `Category ID ${finalCategoryId} not found. Defaulting to Uncategorized.`
        );
        finalCategoryId = null;
      }
    }

    // 3. Create Subscription in Prisma
    const subscription = await prisma.subscription.create({
      data: {
        userId: dbUser.id,
        name: data.name,
        amount: data.amount,
        currency: data.currency,
        cycle: data.cycle,
        startDate: data.startDate,
        nextBilling: data.nextBilling,
        endDate: data.endDate,
        isActive: data.isActive,
        autoExpense: data.autoExpense,
        note: data.note,
        categoryId: finalCategoryId,
      },
      include: { category: true },
    });

    // 4. NEW: Automatically create the first expense if applicable
    // If autoExpense is ON and the start date is today (or past), create the expense now.
    const today = new Date();
    const startDate = new Date(data.startDate);

    // Reset times to compare dates only
    const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startDateOnly = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());

    if (data.autoExpense && startDateOnly <= todayDateOnly) {
      console.log(`Creating initial expense for subscription: ${subscription.name}`);
      
      await prisma.expense.create({
        data: {
          userId: dbUser.id,
          amount: data.amount,
          currency: data.currency,
          // Meaningful note indicating origin
          note: `Initial expense for subscription: ${data.name}`,
          categoryId: finalCategoryId,
          subscriptionId: subscription.id,
          occurredAt: data.startDate, // Use the start date, not current time
        },
      });

      // Note: We generally don't update nextBilling here because the user
      // specifically provided a 'nextBilling' date in the form.
      // The Sync job will handle the next cycle.
    }

    return NextResponse.json({
      ...subscription,
      amount: Number(subscription.amount),
      categoryName: subscription.category?.name || "Uncategorized",
    });
  } catch (error) {
    console.error("POST Subscription Error:", error);

    if ((error as any).code === "P2003") {
      return NextResponse.json(
        { error: "Invalid Category or User reference." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to create subscription",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}