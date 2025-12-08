"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/app/core/components/ui/button";
import { Calendar } from "@/app/core/components/ui/calendar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/core/components/ui/card";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  List,
} from "lucide-react";
import { useExpenses } from "@/app/core/hooks/use-expenses";

export function CalendarView({
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
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [localSelectedDate, setLocalSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const { expenses } = useExpenses();

  // FIX: Wrap this in useCallback to make it a stable dependency
  const getExpensesForSelectedDate = useCallback(
    (date: Date | undefined) => {
      if (!date || !expenses) return [];
      return expenses.filter((expense) => {
        const d = new Date(expense.occurredAt);
        return (
          d.getDate() === date.getDate() &&
          d.getMonth() === date.getMonth() &&
          d.getFullYear() === date.getFullYear()
        );
      });
    },
    [expenses]
  );

  // Handle selecting a date
  const handleDateSelect = (date: Date | undefined) => {
    setLocalSelectedDate(date);
    if (onDateSelect) onDateSelect(date);
    if (setSelectedDate) setSelectedDate(date);

    const daily = getExpensesForSelectedDate(date);
    if (setDailyExpenses) setDailyExpenses(daily);
  };

  // Navigate months
  const goToPreviousMonth = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  const goToNextMonth = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  const goToToday = () => handleDateSelect(new Date());

  // Update daily expenses when selected date changes or expenses update
  useEffect(() => {
    const daily = getExpensesForSelectedDate(localSelectedDate);
    if (setDailyExpenses) setDailyExpenses(daily);
  }, [localSelectedDate, getExpensesForSelectedDate, setDailyExpenses]);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center">
          <CardTitle className="flex items-center gap-2 grow">
            <CalendarIcon className="h-5 w-5" />
            Calendar View
          </CardTitle>

          <Button
            variant="outline"
            size="sm"
            onClick={onShowMonthly}
            disabled={!localSelectedDate}
            className="gap-2"
          >
            <List className="h-4 w-4" />
            Show Month
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {/* Month Navigation */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h3 className="text-lg font-semibold">
              {currentMonth.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </h3>
            <Button variant="outline" size="sm" onClick={goToNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="outline" size="sm" onClick={goToToday}>
            Today
          </Button>
        </div>

        {/* Calendar */}
        <div className="mb-6">
          <Calendar
            mode="single"
            selected={localSelectedDate}
            onSelect={handleDateSelect}
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            disabled={{ after: new Date() }}
            className="rounded-lg border w-full"
            classNames={{
              table: "w-full !block grid grid-cols-7 gap-2",
              head_row: "contents",
              head_cell:
                "text-center text-sm font-medium text-muted-foreground py-1.5",
              row: "contents",
              cell: "p-0 flex items-center justify-center min-w-[50px] min-h-[50px]",
              day: "w-full h-full flex items-center justify-center rounded-md text-base font-medium hover:bg-accent",
              day_selected: "bg-primary text-primary-foreground",
              day_today: "bg-accent text-accent-foreground",
              day_outside: "opacity-40",
              day_disabled: "opacity-30",
              day_hidden: "invisible",
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
