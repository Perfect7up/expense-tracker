// app/dashboard/hooks/useKpi.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { KpiData } from "../types/types";

async function fetchKpi(): Promise<KpiData> {
  const res = await fetch("/api/kpi");
  if (!res.ok) throw new Error("Failed to fetch KPI data");

  const data: KpiData = await res.json();

  if (!data.expensesByCategory || data.expensesByCategory.length === 0) {
    data.expensesByCategory = [
      { name: "Food & Dining", value: 420 },
      { name: "Shopping", value: 350 },
      { name: "Transportation", value: 220 },
      { name: "Entertainment", value: 180 },
      { name: "Utilities", value: 120 },
    ];
  }

  return data;
}

export function useKpi() {
  return useQuery<KpiData, Error>({
    queryKey: ["kpi"],
    queryFn: fetchKpi,
    staleTime: 1000 * 60 * 5, // cache for 5 minutes
    refetchOnWindowFocus: false, // prevent double fetch on tab focus
  });
}
