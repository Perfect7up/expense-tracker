// app/dashboard/hooks/useKpi.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { KpiData } from "../types/types";

async function fetchKpi(): Promise<KpiData> {
  const res = await fetch("/api/kpi");
  if (!res.ok) throw new Error("Failed to fetch KPI data");

  const data: KpiData = await res.json();

  // Ensure expensesByCategory exists as an empty array if not provided
  if (!data.expensesByCategory) {
    data.expensesByCategory = [];
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