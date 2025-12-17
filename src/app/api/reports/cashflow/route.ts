import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAuthenticatedUser } from "@/app/core/lib/supabase/server";
import prisma from "@/app/core/lib/prisma";
import { getDbUser } from "../_utils";

const querySchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const authUser = await getAuthenticatedUser();
  if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await getDbUser(authUser);

  const parsed = querySchema.safeParse(
    Object.fromEntries(req.nextUrl.searchParams)
  );
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid query params" }, { status: 400 });
  }

  const { from, to } = parsed.data;

  const dateFilter =
    from || to
      ? {
          gte: from ? new Date(from) : undefined,
          lte: to ? new Date(to) : undefined,
        }
      : undefined;

  const [income, expense] = await Promise.all([
    prisma.income.aggregate({
      where: { userId: user.id, receivedAt: dateFilter },
      _sum: { amount: true },
    }),
    prisma.expense.aggregate({
      where: { userId: user.id, occurredAt: dateFilter },
      _sum: { amount: true },
    }),
  ]);

  const totalIncome = Number(income._sum.amount ?? 0);
  const totalExpense = Number(expense._sum.amount ?? 0);

  return NextResponse.json({
    from,
    to,
    totalIncome,
    totalExpense,
    net: totalIncome - totalExpense,
  });
}
