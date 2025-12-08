"use client";

import { useQuery } from "@tanstack/react-query";
import {
  ExpenseAggregate,
  ExpenseSummary,
  PeriodTotals,
} from "../types/expense-aggregate";

interface UseExpenseAggregateParams {
  period?: "monthly" | "yearly";
  year?: number;
  month?: number;
  categoryId?: string;
  enabled?: boolean;
}

interface UseExpenseSummaryParams {
  period?: "month" | "year";
  limit?: number;
  enabled?: boolean;
}

export function useExpenseAggregate(params: UseExpenseAggregateParams = {}) {
  const {
    period = "monthly",
    year,
    month,
    categoryId,
    enabled = true,
  } = params;

  return useQuery<ExpenseAggregate[]>({
    queryKey: ["expense-aggregate", period, year, month, categoryId],
    queryFn: async () => {
      const url = new URL("/api/expenses/aggregate", window.location.origin);
      url.searchParams.set("period", period);
      if (year) url.searchParams.set("year", year.toString());
      if (month) url.searchParams.set("month", month.toString());
      if (categoryId) url.searchParams.set("categoryId", categoryId);

      const res = await fetch(url.toString());
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to fetch aggregate expenses");
      }
      return res.json();
    },
    enabled,
  });
}

export function useExpenseSummary(params: UseExpenseSummaryParams = {}) {
  const { period = "month", limit = 12, enabled = true } = params;

  return useQuery<ExpenseSummary[]>({
    queryKey: ["expense-summary", period, limit],
    queryFn: async () => {
      const url = new URL("/api/expenses/summary", window.location.origin);
      url.searchParams.set("period", period);
      url.searchParams.set("limit", limit.toString());

      const res = await fetch(url.toString());
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to fetch expense summary");
      }
      return res.json();
    },
    enabled,
  });
}

export function usePeriodTotals(period: "month" | "year" = "month") {
  return useQuery<PeriodTotals>({
    queryKey: ["period-totals", period],
    queryFn: async () => {
      const url = new URL("/api/expenses/totals", window.location.origin);
      url.searchParams.set("period", period);

      const res = await fetch(url.toString());
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to fetch period totals");
      }
      return res.json();
    },
  });
}
