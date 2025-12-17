// hooks/use-income-aggregate.ts
"use client";

import { useQuery } from "@tanstack/react-query";

export interface IncomeSummary {
  period: string;
  totalAmount: number;
  count: number;
  averageAmount: number;
}

interface UseIncomeSummaryParams {
  period?: "month" | "year";
  limit?: number;
  enabled?: boolean;
}

export function useIncomeSummary(params: UseIncomeSummaryParams = {}) {
  const { period = "month", limit = 12, enabled = true } = params;

  return useQuery<IncomeSummary[]>({
    queryKey: ["income-summary", period, limit],
    queryFn: async () => {
      const url = new URL("/api/incomes/summary", window.location.origin);
      url.searchParams.set("period", period);
      url.searchParams.set("limit", limit.toString());

      console.log("Fetching income summary from:", url.toString());

      const res = await fetch(url.toString());
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to fetch income summary");
      }

      const data = await res.json();
      console.log("Income API raw data:", data);

      // Transform the data to match IncomeSummary interface
      const transformed = data.map((item: any) => ({
        period: item.period,
        totalAmount: item.totalAmount || 0,
        count: item.incomeCount || item.count || 0, // Map incomeCount to count
        averageAmount: item.averageAmount || 0,
      }));

      console.log("Transformed income data:", transformed);
      return transformed;
    },
    enabled,
  });
}
