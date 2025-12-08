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

// --- GET Handler for Aggregate Expenses ---
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
    const period = searchParams.get("period") || "monthly"; // 'monthly' or 'yearly'
    const year = searchParams.get("year");
    const month = searchParams.get("month");
    const categoryId = searchParams.get("categoryId");

    // 4. Build where clause
    const whereClause: any = {
      userId: dbUser.id,
    };

    // Add date filtering if year/month provided
    if (year) {
      if (month) {
        // Filter by specific month and year
        const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
        const endDate = new Date(parseInt(year), parseInt(month), 0);
        whereClause.occurredAt = {
          gte: startDate,
          lte: endDate,
        };
      } else {
        // Filter by entire year
        const startDate = new Date(parseInt(year), 0, 1);
        const endDate = new Date(parseInt(year), 11, 31);
        whereClause.occurredAt = {
          gte: startDate,
          lte: endDate,
        };
      }
    }

    // Add category filtering if provided
    if (categoryId) {
      whereClause.categoryId = categoryId;
    }

    // 5. Fetch and aggregate expenses based on period
    if (period === "monthly") {
      // Monthly aggregation
      const monthlyExpenses = await prisma.$queryRaw`
        SELECT 
          EXTRACT(YEAR FROM "occurredAt") as year,
          EXTRACT(MONTH FROM "occurredAt") as month,
          TO_CHAR("occurredAt", 'YYYY-MM') as period,
          TO_CHAR("occurredAt", 'Mon YYYY') as periodDisplay,
          "currency",
          "categoryId",
          SUM(amount) as totalAmount,
          COUNT(*) as expenseCount
        FROM "Expense"
        WHERE "userId" = ${dbUser.id}
        ${categoryId ? prisma.$queryRaw`AND "categoryId" = ${categoryId}` : prisma.$queryRaw``}
        ${year ? prisma.$queryRaw`AND EXTRACT(YEAR FROM "occurredAt") = ${parseInt(year)}` : prisma.$queryRaw``}
        ${month ? prisma.$queryRaw`AND EXTRACT(MONTH FROM "occurredAt") = ${parseInt(month)}` : prisma.$queryRaw``}
        GROUP BY 
          EXTRACT(YEAR FROM "occurredAt"),
          EXTRACT(MONTH FROM "occurredAt"),
          "currency",
          "categoryId"
        ORDER BY 
          EXTRACT(YEAR FROM "occurredAt") DESC,
          EXTRACT(MONTH FROM "occurredAt") DESC
      `;

      return NextResponse.json(monthlyExpenses);
    } else if (period === "yearly") {
      // Yearly aggregation
      const yearlyExpenses = await prisma.$queryRaw`
        SELECT 
          EXTRACT(YEAR FROM "occurredAt") as year,
          EXTRACT(YEAR FROM "occurredAt")::text as period,
          EXTRACT(YEAR FROM "occurredAt")::text as periodDisplay,
          "currency",
          "categoryId",
          SUM(amount) as totalAmount,
          COUNT(*) as expenseCount
        FROM "Expense"
        WHERE "userId" = ${dbUser.id}
        ${categoryId ? prisma.$queryRaw`AND "categoryId" = ${categoryId}` : prisma.$queryRaw``}
        ${year ? prisma.$queryRaw`AND EXTRACT(YEAR FROM "occurredAt") = ${parseInt(year)}` : prisma.$queryRaw``}
        GROUP BY 
          EXTRACT(YEAR FROM "occurredAt"),
          "currency",
          "categoryId"
        ORDER BY 
          EXTRACT(YEAR FROM "occurredAt") DESC
      `;

      return NextResponse.json(yearlyExpenses);
    } else {
      return NextResponse.json(
        { error: "Invalid period. Use 'monthly' or 'yearly'" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("GET Aggregate Expenses Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
