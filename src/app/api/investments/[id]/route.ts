import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/app/core/lib/supabase/server";
import prisma from "@/app/core/lib/prisma";
import { z } from "zod";

const updateInvestmentSchema = z.object({
  name: z.string().min(1).optional(),
  symbol: z.string().optional(),
  quantity: z.coerce.number().nonnegative().optional(),
  averageBuyPrice: z.coerce.number().nonnegative().optional(),
  currentPrice: z.coerce.number().optional(),
  categoryId: z.string().nullish().transform(val => val && val !== "none" ? val : null),
});

async function getDbUser(authUser: { id: string; email?: string }) {
  if (!authUser.email) throw new Error("User email is required");
  return prisma.user.upsert({
    where: { supabaseId: authUser.id },
    create: { email: authUser.email, supabaseId: authUser.id },
    update: {},
  });
}

// --- GET BY ID ---
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await getAuthenticatedUser();
    if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const dbUser = await getDbUser(authUser);

    const investment = await prisma.investment.findFirst({
      where: { id, userId: dbUser.id },
      include: { category: true },
    });

    if (!investment) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({
      ...investment,
      quantity: Number(investment.quantity),
      averageBuyPrice: Number(investment.averageBuyPrice),
      currentPrice: investment.currentPrice !== null ? Number(investment.currentPrice) : null,
      categoryName: investment.category?.name || "Uncategorized",
    });
  } catch (error) {
    console.error("GET Investment by ID Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// --- PUT ---
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await getAuthenticatedUser();
    if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const dbUser = await getDbUser(authUser);

    const body = await request.json();
    const validation = updateInvestmentSchema.safeParse(body);
    if (!validation.success) return NextResponse.json({ error: "Invalid input", details: validation.error.format() }, { status: 400 });

    const data = validation.data;

    // Verify existing investment
    const existingInvestment = await prisma.investment.findFirst({ where: { id, userId: dbUser.id } });
    if (!existingInvestment) return NextResponse.json({ error: "Investment not found" }, { status: 404 });

    // Verify category if provided
    if (data.categoryId) {
      const categoryExists = await prisma.category.findFirst({ where: { id: data.categoryId, userId: dbUser.id } });
      if (!categoryExists) data.categoryId = null;
    }

    const updatedInvestment = await prisma.investment.update({
      where: { id },
      data: { ...data },
      include: { category: true },
    });

    return NextResponse.json({
      ...updatedInvestment,
      quantity: Number(updatedInvestment.quantity),
      averageBuyPrice: Number(updatedInvestment.averageBuyPrice),
      currentPrice: updatedInvestment.currentPrice !== null ? Number(updatedInvestment.currentPrice) : null,
      categoryName: updatedInvestment.category?.name || "Uncategorized",
    });
  } catch (error) {
    console.error("PUT Investment Error:", error);
    return NextResponse.json({ error: "Failed to update investment" }, { status: 500 });
  }
}

// --- DELETE ---
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await getAuthenticatedUser();
    if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const dbUser = await getDbUser(authUser);

    const existingInvestment = await prisma.investment.findFirst({ where: { id, userId: dbUser.id } });
    if (!existingInvestment) return NextResponse.json({ error: "Investment not found" }, { status: 404 });

    await prisma.investment.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Investment deleted successfully" });
  } catch (error) {
    console.error("DELETE Investment Error:", error);
    return NextResponse.json({ error: "Failed to delete investment" }, { status: 500 });
  }
}
