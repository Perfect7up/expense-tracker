"use client";

import { useMemo } from "react";
import { GenericCalendarView } from "@/app/core/components/shared/generic-calendar-view";
import { useExpenses } from "../hooks/use-expenses";

export function ExpenseCalendarView({
  onDateSelect,
  onShowMonthly,
  setDailyExpenses,
  setSelectedDate,
}: {
  onDateSelect?: (date: Date | undefined) => void;
  onShowMonthly?: () => void;
  setDailyExpenses?: (expenses: any[]) => void;
  setSelectedDate?: (date: Date | undefined) => void;
}) {
  const { expenses, isLoading } = useExpenses();

  // Transform expenses data for the generic calendar
  const calendarData = useMemo(() => {
    if (!expenses || !Array.isArray(expenses)) return [];

    return expenses.map((expense) => ({
      date: new Date(expense.occurredAt),
      amount: expense.amount,
      ...expense,
    }));
  }, [expenses]);

  return (
    <GenericCalendarView
      data={calendarData}
      isLoading={isLoading}
      title="Expense Calendar"
      description="Track your daily spending patterns"
      colorScheme="shared"
      showMonthlyButton={true}
      showAverage={true}
      onDateSelect={onDateSelect}
      onShowMonthly={onShowMonthly}
      setDailyData={setDailyExpenses}
      setSelectedDate={setSelectedDate}
      getItemDate={(item) => new Date(item.occurredAt || item.date)}
      getItemAmount={(item) => item.amount || 0}
    />
  );
}