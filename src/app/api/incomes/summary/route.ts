import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/app/core/lib/supabase/server";
import prisma from "@/app/core/lib/prisma";

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

// --- GET Handler for Income Summary ---
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
    const source = searchParams.get("source");

    // 4. Calculate date range
    const now = new Date();
    let startDate: Date;

    if (period === "year") {
      // Get incomes for the last N years
      startDate = new Date(now.getFullYear() - limit + 1, 0, 1);
    } else {
      // Get incomes for the last N months
      startDate = new Date(now.getFullYear(), now.getMonth() - limit + 1, 1);
    }

    // 5. Build where clause
    const whereClause: any = {
      userId: dbUser.id,
      receivedAt: {
        gte: startDate,
        lte: now,
      },
    };

    if (source) {
      whereClause.source = source;
    }

    // 6. Fetch all incomes in date range
    const incomes = await prisma.income.findMany({
      where: whereClause,
      orderBy: { receivedAt: "asc" },
    });

    // 7. Group by period in memory
    const groupedData: Record<string, { amount: number; count: number }> = {};

    incomes.forEach((income) => {
      const date = new Date(income.receivedAt);
      let periodKey: string;

      if (period === "year") {
        periodKey = date.getFullYear().toString();
      } else {
        // Group by year-month
        periodKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`;
      }

      if (!groupedData[periodKey]) {
        groupedData[periodKey] = { amount: 0, count: 0 };
      }

      groupedData[periodKey].amount += Number(income.amount);
      groupedData[periodKey].count += 1;
    });

    // 8. Format response
    const summary = Object.entries(groupedData).map(([period, data]) => ({
      period,
      totalAmount: Number(data.amount.toFixed(2)),
      incomeCount: data.count,
      averageAmount:
        data.count > 0 ? Number((data.amount / data.count).toFixed(2)) : 0,
    }));

    // 9. Sort by period (chronological)
    summary.sort((a, b) => a.period.localeCompare(b.period));

    return NextResponse.json(summary);
  } catch (error) {
    console.error("GET Income Summary Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
