"use client";

import { useExpenses } from "./use-expenses";

interface Expense {
  occurredAt: string | Date;
  amount: number; 
}

export function useExpenseStats() {
  const { expenses, isLoading } = useExpenses();

  // Cast expenses to the Expense type
  const typedExpenses = expenses as Expense[] | null;

  const getCurrentMonthTotal = () => {
    if (!typedExpenses) return 0;
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    return typedExpenses
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
    if (!typedExpenses) return 0;
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthYear = lastMonth.getFullYear();
    const lastMonthIndex = lastMonth.getMonth();

    return typedExpenses
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
    if (!typedExpenses) return 0;
    const currentYear = new Date().getFullYear();

    return typedExpenses
      .filter(
        (expense) => new Date(expense.occurredAt).getFullYear() === currentYear
      )
      .reduce((total, expense) => total + expense.amount, 0);
  };

  const getAveragePerMonth = () => {
    if (!typedExpenses || typedExpenses.length === 0) return 0;

    const monthlyTotals = typedExpenses.reduce(
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
      (sum: number, amount: number) => sum + amount,
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