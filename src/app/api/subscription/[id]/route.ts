import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/app/core/lib/supabase/server";
import prisma from "@/app/core/lib/prisma";
import { z } from "zod";

// --- UPDATE SCHEMA ---
const updateSubscriptionSchema = z.object({
  name: z.string().optional(),
  amount: z.coerce.number().positive().optional(),
  currency: z.string().optional(),
  cycle: z.enum(["DAILY", "WEEKLY", "MONTHLY", "YEARLY"]).optional(),
  startDate: z.union([z.string(), z.date()]).pipe(z.coerce.date()).optional(),
  nextBilling: z.union([z.string(), z.date()]).pipe(z.coerce.date()).optional(),
  endDate: z.union([z.string(), z.date()]).optional().nullable(),
  autoExpense: z.boolean().optional(),
  isActive: z.boolean().optional(),
  note: z.string().nullish().transform((v) => v || null).optional(),
  categoryId: z.string().nullish().transform((val) => (!val || val === "" ? null : val)).optional(),
});

async function getDbUser(authUser: { id: string; email?: string }) {
  if (!authUser.email) throw new Error("User email is required");
  return prisma.user.upsert({
    where: { supabaseId: authUser.id },
    create: { email: authUser.email, supabaseId: authUser.id },
    update: {},
  });
}

// --- GET: single subscription ---
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await getAuthenticatedUser();
    if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const dbUser = await getDbUser(authUser);

    const subscription = await prisma.subscription.findFirst({
      where: { id, userId: dbUser.id },
      include: { category: true },
    });

    if (!subscription) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({
      ...subscription,
      amount: Number(subscription.amount),
      categoryName: subscription.category?.name || "Uncategorized",
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// --- PUT: update subscription ---
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await getAuthenticatedUser();
    if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await request.json();
    const validation = updateSubscriptionSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: "Invalid input", details: validation.error.format() }, { status: 400 });
    }

    const dbUser = await getDbUser(authUser);

    const existing = await prisma.subscription.findFirst({ where: { id, userId: dbUser.id } });
    if (!existing) return NextResponse.json({ error: "Subscription not found" }, { status: 404 });

    const data = validation.data;

    // Verify category
    let categoryId = data.categoryId ?? existing.categoryId;
    if (categoryId) {
      const catExists = await prisma.category.findUnique({ where: { id: categoryId } });
      if (!catExists) categoryId = null;
    }

    const updated = await prisma.subscription.update({
      where: { id },
      data: { ...data, categoryId },
      include: { category: true },
    });

    return NextResponse.json({
      ...updated,
      amount: Number(updated.amount),
      categoryName: updated.category?.name || "Uncategorized",
    });
  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

// --- DELETE subscription ---
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await getAuthenticatedUser();
    if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const dbUser = await getDbUser(authUser);

    const existing = await prisma.subscription.findFirst({ where: { id, userId: dbUser.id } });
    if (!existing) return NextResponse.json({ error: "Subscription not found" }, { status: 404 });

    // FIX: Use a transaction to delete related data first to avoid Foreign Key errors
    await prisma.$transaction(async (tx) => {
      // 1. Delete associated expenses (if any exist)
      // Note: Assuming the relation is named 'expenses' or table is 'expense'. 
      // If your schema doesn't have an Expense model, you can remove this block.
      try {
        await tx.expense.deleteMany({
          where: { subscriptionId: id }
        });
      } catch (e) {
        // Ignore if expense table/relation doesn't exist
        console.log("No expenses to delete or model mismatch");
      }

      // 2. Delete the subscription itself
      await tx.subscription.delete({ where: { id } });
    });

    return NextResponse.json({ success: true, message: "Subscription deleted" });
    
  } catch (error: any) {
    console.error("Delete Error:", error);
    
    // Check for Prisma Foreign Key Constraint error code (P2003)
    if (error.code === 'P2003') {
        return NextResponse.json(
            { error: "Cannot delete: This subscription has related records (expenses) that cannot be automatically removed." }, 
            { status: 409 } // Conflict
        );
    }

    return NextResponse.json(
        { error: "Failed to delete subscription", details: error.message }, 
        { status: 500 }
    );
  }
}