import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/app/core/lib/supabase/server";
import prisma from "@/app/core/lib/prisma";
import { getDbUser } from "../_utils";

export async function GET() {
  const authUser = await getAuthenticatedUser();
  if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await getDbUser(authUser);

  const investments = await prisma.investment.findMany({
    where: { userId: user.id },
  });

  const report = investments.map(i => {
    const invested = Number(i.quantity) * Number(i.averageBuyPrice);
    const current = Number(i.quantity) * Number(i.currentPrice ?? 0);

    return {
      id: i.id,
      name: i.name,
      quantity: Number(i.quantity),
      investedAmount: invested,
      currentValue: current,
      profitLoss: current - invested,
    };
  });

  return NextResponse.json(report);
}
