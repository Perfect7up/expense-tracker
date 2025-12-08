"use client";

import { useIncomes } from "./use-income";

export function useIncomeStats() {
  const { incomesQuery } = useIncomes();
  const incomes = incomesQuery.data || [];

  // Calculate current month total
  const getCurrentMonthTotal = () => {
    if (!incomes || incomes.length === 0) return 0;
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    return incomes
      .filter((income: any) => {
        const incomeDate = new Date(income.receivedAt);
        return (
          incomeDate.getFullYear() === currentYear &&
          incomeDate.getMonth() === currentMonth
        );
      })
      .reduce((total: number, income: any) => total + income.amount, 0);
  };

  // Calculate last month total
  const getLastMonthTotal = () => {
    if (!incomes || incomes.length === 0) return 0;
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthYear = lastMonth.getFullYear();
    const lastMonthIndex = lastMonth.getMonth();

    return incomes
      .filter((income: any) => {
        const incomeDate = new Date(income.receivedAt);
        return (
          incomeDate.getFullYear() === lastMonthYear &&
          incomeDate.getMonth() === lastMonthIndex
        );
      })
      .reduce((total: number, income: any) => total + income.amount, 0);
  };

  // Calculate current year total
  const getCurrentYearTotal = () => {
    if (!incomes || incomes.length === 0) return 0;
    const currentYear = new Date().getFullYear();

    return incomes
      .filter(
        (income: any) =>
          new Date(income.receivedAt).getFullYear() === currentYear
      )
      .reduce((total: number, income: any) => total + income.amount, 0);
  };

  const getAveragePerMonth = () => {
    if (!incomes || incomes.length === 0) return 0;

    const monthlyTotals = incomes.reduce(
      (acc: { [key: string]: number }, income: any) => {
        const date = new Date(income.receivedAt);
        const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
        acc[monthKey] = (acc[monthKey] || 0) + income.amount;
        return acc;
      },
      {} as { [key: string]: number }
    );

    const totalMonths = Object.keys(monthlyTotals).length;
    if (totalMonths === 0) return 0;

    const totalAmount = (Object.values(monthlyTotals) as number[]).reduce(
      (sum, amount) => sum + amount,
      0
    );

    return totalAmount / totalMonths;
  };

  return {
    currentMonthTotal: getCurrentMonthTotal(),
    lastMonthTotal: getLastMonthTotal(),
    currentYearTotal: getCurrentYearTotal(),
    averagePerMonth: getAveragePerMonth(),
    isLoading: incomesQuery.isLoading,
  };
}
