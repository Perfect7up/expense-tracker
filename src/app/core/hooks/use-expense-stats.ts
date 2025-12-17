"use client";

import { useExpenses } from "./use-expenses";

export function useExpenseStats() {
  const { expenses, isLoading } = useExpenses();

  const getCurrentMonthTotal = () => {
    if (!expenses) return 0;
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    return expenses
      .filter((expense) => {
        const expenseDate = new Date(expense.occurredAt);
        return (
          expenseDate.getFullYear() === currentYear &&
          expenseDate.getMonth() === currentMonth
        );
      })
      .reduce((total, expense) => total + expense.amount, 0);
  };

  // Calculate last month total
  const getLastMonthTotal = () => {
    if (!expenses) return 0;
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthYear = lastMonth.getFullYear();
    const lastMonthIndex = lastMonth.getMonth();

    return expenses
      .filter((expense) => {
        const expenseDate = new Date(expense.occurredAt);
        return (
          expenseDate.getFullYear() === lastMonthYear &&
          expenseDate.getMonth() === lastMonthIndex
        );
      })
      .reduce((total, expense) => total + expense.amount, 0);
  };

  // Calculate current year total
  const getCurrentYearTotal = () => {
    if (!expenses) return 0;
    const currentYear = new Date().getFullYear();

    return expenses
      .filter(
        (expense) => new Date(expense.occurredAt).getFullYear() === currentYear
      )
      .reduce((total, expense) => total + expense.amount, 0);
  };

  // Calculate average per month
  const getAveragePerMonth = () => {
    if (!expenses || expenses.length === 0) return 0;

    // Group expenses by month
    const monthlyTotals = expenses.reduce(
      (acc: { [key: string]: number }, expense) => {
        const date = new Date(expense.occurredAt);
        const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
        acc[monthKey] = (acc[monthKey] || 0) + expense.amount;
        return acc;
      },
      {}
    );

    const totalMonths = Object.keys(monthlyTotals).length;
    if (totalMonths === 0) return 0;

    const totalAmount = Object.values(monthlyTotals).reduce(
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
    isLoading,
  };
}
