"use client";

import { useQueryClient } from "@tanstack/react-query";

const DASHBOARD_QUERY_KEYS = [
  "kpi",
  "transactions",
  "expenses",
  "incomes",
];

export function useDashboardRefresh() {
  const queryClient = useQueryClient();

  const refreshDashboard = () => {
    DASHBOARD_QUERY_KEYS.forEach((key) => {
      queryClient.invalidateQueries({ queryKey: [key] });
    });
  };

  return { refreshDashboard };
}
