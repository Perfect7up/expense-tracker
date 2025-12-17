import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/app/core/lib/supabase/server";
import prisma from "@/app/core/lib/prisma";
import { z } from "zod";

const createInvestmentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  symbol: z.string().optional(),
  quantity: z.coerce.number().nonnegative("Quantity must be positive"),
  averageBuyPrice: z.coerce.number().nonnegative("Average buy price must be positive"),
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

export async function GET() {
  try {
    const authUser = await getAuthenticatedUser();
    if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const dbUser = await getDbUser(authUser);

    const investments = await prisma.investment.findMany({
      where: { userId: dbUser.id },
      orderBy: { createdAt: "desc" },
      include: { category: true },
    });

    const formatted = investments.map(inv => ({
      ...inv,
      quantity: Number(inv.quantity),
      averageBuyPrice: Number(inv.averageBuyPrice),
      currentPrice: inv.currentPrice !== null ? Number(inv.currentPrice) : null,
      categoryName: inv.category?.name || "Uncategorized",
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("GET Investments Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// --- POST: CREATE INVESTMENT ---
export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthenticatedUser();
    if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const dbUser = await getDbUser(authUser);

    const body = await request.json();
    const validation = createInvestmentSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: "Invalid input", details: validation.error.format() }, { status: 400 });
    }

    const data = validation.data;

    // Optional: verify category exists
    if (data.categoryId) {
      const categoryExists = await prisma.category.findFirst({
        where: { id: data.categoryId, userId: dbUser.id },
      });
      if (!categoryExists) data.categoryId = null;
    }

    const investment = await prisma.investment.create({
      data: {
        userId: dbUser.id,
        name: data.name,
        symbol: data.symbol,
        quantity: data.quantity,
        averageBuyPrice: data.averageBuyPrice,
        currentPrice: data.currentPrice,
        categoryId: data.categoryId,
      },
      include: { category: true },
    });

    return NextResponse.json({
      ...investment,
      quantity: Number(investment.quantity),
      averageBuyPrice: Number(investment.averageBuyPrice),
      currentPrice: investment.currentPrice !== null ? Number(investment.currentPrice) : null,
      categoryName: investment.category?.name || "Uncategorized",
    });
  } catch (error) {
    console.error("POST Investment Error:", error);
    return NextResponse.json({ error: "Failed to create investment" }, { status: 500 });
  }
}
