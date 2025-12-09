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

// --- Helper: Build Date Range ---
function buildDateRange(year?: string, month?: string) {
  if (!year) return {};

  if (month) {
    const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    const endDate = new Date(parseInt(year), parseInt(month), 0);
    return {
      gte: startDate,
      lte: endDate,
    };
  } else {
    const startDate = new Date(parseInt(year), 0, 1);
    const endDate = new Date(parseInt(year), 11, 31);
    return {
      gte: startDate,
      lte: endDate,
    };
  }
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

    // 4. Validate period parameter
    if (!["monthly", "yearly"].includes(period)) {
      return NextResponse.json(
        { error: "Invalid period. Use 'monthly' or 'yearly'" },
        { status: 400 }
      );
    }

    // 5. Build where clause
    const whereClause: any = {
      userId: dbUser.id,
    };

    // Add date filter if year is provided
    if (year) {
      whereClause.receivedAt = buildDateRange(year, month || undefined);
    }

    // Add optional filters
    if (categoryId) whereClause.categoryId = categoryId;
    if (source) whereClause.source = source;

    // 6. Fetch and aggregate incomes based on period
    let result;

    if (period === "monthly") {
      const monthlyIncomes = await prisma.income.groupBy({
        by: ["currency", "categoryId", "source"],
        where: whereClause,
        _sum: {
          amount: true,
        },
        _count: {
          id: true,
        },
      });

      // Sort by total amount (descending) after fetching
      type MonthlyIncome = (typeof monthlyIncomes)[number];
      const sortedIncomes = [...monthlyIncomes].sort(
        (a: MonthlyIncome, b: MonthlyIncome) => {
          const amountA = Number(a._sum.amount || 0);
          const amountB = Number(b._sum.amount || 0);
          return amountB - amountA;
        }
      );

      result = sortedIncomes.map((item) => ({
        currency: item.currency,
        categoryId: item.categoryId,
        source: item.source,
        totalAmount: Number(item._sum.amount || 0),
        incomeCount: item._count.id,
        period: `${year || "all"}-${month || "all"}`,
        periodDisplay:
          month && year
            ? new Date(
                parseInt(year),
                parseInt(month) - 1,
                1
              ).toLocaleDateString("en-US", { month: "short", year: "numeric" })
            : year || "All Time",
      }));
    } else {
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
      });

      // Sort by total amount (descending) after fetching
      type YearlyIncome = (typeof yearlyIncomes)[number];
      const sortedIncomes = [...yearlyIncomes].sort(
        (a: YearlyIncome, b: YearlyIncome) => {
          const amountA = Number(a._sum.amount || 0);
          const amountB = Number(b._sum.amount || 0);
          return amountB - amountA;
        }
      );

      result = sortedIncomes.map((item) => ({
        currency: item.currency,
        categoryId: item.categoryId,
        source: item.source,
        totalAmount: Number(item._sum.amount || 0),
        incomeCount: item._count.id,
        period: year || "all",
        periodDisplay: year || "All Years",
      }));
    }

    // 7. Optionally, fetch category details if needed
    // This can be added if you want to include category names in the response
    if (result.length > 0) {
      const categoryIds = [
        ...new Set(result.map((item) => item.categoryId).filter(Boolean)),
      ];

      if (categoryIds.length > 0) {
        const categories = await prisma.category.findMany({
          where: {
            id: { in: categoryIds as string[] },
          },
          select: {
            id: true,
            name: true,
          },
        });

        const categoryMap = new Map(
          categories.map((cat: { id: string; name: string }) => [cat.id, cat])
        );

        result = result.map((item) => ({
          ...item,
          category: item.categoryId ? categoryMap.get(item.categoryId) : null,
        }));
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("GET Aggregate Incomes Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
