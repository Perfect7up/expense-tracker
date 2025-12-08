import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/app/core/lib/supabase/server";
import prisma from "@/app/core/lib/prisma";
import { z } from "zod";

// --- Validation Schemas ---
const createIncomeSchema = z.object({
  amount: z.coerce.number().positive("Amount must be positive"),
  source: z.string().optional(),
  note: z.string().optional(),
  receivedAt: z.string().datetime().or(z.string()),
  currency: z.string().default("USD"),
  categoryId: z.string().optional().nullable(),
});

// --- Helper: Upsert user ---
async function getDbUser(authUser: { id: string; email?: string }) {
  return prisma.user.upsert({
    where: { supabaseId: authUser.id },
    create: { email: authUser.email!, supabaseId: authUser.id },
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
      include: { category: true }, // Include related data if needed
    });

    return NextResponse.json(
      incomes.map((i) => ({ ...i, amount: Number(i.amount) }))
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

    const body = await request.json();
    const validation = createIncomeSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validation.error.format() },
        { status: 400 }
      );
    }

    const dbUser = await getDbUser(authUser);
    const data = validation.data;

    const income = await prisma.income.create({
      data: {
        userId: dbUser.id,
        amount: data.amount,
        source: data.source || null,
        note: data.note || null,
        receivedAt: new Date(data.receivedAt),
        currency: data.currency,
        categoryId: data.categoryId || null,
      },
      include: { category: true },
    });

    return NextResponse.json({ ...income, amount: Number(income.amount) });
  } catch (error) {
    console.error("POST Income Error:", error);
    return NextResponse.json(
      { error: "Failed to create income" },
      { status: 500 }
    );
  }
}
