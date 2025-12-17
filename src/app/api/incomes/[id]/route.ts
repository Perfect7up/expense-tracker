import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/app/core/lib/supabase/server";
import prisma from "@/app/core/lib/prisma";
import { z } from "zod";

// --- ROBUST UPDATE SCHEMA ---
const updateIncomeSchema = z.object({
  amount: z.coerce.number().positive().optional(),
  source: z.string().nullish().transform((v) => v || null),
  note: z.string().nullish().transform((v) => v || null),
  receivedAt: z.union([z.string(), z.date()]).pipe(z.coerce.date()).optional(),
  currency: z.string().optional(),
  categoryId: z.string().nullish().transform((val) =>
      !val || val === "" || val === "none" || val === "uncategorized" ? null : val
  ),
  // New: Allow updating investment link
  investmentId: z.string().uuid().nullish().transform((v) => v || null),
});

async function getDbUser(authUser: { id: string; email?: string }) {
  return prisma.user.upsert({
    where: { supabaseId: authUser.id },
    create: { email: authUser.email!, supabaseId: authUser.id },
    update: {},
  });
}

// --- GET Single Income ---
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await getAuthenticatedUser();
    if (!authUser)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const dbUser = await getDbUser(authUser);
    const { id } = await params;

    const income = await prisma.income.findFirst({
      where: { id: id, userId: dbUser.id },
      include: { 
        category: true,
        investment: {
            select: { id: true, name: true, symbol: true }
        }
      },
    });

    if (!income)
      return NextResponse.json({ error: "Income not found" }, { status: 404 });

    return NextResponse.json({ 
        ...income, 
        amount: Number(income.amount),
        investmentName: income.investment?.name || null 
    });
  } catch (error) {
    console.error("GET Single Income Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// --- UPDATE Income ---
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await getAuthenticatedUser();
    if (!authUser)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const dbUser = await getDbUser(authUser);
    const { id } = await params;

    const body = await request.json();
    const validation = updateIncomeSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validation.error.format() },
        { status: 400 }
      );
    }

    const existingIncome = await prisma.income.findFirst({
      where: { id: id, userId: dbUser.id },
    });

    if (!existingIncome) {
      return NextResponse.json({ error: "Income not found" }, { status: 404 });
    }

    const data = validation.data;

    // Verify Investment ownership if changing
    if (data.investmentId && data.investmentId !== existingIncome.investmentId) {
         const investmentExists = await prisma.investment.findFirst({
            where: { id: data.investmentId, userId: dbUser.id },
        });
        if (!investmentExists) {
            return NextResponse.json({ error: "Invalid Investment ID" }, { status: 400 });
        }
    }

    const income = await prisma.income.update({
      where: { id: id },
      data: {
        // Use ?? to check if undefined, but allow nulls from the transform
        amount: data.amount ?? existingIncome.amount,
        source: data.source,
        note: data.note,
        receivedAt: data.receivedAt ?? existingIncome.receivedAt,
        currency: data.currency ?? existingIncome.currency,
        categoryId: data.categoryId,
        investmentId: data.investmentId, // Update link
      },
      include: { 
        category: true,
        investment: true
      },
    });

    return NextResponse.json({ 
        ...income, 
        amount: Number(income.amount),
        investmentName: income.investment?.name || null
    });
  } catch (error) {
    console.error("PUT Income Error:", error);
    return NextResponse.json(
      { error: "Failed to update income" },
      { status: 500 }
    );
  }
}

// --- DELETE Income ---
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await getAuthenticatedUser();
    if (!authUser)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const dbUser = await getDbUser(authUser);
    const { id } = await params;

    const existingIncome = await prisma.income.findFirst({
      where: { id: id, userId: dbUser.id },
    });

    if (!existingIncome) {
      return NextResponse.json({ error: "Income not found" }, { status: 404 });
    }

    await prisma.income.delete({
      where: { id: id },
    });

    return NextResponse.json(
      { success: true, message: "Income deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("DELETE Income Error:", error);
    return NextResponse.json(
      { error: "Failed to delete income" },
      { status: 500 }
    );
  }
}