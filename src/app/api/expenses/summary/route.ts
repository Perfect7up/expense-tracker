import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/app/core/lib/supabase/server";
import prisma from "@/app/core/lib/prisma";
import { Expense } from "@prisma/client"; // Import Prisma Expense type

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

// --- GET Handler for Expense Summary ---
export async function GET(request: NextRequest) {
  try {
    // 1. Get User Context
    const authUser = await getAuthenticatedUser();
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Sync with Database
    const dbUser = await getDbUser(authUser);

    // 3. Get query parameters
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "month"; // 'month' or 'year'
    const limit = parseInt(searchParams.get("limit") || "12");

    // 4. Calculate date range
    const now = new Date();
    let startDate: Date;

    if (period === "year") {
      startDate = new Date(now.getFullYear() - limit + 1, 0, 1);
    } else {
      startDate = new Date(now.getFullYear(), now.getMonth() - limit + 1, 1);
    }

    // 5. Fetch expenses in date range
    const expenses: Expense[] = await prisma.expense.findMany({
      where: {
        userId: dbUser.id,
        occurredAt: {
          gte: startDate,
          lte: now,
        },
      },
      orderBy: { occurredAt: "asc" },
    });

    // 6. Group by period
    const groupedData: Record<string, { amount: number; count: number }> = {};

    expenses.forEach((expense: Expense) => {
      const date = new Date(expense.occurredAt);
      let periodKey: string;

      if (period === "year") {
        periodKey = date.getFullYear().toString();
      } else {
        // Group by year-month
        periodKey = `${date.getFullYear()}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}`;
      }

      if (!groupedData[periodKey]) {
        groupedData[periodKey] = { amount: 0, count: 0 };
      }

      groupedData[periodKey].amount += Number(expense.amount);
      groupedData[periodKey].count += 1;
    });

    // 7. Format response
    const summary = Object.entries(groupedData).map(([period, data]) => ({
      period,
      totalAmount: Number(data.amount.toFixed(2)),
      expenseCount: data.count,
      averageAmount:
        data.count > 0 ? Number((data.amount / data.count).toFixed(2)) : 0,
    }));

    // 8. Sort by period (chronological)
    summary.sort((a, b) => a.period.localeCompare(b.period));

    return NextResponse.json(summary);
  } catch (error) {
    console.error("GET Expense Summary Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
