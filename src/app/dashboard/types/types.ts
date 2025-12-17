import { z } from "zod";

export interface Message {
  id: string;
  type: "user" | "ai";
  text: string;
  timestamp: Date;
  downloadUrl?: string;
}

export interface KpiData {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  savingsRate: number;
  monthlyTrends: Array<{
    month: string;
    income: number;
    expense: number;
  }>;
  expensesByCategory: Array<{
    name: string;
    value: number;
  }>;
}

export interface MonthlyTrend {
  income: number;
  expense: number;
}

export interface ExpenseCategory {
  value: number;
}

export const MonthlyTrendSchema = z.object({
  income: z.number(),
  expense: z.number(),
});

export const ExpenseCategorySchema = z.object({
  value: z.number(),
});

export const KpiDataSchema = z.object({
  totalIncome: z.number(),
  totalExpense: z.number(),
  balance: z.number(),
  savingsRate: z.number(),
  monthlyTrends: z.array(MonthlyTrendSchema),
  expensesByCategory: z.array(ExpenseCategorySchema),
});

export interface MonthlyData {
  month: string;
  income: number;
  expense: number;
  savings: number;
}

export interface TrendData {
  month: string;
  income: number;
  expense: number;
  balance: number;
}

export interface DashboardTab {
  value: string;
  label: string;
}


