"use client";

import { useIncomes } from "./use-income";

export function useIncomeStats() {
  // FIX: Destructure 'incomes' directly.
  // The 'incomesQuery' object was removed in the previous update to simplify the hook.
  const { incomes, isLoading } = useIncomes();

  // Safety check to ensure we always have an array
  const data = incomes || [];

  // Calculate current month total
  const getCurrentMonthTotal = () => {
    if (data.length === 0) return 0;
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    return data
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
    if (data.length === 0) return 0;
    const now = new Date();
    // Set date to the 1st to avoid edge cases (e.g. if today is 31st, jumping back 1 month might skip Feb)
    const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthYear = lastMonthDate.getFullYear();
    const lastMonthIndex = lastMonthDate.getMonth();

    return data
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
    if (data.length === 0) return 0;
    const currentYear = new Date().getFullYear();

    return data
      .filter(
        (income: any) =>
          new Date(income.receivedAt).getFullYear() === currentYear
      )
      .reduce((total: number, income: any) => total + income.amount, 0);
  };

  // Calculate Monthly Average
  const getAveragePerMonth = () => {
    if (data.length === 0) return 0;

    const monthlyTotals = data.reduce(
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
    isLoading: isLoading,
  };
}
