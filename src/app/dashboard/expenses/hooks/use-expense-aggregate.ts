// hooks/use-expense-aggregate.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { AnalyticsData } from "../../../core/types/analytics";

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

  return useQuery<AnalyticsData[]>({
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

      const data = await res.json();
      // Transform the data to match AnalyticsData interface
      return data.map((item: any) => ({
        period: item.period,
        totalAmount: item.totalAmount || item.total || 0,
        count: item.count || item.expenseCount || 0,
        averageAmount: item.averageAmount || item.average || 0,
      }));
    },
    enabled,
  });
}

export function useExpenseSummary(params: UseExpenseSummaryParams = {}) {
  const { period = "month", limit = 12, enabled = true } = params;

  return useQuery<AnalyticsData[]>({
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

      const data = await res.json();
      // Transform the data to match AnalyticsData interface
      return data.map((item: any) => ({
        period: item.period,
        totalAmount: item.totalAmount || item.total || 0,
        count: item.count || item.expenseCount || 0,
        averageAmount: item.averageAmount || item.average || 0,
      }));
    },
    enabled,
  });
}
