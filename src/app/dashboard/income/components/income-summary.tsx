"use client";

import { useState } from "react";
import { AnalyticsSummary } from "@/app/core/components/shared/analytics-summary";
import { useIncomeSummary } from "@/app/dashboard/income/hooks/use-income-aggregate";

interface IncomeSummaryProps {
  showEmptyState?: boolean;
  onTrackIncome?: () => void;
}

export function IncomeSummary({
  showEmptyState = true,
  onTrackIncome = () => console.log("Track income clicked"),
}: IncomeSummaryProps) {
  const [periodType, setPeriodType] = useState<"month" | "year">("month");

  const { data: incomeData, isLoading } = useIncomeSummary({
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
      title="Income Analytics"
      description="Advanced insights and income patterns"
      data={incomeData}
      isLoading={isLoading}
      periodType={periodType}
      onPeriodChange={setPeriodType}
      formatCurrency={formatCurrency}
      emptyState={{
        title: "No income data available for this period",
        description:
          "Start tracking your income to see detailed analytics and trends",
        buttonText: "Track Your First Income",
        onButtonClick: onTrackIncome,
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
