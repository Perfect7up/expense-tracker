import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/app/core/lib/supabase/server";
import prisma from "@/app/core/lib/prisma";
import { z } from "zod";

// --- FIXED VALIDATION SCHEMA with subscriptionId ---
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
  subscriptionId: z
    .string()
    .nullish()
    .transform((val) =>
      !val || val === "" || val === "none"
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

// --- GET Handler ---
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
  
  if (!expense)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  
  const subscriptionAmount = expense.subscription?.amount ? Number(expense.subscription.amount) : null;
  
  return NextResponse.json({ 
    // Basic expense fields
    id: expense.id,
    amount: Number(expense.amount),
    currency: expense.currency,
    note: expense.note,
    occurredAt: expense.occurredAt,
    userId: expense.userId,
    categoryId: expense.categoryId,
    subscriptionId: expense.subscriptionId,
    createdAt: expense.createdAt,
    updatedAt: expense.updatedAt,
    
    // Related data
    category: expense.category ? {
      id: expense.category.id,
      name: expense.category.name,
      type: expense.category.type,
    } : null,
    
    subscription: expense.subscription ? {
      id: expense.subscription.id,
      name: expense.subscription.name,
      amount: subscriptionAmount,
      currency: expense.subscription.currency,
      cycle: expense.subscription.cycle,
      nextBilling: expense.subscription.nextBilling,
      isActive: expense.subscription.isActive,
      startDate: expense.subscription.startDate,
      endDate: expense.subscription.endDate,
      note: expense.subscription.note,
      autoExpense: expense.subscription.autoExpense,
    } : null,
    
    // Derived fields
    categoryName: expense.category?.name || "Uncategorized",
    subscriptionName: expense.subscription?.name || null,
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

    const { id } = await params;

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

    // Verify subscription if provided
    let finalSubscriptionId = data.subscriptionId ?? existingExpense.subscriptionId;
    
    if (data.subscriptionId !== undefined) {
      if (data.subscriptionId) {
        const subscriptionExists = await prisma.subscription.findFirst({
          where: { 
            id: data.subscriptionId,
            userId: dbUser.id,
          },
        });

        if (!subscriptionExists) {
          console.warn(`Subscription ID ${data.subscriptionId} not found. Setting to null.`);
          finalSubscriptionId = null;
        }
      } else {
        finalSubscriptionId = null;
      }
    }

    const updatedExpense = await prisma.expense.update({
      where: { id },
      data: {
        amount: data.amount ?? existingExpense.amount,
        note: data.note,
        occurredAt: data.occurredAt ?? existingExpense.occurredAt,
        currency: data.currency ?? existingExpense.currency,
        categoryId: data.categoryId,
        subscriptionId: finalSubscriptionId,
      },
      include: { 
        category: true,
        subscription: true,
      },
    });

    return NextResponse.json({
      ...updatedExpense,
      amount: Number(updatedExpense.amount),
      categoryName: updatedExpense.category?.name || "Uncategorized",
      subscriptionName: updatedExpense.subscription?.name || null,
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