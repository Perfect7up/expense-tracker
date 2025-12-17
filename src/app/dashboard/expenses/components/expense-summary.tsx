"use client";

import { useState } from "react";
import { AnalyticsSummary } from "@/app/core/components/shared/analytics-summary";
import { useExpenseSummary } from "@/app/dashboard/expenses/hooks/use-expense-aggregate";

export function ExpenseSummary() {
  const [periodType, setPeriodType] = useState<"month" | "year">("month");

  const { data: expenseData, isLoading } = useExpenseSummary({
    period: periodType,
    limit: periodType === "month" ? 12 : 5,
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <AnalyticsSummary
      title="Expense Analytics"
      description="Advanced insights and spending patterns"
      data={expenseData}
      isLoading={isLoading}
      periodType={periodType}
      onPeriodChange={setPeriodType}
      formatCurrency={formatCurrency}
      emptyState={{
        title: "No data available for this period",
        description:
          "Start tracking your expenses to see detailed analytics and trends",
        buttonText: "Track Your First Expense",
        onButtonClick: () => console.log("Track expense clicked"),
      }}
      theme={{
        primary: "#3B82F6", // blue-500
        secondary: "#06B6D4", // cyan-500
        light: "#EFF6FF", // blue-50
        lighter: "#DBEAFE", // blue-100
        gradient: "from-blue-500 to-cyan-500",
      }}
    />
  );
}
