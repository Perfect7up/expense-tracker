// app/api/kpi/route.ts
import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/app/core/lib/supabase/server";
import prisma from "@/app/core/lib/prisma";

export async function GET() {
  try {
    const authUser = await getAuthenticatedUser();
    if (!authUser)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Get internal DB user
    const dbUser = await prisma.user.upsert({
      where: { supabaseId: authUser.id },
      create: {
        email: authUser.email!,
        supabaseId: authUser.id,
      },
      update: {},
    });

    const userId = dbUser.id;

    // Get current month date range
    const currentDate = new Date();
    const firstDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const lastDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );

    // Fetch total incomes for current month
    const totalIncomeRaw = await prisma.income.aggregate({
      _sum: { amount: true },
      where: {
        userId,
        receivedAt: {
          gte: firstDayOfMonth,
          lte: lastDayOfMonth,
        },
      },
    });

    // Fetch total expenses for current month
    const totalExpenseRaw = await prisma.expense.aggregate({
      _sum: { amount: true },
      where: {
        userId,
        occurredAt: {
          gte: firstDayOfMonth,
          lte: lastDayOfMonth,
        },
      },
    });

    // Fetch last 6 months data for trend chart
    const last6Months = [];
    for (let i = 5; i >= 0; i--) {
      const month = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1
      );
      const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
      const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0);

      last6Months.push({
        start: monthStart,
        end: monthEnd,
        name: month.toLocaleDateString("en-US", { month: "short" }),
      });
    }

    // Get monthly data for trends
    const monthlyData = await Promise.all(
      last6Months.map(async (month) => {
        const monthlyIncome = await prisma.income.aggregate({
          _sum: { amount: true },
          where: {
            userId,
            receivedAt: {
              gte: month.start,
              lte: month.end,
            },
          },
        });

        const monthlyExpense = await prisma.expense.aggregate({
          _sum: { amount: true },
          where: {
            userId,
            occurredAt: {
              gte: month.start,
              lte: month.end,
            },
          },
        });

        return {
          month: month.name,
          income: monthlyIncome._sum.amount
            ? Number(monthlyIncome._sum.amount)
            : 0,
          expense: monthlyExpense._sum.amount
            ? Number(monthlyExpense._sum.amount)
            : 0,
        };
      })
    );

    // Get expenses by category for current month
    const expensesByCategory = await prisma.expense.groupBy({
      by: ["categoryId"],
      where: {
        userId,
        occurredAt: {
          gte: firstDayOfMonth,
          lte: lastDayOfMonth,
        },
      },
      _sum: {
        amount: true,
      },
    });

    // Get category names
    const categories = await prisma.category.findMany({
      where: {
        id: {
          in: expensesByCategory
            .map((e) => e.categoryId)
            .filter(Boolean) as string[],
        },
      },
    });

    const categoryData = expensesByCategory.map((expense) => {
      const category = categories.find((c) => c.id === expense.categoryId);
      return {
        name: category?.name || "Uncategorized",
        value: Number(expense._sum.amount) || 0,
      };
    });

    const totalIncome = totalIncomeRaw._sum.amount
      ? Number(totalIncomeRaw._sum.amount)
      : 0;
    const totalExpense = totalExpenseRaw._sum.amount
      ? Number(totalExpenseRaw._sum.amount)
      : 0;
    const balance = totalIncome - totalExpense;

    // Calculate additional metrics
    const savingsRate = totalIncome > 0 ? (balance / totalIncome) * 100 : 0;

    return NextResponse.json({
      totalIncome,
      totalExpense,
      balance,
      savingsRate: parseFloat(savingsRate.toFixed(2)),
      monthlyTrends: monthlyData,
      expensesByCategory: categoryData,
    });
  } catch (error) {
    console.error("GET KPI Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
