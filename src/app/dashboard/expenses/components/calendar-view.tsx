"use client";

import { useState, useEffect, useCallback } from "react";
import {
  format,
  isSameDay,
  isSameMonth,
  addMonths,
  subMonths,
  getDate,
} from "date-fns";

import { Button } from "@/app/core/components/ui/button";
import { Calendar } from "@/app/core/components/ui/calendar";
import {
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/core/components/ui/card";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  List,
  Target,
  TrendingUp,
  DollarSign,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useExpenses } from "@/app/core/hooks/use-expenses";
import { Badge } from "@/app/core/components/ui/badge";

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

  // 1. Get total spent for the month
  const getMonthlyTotal = useCallback(() => {
    if (!expenses || !Array.isArray(expenses)) return 0;

    return expenses
      .filter((expense) => {
        if (!expense?.occurredAt) return false;
        return isSameMonth(new Date(expense.occurredAt), currentMonth);
      })
      .reduce((sum, expense) => sum + (expense?.amount || 0), 0);
  }, [expenses, currentMonth]);

  // 2. Get days with expenses
  const getDaysWithExpenses = useCallback(() => {
    if (!expenses || !Array.isArray(expenses)) return new Set<number>();

    const days = new Set<number>();
    expenses.forEach((expense) => {
      if (!expense?.occurredAt) return;
      const expenseDate = new Date(expense.occurredAt);

      if (isSameMonth(expenseDate, currentMonth)) {
        days.add(getDate(expenseDate));
      }
    });
    return days;
  }, [expenses, currentMonth]);

  // 3. Get expenses for specific date
  const getExpensesForSelectedDate = useCallback(
    (date: Date | undefined) => {
      if (!date || !expenses || !Array.isArray(expenses)) return [];

      return expenses.filter((expense) => {
        if (!expense?.occurredAt) return false;
        return isSameDay(new Date(expense.occurredAt), date);
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
  const goToPreviousMonth = () => setCurrentMonth((prev) => subMonths(prev, 1));
  const goToNextMonth = () => setCurrentMonth((prev) => addMonths(prev, 1));
  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    handleDateSelect(today);
  };

  // Get expense total for selected date
  const getDailyTotal = (date: Date | undefined) => {
    if (!date) return 0;
    const dailyExpenses = getExpensesForSelectedDate(date);
    return dailyExpenses.reduce(
      (sum, expense) => sum + (expense?.amount || 0),
      0
    );
  };

  useEffect(() => {
    const daily = getExpensesForSelectedDate(localSelectedDate);
    if (setDailyExpenses) setDailyExpenses(daily);
  }, [localSelectedDate, getExpensesForSelectedDate, setDailyExpenses]);

  const daysWithExpenses = getDaysWithExpenses();
  const monthlyTotal = getMonthlyTotal();

  // Custom component to render inside the day button
  // We use 'any' for props here to be flexible with different react-day-picker versions
  const CustomDayContent = (props: any) => {
    const { date } = props;

    // Safety check if date is missing
    if (!date) return null;

    const dayNumber = getDate(date);
    const dailyTotal = getDailyTotal(date);

    // Check if this date has expenses and is in the current month
    const hasExpenses =
      daysWithExpenses.has(dayNumber) && isSameMonth(date, currentMonth);

    return (
      <div className="relative flex items-center justify-center w-full h-full">
        <span>{format(date, "d")}</span>
        {hasExpenses && dailyTotal > 0 && (
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
            <div
              className={`w-1.5 h-1.5 rounded-full ${
                dailyTotal > 100
                  ? "bg-red-500"
                  : dailyTotal > 50
                    ? "bg-amber-500"
                    : "bg-emerald-500"
              }`}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative">
      {/* Background effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-1/3 left-1/4 w-48 h-48 bg-blue-100/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-cyan-100/10 rounded-full blur-3xl" />
      </div>

      <div className="bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-2xl shadow-xl overflow-hidden">
        <div className="relative bg-linear-to-r from-blue-500 to-cyan-500 p-6">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 blur-2xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12 blur-2xl" />

          <CardHeader className="relative z-10 p-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                  <CalendarIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-white">
                    Calendar View
                  </CardTitle>
                  <p className="text-sm text-blue-100/80">
                    Track your daily spending patterns
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 border border-white/30">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-white" />
                    <span className="text-sm font-medium text-white">
                      Monthly
                    </span>
                  </div>
                  <p className="text-lg font-bold text-white mt-1">
                    ${monthlyTotal.toFixed(2)}
                  </p>
                </div>

                <Button
                  onClick={onShowMonthly}
                  disabled={!localSelectedDate}
                  className="rounded-xl bg-white/20 backdrop-blur-sm hover:bg-white/30 border border-white/30 text-white gap-2 px-4 h-12 transition-all duration-300 group"
                >
                  <List className="h-4 w-4" />
                  Show Month
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </CardHeader>
        </div>

        <CardContent className="p-6 space-y-6">
          {/* Month Navigation */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-linear-to-r from-blue-50/50 to-cyan-50/50 rounded-xl border border-blue-100/30">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPreviousMonth}
                className="rounded-lg w-10 h-10 border-blue-200/50 hover:bg-blue-50 hover:border-blue-300"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-center">
                <h3 className="text-xl font-bold text-slate-900">
                  {format(currentMonth, "MMMM yyyy")}
                </h3>
                <Badge className="mt-1 bg-linear-to-r from-blue-100 to-cyan-100 text-blue-700 border-blue-200/50">
                  <Target className="w-3 h-3 mr-1" />
                  {daysWithExpenses.size} days with expenses
                </Badge>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={goToNextMonth}
                className="rounded-lg w-10 h-10 border-blue-200/50 hover:bg-blue-50 hover:border-blue-300"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={goToToday}
                className="rounded-xl border-blue-200/50 hover:bg-blue-50 hover:border-blue-300 px-4 h-10"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Go to Today
              </Button>
            </div>
          </div>

          {/* Calendar */}
          <div className="space-y-4">
            <div className="p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-slate-200/50">
              <Calendar
                mode="single"
                selected={localSelectedDate}
                onSelect={handleDateSelect}
                month={currentMonth}
                onMonthChange={setCurrentMonth}
                disabled={{ after: new Date() }}
                className="rounded-lg w-full"
                classNames={{
                  table: "w-full",
                  head_row: "grid grid-cols-7 gap-1",
                  head_cell:
                    "text-center text-sm font-semibold text-slate-500 py-3",
                  row: "grid grid-cols-7 gap-1 mt-1",
                  cell: "relative p-0 text-center h-12 w-full",
                  day: "relative w-full h-full mx-auto rounded-xl text-base font-medium transition-all duration-300 hover:bg-blue-50 hover:text-blue-700 hover:scale-105 flex items-center justify-center",
                  day_selected:
                    "bg-linear-to-br from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30 hover:bg-linear-to-br hover:from-blue-600 hover:to-cyan-600 hover:text-white",
                  day_today:
                    "bg-linear-to-br from-blue-100 to-cyan-100 text-blue-700 border-2 border-blue-200",
                  day_outside: "opacity-40",
                  day_disabled: "opacity-30 cursor-not-allowed",
                  day_hidden: "invisible",
                }}
                // We use 'components' for JSX content.
                // We cast to 'any' to bypass the typescript error caused by strict typing in the definition.
                // 'DayContent' is the correct prop to override the inner content of the day button.
                components={
                  {
                    DayContent: CustomDayContent,
                  } as any
                }
              />
            </div>

            {/* Selected Date Info */}
            {localSelectedDate && (
              <div className="p-4 bg-linear-to-r from-slate-50/50 to-white rounded-xl border border-slate-200/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                      <Target className="w-4 h-4 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-slate-900">
                      Selected:{" "}
                      {format(localSelectedDate, "EEEE, MMMM do, yyyy")}
                    </h4>
                  </div>
                  <Badge className="bg-linear-to-r from-blue-100 to-cyan-100 text-blue-700 border-blue-200/50">
                    <TrendingUp className="w-3 h-3 mr-1" />$
                    {getDailyTotal(localSelectedDate).toFixed(2)} spent
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-linear-to-r from-blue-50/30 to-cyan-50/30 rounded-lg border border-blue-100/30">
                    <p className="text-sm text-slate-600">Expense Count</p>
                    <p className="text-xl font-bold text-slate-900">
                      {getExpensesForSelectedDate(localSelectedDate).length}
                    </p>
                  </div>
                  <div className="p-3 bg-linear-to-r from-green-50/30 to-emerald-50/30 rounded-lg border border-green-100/30">
                    <p className="text-sm text-slate-600">Daily Average</p>
                    <p className="text-xl font-bold text-slate-900">
                      $
                      {monthlyTotal > 0 && daysWithExpenses.size > 0
                        ? (monthlyTotal / daysWithExpenses.size).toFixed(2)
                        : "0.00"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </div>
    </div>
  );
}
