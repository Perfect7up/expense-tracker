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

// --- GET Handler for Current Period Totals ---
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

    // 4. Calculate date range
    const now = new Date();
    let startDate: Date;

    if (period === "year") {
      // Current year
      startDate = new Date(now.getFullYear(), 0, 1);
    } else {
      // Current month
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    const endDate =
      period === "year"
        ? new Date(now.getFullYear(), 11, 31, 23, 59, 59)
        : new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    // 5. Fetch total for period
    const totalResult = await prisma.expense.aggregate({
      where: {
        userId: dbUser.id,
        occurredAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        amount: true,
      },
      _count: {
        id: true,
      },
    });

    // 6. Also get previous period for comparison
    let previousStartDate: Date;
    let previousEndDate: Date;

    if (period === "year") {
      previousStartDate = new Date(now.getFullYear() - 1, 0, 1);
      previousEndDate = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59);
    } else {
      previousStartDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      previousEndDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        0,
        23,
        59,
        59
      );
    }

    const previousTotalResult = await prisma.expense.aggregate({
      where: {
        userId: dbUser.id,
        occurredAt: {
          gte: previousStartDate,
          lte: previousEndDate,
        },
      },
      _sum: {
        amount: true,
      },
    });

    // 7. Calculate percentage change
    const currentTotal = Number(totalResult._sum.amount || 0);
    const previousTotal = Number(previousTotalResult._sum.amount || 0);
    let percentageChange = 0;

    if (previousTotal > 0) {
      percentageChange = ((currentTotal - previousTotal) / previousTotal) * 100;
    }

    // 8. Return response
    return NextResponse.json({
      period,
      totalAmount: Number(currentTotal.toFixed(2)),
      expenseCount: totalResult._count.id || 0,
      previousPeriodTotal: Number(previousTotal.toFixed(2)),
      percentageChange: Number(percentageChange.toFixed(1)),
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });
  } catch (error) {
    console.error("GET Expense Totals Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
