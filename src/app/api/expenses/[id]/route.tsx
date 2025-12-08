import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/app/core/lib/supabase/server";
import prisma from "@/app/core/lib/prisma";
import { z } from "zod";

// --- Validation Schema ---
const updateExpenseSchema = z.object({
  amount: z.coerce.number().positive("Amount must be positive").optional(),
  note: z.string().optional().nullable(),
  occurredAt: z.string().datetime().or(z.string()).optional(),
  currency: z.string().optional(),
  categoryId: z.string().optional().nullable(),
});

// --- Helper: Get or Create DB User ---
async function getDbUser(authUser: { id: string; email?: string }) {
  return prisma.user.upsert({
    where: { supabaseId: authUser.id },
    create: {
      email: authUser.email!,
      supabaseId: authUser.id,
    },
    update: {},
  });
}

// --- GET Single Expense ---
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // 1. Type is now Promise
) {
  try {
    const authUser = await getAuthenticatedUser();
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await getDbUser(authUser);

    // 2. Await the params
    const { id } = await params;

    const expense = await prisma.expense.findFirst({
      where: {
        id,
        userId: dbUser.id,
      },
      include: {
        category: true,
      },
    });

    if (!expense) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...expense,
      amount: Number(expense.amount),
    });
  } catch (error) {
    console.error("GET Single Expense Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// --- PUT/PATCH Handler ---
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // 1. Type is now Promise
) {
  try {
    const authUser = await getAuthenticatedUser();
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await getDbUser(authUser);

    // 2. Await the params
    const { id } = await params;

    const body = await request.json();
    const validation = updateExpenseSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validation.error.format() },
        { status: 400 }
      );
    }

    const existingExpense = await prisma.expense.findFirst({
      where: {
        id,
        userId: dbUser.id,
      },
    });

    if (!existingExpense) {
      return NextResponse.json(
        { error: "Expense not found or you don't have permission" },
        { status: 404 }
      );
    }

    const data = validation.data;
    const updatedExpense = await prisma.expense.update({
      where: { id },
      data: {
        amount:
          data.amount !== undefined ? data.amount : existingExpense.amount,
        note: data.note !== undefined ? data.note : existingExpense.note,
        occurredAt: data.occurredAt
          ? new Date(data.occurredAt)
          : existingExpense.occurredAt,
        currency: data.currency || existingExpense.currency,
        categoryId:
          data.categoryId !== undefined
            ? data.categoryId
            : existingExpense.categoryId,
      },
      include: {
        category: true,
      },
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
  { params }: { params: Promise<{ id: string }> } // 1. Type is now Promise
) {
  try {
    const authUser = await getAuthenticatedUser();
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await getDbUser(authUser);

    // 2. Await the params
    const { id } = await params;

    const existingExpense = await prisma.expense.findFirst({
      where: {
        id,
        userId: dbUser.id,
      },
    });

    if (!existingExpense) {
      return NextResponse.json(
        { error: "Expense not found or you don't have permission" },
        { status: 404 }
      );
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
      { error: "Failed to delete expense" },
      { status: 500 }
    );
  }
}
