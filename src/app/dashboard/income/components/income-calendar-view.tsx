"use client";

import { useMemo } from "react";
import { GenericCalendarView } from "@/app/core/components/shared/generic-calendar-view";
import { useIncomes } from "@/app/dashboard/income/hooks/use-income";

interface IncomeCalendarViewProps {
  onDateSelect?: (date: Date | undefined) => void;
  onShowMonthly?: () => void;
  setDailyIncomes?: (incomes: any[]) => void;
  setSelectedDate?: (date: Date | undefined) => void;
}

export function IncomeCalendarView({
  onDateSelect,
  onShowMonthly,
  setDailyIncomes,
  setSelectedDate,
}: IncomeCalendarViewProps) {
  const { incomes, isLoading } = useIncomes();

  const calendarData = useMemo(() => {
    if (!incomes || !Array.isArray(incomes)) return [];

    return incomes.map((income: any) => ({
      date: new Date(income.receivedAt || income.date),
      amount: income.amount,
      ...income,
    }));
  }, [incomes]);

  return (
    <GenericCalendarView
      data={calendarData}
      isLoading={isLoading}
      title="Income Calendar"
      description="Track your daily income patterns"
      colorScheme="shared" // or "income" if your GenericCalendarView supports it specifically
      showMonthlyButton={true}
      showAverage={true}
      onDateSelect={onDateSelect}
      onShowMonthly={onShowMonthly}
      setDailyData={setDailyIncomes}
      setSelectedDate={setSelectedDate}
      getItemDate={(item) => new Date(item.receivedAt || item.date)}
      getItemAmount={(item) => item.amount || 0}
    />
  );
}
