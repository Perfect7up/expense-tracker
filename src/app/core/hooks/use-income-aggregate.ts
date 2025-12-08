"use client";

import { useQuery } from "@tanstack/react-query";

interface IncomeAggregate {
  period: string;
  periodDisplay: string;
  totalAmount: number;
  incomeCount: number;
  currency: string;
  categoryId?: string;
  source?: string;
  year?: number;
  month?: number;
}

interface IncomeSummary {
  period: string;
  totalAmount: number;
  incomeCount: number;
  averageAmount: number;
}

interface IncomePeriodTotals {
  period: string;
  totalAmount: number;
  incomeCount: number;
  previousPeriodTotal: number;
  percentageChange: number;
  startDate: string;
  endDate: string;
}

interface UseIncomeAggregateParams {
  period?: "monthly" | "yearly";
  year?: number;
  month?: number;
  categoryId?: string;
  source?: string;
  enabled?: boolean;
}

interface UseIncomeSummaryParams {
  period?: "month" | "year";
  limit?: number;
  source?: string;
  enabled?: boolean;
}

export function useIncomeAggregate(params: UseIncomeAggregateParams = {}) {
  const {
    period = "monthly",
    year,
    month,
    categoryId,
    source,
    enabled = true,
  } = params;

  return useQuery<IncomeAggregate[]>({
    queryKey: ["income-aggregate", period, year, month, categoryId, source],
    queryFn: async () => {
      const url = new URL("/api/incomes/aggregate", window.location.origin);
      url.searchParams.set("period", period);
      if (year) url.searchParams.set("year", year.toString());
      if (month) url.searchParams.set("month", month.toString());
      if (categoryId) url.searchParams.set("categoryId", categoryId);
      if (source) url.searchParams.set("source", source);

      const res = await fetch(url.toString());
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to fetch aggregate incomes");
      }
      return res.json();
    },
    enabled,
  });
}

export function useIncomeSummary(params: UseIncomeSummaryParams = {}) {
  const { period = "month", limit = 12, source, enabled = true } = params;

  return useQuery<IncomeSummary[]>({
    queryKey: ["income-summary", period, limit, source],
    queryFn: async () => {
      const url = new URL("/api/incomes/summary", window.location.origin);
      url.searchParams.set("period", period);
      url.searchParams.set("limit", limit.toString());
      if (source) url.searchParams.set("source", source);

      const res = await fetch(url.toString());
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to fetch income summary");
      }
      return res.json();
    },
    enabled,
  });
}

export function useIncomePeriodTotals(
  period: "month" | "year" = "month",
  source?: string
) {
  return useQuery<IncomePeriodTotals>({
    queryKey: ["income-period-totals", period, source],
    queryFn: async () => {
      const url = new URL("/api/incomes/totals", window.location.origin);
      url.searchParams.set("period", period);
      if (source) url.searchParams.set("source", source);

      const res = await fetch(url.toString());
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to fetch period totals");
      }
      return res.json();
    },
  });
}
