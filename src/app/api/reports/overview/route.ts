import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/app/core/lib/supabase/server";
import prisma from "@/app/core/lib/prisma";
import { getDbUser } from "../_utils";

export async function GET() {
  const authUser = await getAuthenticatedUser();
  if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await getDbUser(authUser);

  const [
    incomeAgg,
    expenseAgg,
    subscriptions,
    investments,
  ] = await Promise.all([
    prisma.income.aggregate({
      where: { userId: user.id },
      _sum: { amount: true },
    }),
    prisma.expense.aggregate({
      where: { userId: user.id },
      _sum: { amount: true },
    }),
    prisma.subscription.count({
      where: { userId: user.id, isActive: true },
    }),
    prisma.investment.findMany({
      where: { userId: user.id },
    }),
  ]);

  const totalIncome = Number(incomeAgg._sum.amount ?? 0);
  const totalExpense = Number(expenseAgg._sum.amount ?? 0);

  const totalInvested = investments.reduce(
    (sum, i) => sum + Number(i.quantity) * Number(i.averageBuyPrice),
    0
  );

  const currentValue = investments.reduce(
    (sum, i) => sum + Number(i.quantity) * Number(i.currentPrice ?? 0),
    0
  );

  return NextResponse.json({
    totalIncome,
    totalExpense,
    netBalance: totalIncome - totalExpense,
    activeSubscriptions: subscriptions,
    totalInvested,
    currentValue,
    profitLoss: currentValue - totalInvested,
  });
}
