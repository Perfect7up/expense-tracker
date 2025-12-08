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

// --- GET Handler for Aggregate Incomes ---
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
    const period = searchParams.get("period") || "monthly";
    const year = searchParams.get("year");
    const month = searchParams.get("month");
    const categoryId = searchParams.get("categoryId");
    const source = searchParams.get("source");

    // 4. Build where clause
    const whereClause: any = {
      userId: dbUser.id,
    };

    if (year) {
      if (month) {
        const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
        const endDate = new Date(parseInt(year), parseInt(month), 0);
        whereClause.receivedAt = {
          gte: startDate,
          lte: endDate,
        };
      } else {
        const startDate = new Date(parseInt(year), 0, 1);
        const endDate = new Date(parseInt(year), 11, 31);
        whereClause.receivedAt = {
          gte: startDate,
          lte: endDate,
        };
      }
    }

    if (categoryId) whereClause.categoryId = categoryId;
    if (source) whereClause.source = source;

    // 5. Fetch and aggregate incomes based on period
    if (period === "monthly") {
      // Monthly aggregation
      const monthlyIncomes = await prisma.income.groupBy({
        by: ["currency", "categoryId", "source"],
        where: whereClause,
        _sum: {
          amount: true,
        },
        _count: {
          id: true,
        },
        // REMOVED INVALID ORDER BY HERE
      });

      const result = monthlyIncomes.map((item) => ({
        currency: item.currency,
        categoryId: item.categoryId,
        source: item.source,
        totalAmount: Number(item._sum.amount || 0),
        incomeCount: item._count.id,
        period: `${year || "all"}-${month || "all"}`,
        periodDisplay: month
          ? new Date(
              parseInt(year || "0"),
              parseInt(month) - 1,
              1
            ).toLocaleDateString("en-US", { month: "short", year: "numeric" })
          : year || "All Time",
      }));

      return NextResponse.json(result);
    } else if (period === "yearly") {
      // Yearly aggregation
      const yearlyIncomes = await prisma.income.groupBy({
        by: ["currency", "categoryId", "source"],
        where: whereClause,
        _sum: {
          amount: true,
        },
        _count: {
          id: true,
        },
        // REMOVED INVALID ORDER BY HERE
      });

      const result = yearlyIncomes.map((item) => ({
        currency: item.currency,
        categoryId: item.categoryId,
        source: item.source,
        totalAmount: Number(item._sum.amount || 0),
        incomeCount: item._count.id,
        period: year || "all",
        periodDisplay: year || "All Years",
      }));

      return NextResponse.json(result);
    } else {
      return NextResponse.json(
        { error: "Invalid period. Use 'monthly' or 'yearly'" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("GET Aggregate Incomes Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
