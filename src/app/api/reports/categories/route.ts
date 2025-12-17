import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/app/core/lib/supabase/server";
import prisma from "@/app/core/lib/prisma";
import { getDbUser } from "../_utils";

export async function GET() {
  const authUser = await getAuthenticatedUser();
  if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await getDbUser(authUser);

  const expenses = await prisma.expense.groupBy({
    by: ["categoryId"],
    where: { userId: user.id },
    _sum: { amount: true },
  });

  const categories = await prisma.category.findMany({
    where: { userId: user.id },
  });

  const result = expenses.map(e => {
    const category = categories.find(c => c.id === e.categoryId);
    return {
      categoryId: e.categoryId,
      categoryName: category?.name || "Uncategorized",
      total: Number(e._sum.amount ?? 0),
    };
  });

  return NextResponse.json(result);
}
