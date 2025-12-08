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

// --- GET Handler for Income Statistics ---
export async function GET(request: NextRequest) {
  try {
    // 1. Get User Context
    const authUser = await getAuthenticatedUser();
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Sync with Database
    const dbUser = await getDbUser(authUser);

    // 3. Get current date
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    // 4. Calculate current month stats
    const currentMonthStart = new Date(currentYear, currentMonth - 1, 1);
    const currentMonthEnd = new Date(currentYear, currentMonth, 0, 23, 59, 59);

    const currentMonthStats = await prisma.income.aggregate({
      where: {
        userId: dbUser.id,
        receivedAt: {
          gte: currentMonthStart,
          lte: currentMonthEnd,
        },
      },
      _sum: {
        amount: true,
      },
      _count: {
        id: true,
      },
    });

    // 5. Calculate last month stats
    const lastMonthStart = new Date(currentYear, currentMonth - 2, 1);
    const lastMonthEnd = new Date(currentYear, currentMonth - 1, 0, 23, 59, 59);

    const lastMonthStats = await prisma.income.aggregate({
      where: {
        userId: dbUser.id,
        receivedAt: {
          gte: lastMonthStart,
          lte: lastMonthEnd,
        },
      },
      _sum: {
        amount: true,
      },
    });

    // 6. Calculate current year stats
    const currentYearStart = new Date(currentYear, 0, 1);
    const currentYearEnd = new Date(currentYear, 11, 31, 23, 59, 59);

    const currentYearStats = await prisma.income.aggregate({
      where: {
        userId: dbUser.id,
        receivedAt: {
          gte: currentYearStart,
          lte: currentYearEnd,
        },
      },
      _sum: {
        amount: true,
      },
    });

    // 7. Calculate average per month
    const allIncomes = await prisma.income.findMany({
      where: {
        userId: dbUser.id,
      },
      select: {
        amount: true,
        receivedAt: true,
      },
    });

    // Group by month to calculate average
    const monthlyTotals = allIncomes.reduce(
      (acc: { [key: string]: number }, income) => {
        const date = new Date(income.receivedAt);
        const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
        acc[monthKey] = (acc[monthKey] || 0) + Number(income.amount);
        return acc;
      },
      {}
    );

    const totalMonths = Object.keys(monthlyTotals).length;
    const totalAmount = Object.values(monthlyTotals).reduce(
      (sum: number, amount) => sum + amount,
      0
    );
    const averagePerMonth = totalMonths > 0 ? totalAmount / totalMonths : 0;

    // 8. Calculate month-over-month change
    const currentMonthTotal = Number(currentMonthStats._sum.amount || 0);
    const lastMonthTotal = Number(lastMonthStats._sum.amount || 0);
    let monthOverMonthChange = 0;

    if (lastMonthTotal > 0) {
      monthOverMonthChange =
        ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;
    }

    // 9. Get top sources
    const topSources = await prisma.income.groupBy({
      by: ["source"],
      where: {
        userId: dbUser.id,
      },
      _sum: {
        amount: true,
      },
      _count: {
        id: true,
      },
      orderBy: {
        _sum: {
          amount: "desc",
        },
      },
      take: 5,
    });

    // 10. Return comprehensive stats
    return NextResponse.json({
      currentMonth: {
        totalAmount: Number(currentMonthTotal.toFixed(2)),
        incomeCount: currentMonthStats._count.id || 0,
        averageAmount:
          currentMonthStats._count.id > 0
            ? Number(
                (currentMonthTotal / currentMonthStats._count.id).toFixed(2)
              )
            : 0,
      },
      lastMonth: {
        totalAmount: Number(lastMonthTotal.toFixed(2)),
      },
      currentYear: {
        totalAmount: Number(currentYearStats._sum.amount?.toFixed(2) || 0),
      },
      averagePerMonth: Number(averagePerMonth.toFixed(2)),
      monthOverMonthChange: Number(monthOverMonthChange.toFixed(1)),
      topSources: topSources.map((source) => ({
        source: source.source || "Unknown",
        totalAmount: Number(source._sum.amount?.toFixed(2) || 0),
        incomeCount: source._count.id,
      })),
    });
  } catch (error) {
    console.error("GET Income Stats Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
