"use client";

import { useState } from "react";
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
  TrendingUp,
  TrendingDown,
  AlertCircle,
} from "lucide-react";
import {
  useIncomeAggregate,
  useIncomePeriodTotals,
} from "@/app/core/hooks/use-income-aggregate";
import { useIncomes } from "@/app/core/hooks/use-income";

interface CalendarViewProps {
  onDateSelect?: (date: Date | undefined) => void;
}

export function CalendarView({ onDateSelect }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [view, setView] = useState<"month" | "year">("month");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const now = new Date();
  const currentYearNow = now.getFullYear();
  const currentMonthNow = now.getMonth() + 1;

  // Get all incomes to calculate stats
  const { incomesQuery } = useIncomes();
  const incomes = incomesQuery.data || [];
  const isLoadingIncomes = incomesQuery.isLoading;

  // Fetch aggregated data
  const { data: aggregatedData, isLoading: isLoadingAggregated } =
    useIncomeAggregate({
      period: view === "month" ? "monthly" : "yearly",
      enabled: true,
    });

  // Fetch current period totals
  const { data: currentTotals, isLoading: isLoadingTotals } =
    useIncomePeriodTotals(view);

  // Check if we can navigate to next period
  const canGoNext = () => {
    if (view === "month") {
      const nextDate = new Date(currentDate);
      nextDate.setMonth(nextDate.getMonth() + 1);
      return (
        nextDate.getFullYear() <= currentYearNow ||
        (nextDate.getFullYear() === currentYearNow &&
          nextDate.getMonth() + 1 <= currentMonthNow)
      );
    } else {
      return currentDate.getFullYear() < currentYearNow;
    }
  };

  // Navigate to previous period
  const goToPrevious = () => {
    if (view === "month") {
      setCurrentDate(
        new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
      );
    } else {
      setCurrentDate(
        new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), 1)
      );
    }
  };

  // Navigate to next period
  const goToNext = () => {
    if (!canGoNext()) return;

    if (view === "month") {
      setCurrentDate(
        new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
      );
    } else {
      setCurrentDate(
        new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), 1)
      );
    }
  };

  // Navigate to today
  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  // Helper function to find period data
  const findPeriodData = () => {
    if (!aggregatedData || aggregatedData.length === 0) return null;

    if (view === "month") {
      return aggregatedData.find((item: any) => {
        const itemYear =
          item.year ||
          (item.period ? parseInt(item.period.split("-")[0]) : null);
        const itemMonth =
          item.month ||
          (item.period ? parseInt(item.period.split("-")[1]) : null);
        return itemYear === currentYear && itemMonth === currentMonth;
      });
    } else {
      return aggregatedData.find((item: any) => {
        const itemYear =
          item.year || (item.period ? parseInt(item.period) : null);
        return itemYear === currentYear;
      });
    }
  };

  // Calculate stats from raw incomes if aggregated data is not available
  const calculateStatsFromIncomes = () => {
    if (!incomes || incomes.length === 0)
      return { totalAmount: 0, incomeCount: 0 };

    const filteredIncomes = incomes.filter((income: any) => {
      const incomeDate = new Date(income.receivedAt);
      if (view === "month") {
        return (
          incomeDate.getFullYear() === currentYear &&
          incomeDate.getMonth() + 1 === currentMonth
        );
      } else {
        return incomeDate.getFullYear() === currentYear;
      }
    });

    const totalAmount = filteredIncomes.reduce(
      (sum: number, income: any) => sum + income.amount,
      0
    );

    return {
      totalAmount,
      incomeCount: filteredIncomes.length,
    };
  };

  // Get current period data
  const getCurrentPeriodData = () => {
    const periodData = findPeriodData();

    if (periodData) {
      return {
        totalAmount: periodData.totalAmount || 0,
        incomeCount: periodData.incomeCount || 0,
      };
    }

    // If no aggregated data found, calculate from incomes
    return calculateStatsFromIncomes();
  };

  // Get date for calendar - disable future dates
  const getDisabledDates = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return {
      after: today,
    };
  };

  const periodData = getCurrentPeriodData();
  const isLoading = isLoadingAggregated || isLoadingIncomes || isLoadingTotals;
  const isCurrentPeriodFuture =
    view === "month"
      ? currentYear > currentYearNow ||
        (currentYear === currentYearNow && currentMonth > currentMonthNow)
      : currentYear > currentYearNow;

  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (onDateSelect) {
      onDateSelect(date);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Income Calendar
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant={view === "month" ? "default" : "outline"}
              size="sm"
              onClick={() => setView("month")}
            >
              Month
            </Button>
            <Button
              variant={view === "year" ? "default" : "outline"}
              size="sm"
              onClick={() => setView("year")}
            >
              Year
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Period Navigation */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={goToPrevious}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h3 className="text-lg font-semibold">
              {view === "month"
                ? currentDate.toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })
                : currentYear}
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={goToNext}
              disabled={!canGoNext()}
              title={!canGoNext() ? "Cannot navigate to future months" : ""}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="outline" size="sm" onClick={goToToday}>
            Today
          </Button>
        </div>

        {isCurrentPeriodFuture && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm text-yellow-800 font-medium">
                  Future {view}
                </p>
                <p className="text-xs text-yellow-700">
                  You&apos;re viewing a future {view}. No incomes can be added
                  to future dates.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Current Period */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-gray-500">
                Current {view === "month" ? "Month" : "Year"}
              </div>
              <div className="text-2xl font-bold mt-2">
                {isLoading ? "..." : `$${periodData.totalAmount.toFixed(2)}`}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {periodData.incomeCount} income
                {periodData.incomeCount !== 1 ? "s" : ""}
              </div>
            </CardContent>
          </Card>

          {/* Previous Period */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-gray-500">
                Previous {view === "month" ? "Month" : "Year"}
              </div>
              <div className="text-2xl font-bold mt-2">
                {isLoadingTotals
                  ? "..."
                  : `$${(currentTotals?.previousPeriodTotal || 0).toFixed(2)}`}
              </div>
              <div className="flex items-center gap-1 text-sm mt-1">
                {currentTotals?.percentageChange !== undefined &&
                !isLoadingTotals ? (
                  <>
                    {currentTotals.percentageChange > 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                    <span
                      className={
                        currentTotals.percentageChange > 0
                          ? "text-green-500"
                          : "text-red-500"
                      }
                    >
                      {Math.abs(currentTotals.percentageChange).toFixed(1)}%
                    </span>
                    <span className="text-gray-500">
                      {currentTotals.percentageChange > 0
                        ? "increase"
                        : "decrease"}
                    </span>
                  </>
                ) : (
                  <span className="text-gray-500">No comparison data</span>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Average per Income */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-gray-500">
                Average per {view === "month" ? "Month" : "Year"}
              </div>
              <div className="text-2xl font-bold mt-2">
                {isLoading
                  ? "..."
                  : `$${
                      periodData.incomeCount > 0
                        ? (
                            periodData.totalAmount / periodData.incomeCount
                          ).toFixed(2)
                        : "0.00"
                    }`}
              </div>
              <div className="text-sm text-gray-500 mt-1">per income</div>
            </CardContent>
          </Card>
        </div>

        {/* Calendar */}
        <div className="mb-6">
          <h4 className="text-sm font-medium mb-3">Select Date</h4>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            className="rounded-md border"
            month={currentDate}
            onMonthChange={setCurrentDate}
            disabled={getDisabledDates()}
            fromMonth={new Date(2000, 0)}
            toMonth={now}
            captionLayout="dropdown"
            showOutsideDays={false}
          />
        </div>

        {/* Selected Date Summary */}
        {selectedDate && (
          <Card>
            <CardContent className="pt-6">
              <h4 className="font-medium mb-2">
                {selectedDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </h4>
              {selectedDate > now ? (
                <p className="text-sm text-gray-500">
                  Future date - incomes cannot be added
                </p>
              ) : (
                <div>
                  <p className="text-sm text-gray-500 mb-2">
                    Incomes for this date:
                  </p>
                  {incomesQuery.isLoading ? (
                    <p className="text-sm text-gray-500">Loading...</p>
                  ) : (
                    (() => {
                      const dailyIncomes = incomes.filter((income: any) => {
                        const incomeDate = new Date(income.receivedAt);
                        return (
                          incomeDate.getDate() === selectedDate.getDate() &&
                          incomeDate.getMonth() === selectedDate.getMonth() &&
                          incomeDate.getFullYear() ===
                            selectedDate.getFullYear()
                        );
                      });

                      const dailyTotal = dailyIncomes.reduce(
                        (sum: number, income: any) => sum + income.amount,
                        0
                      );

                      return dailyIncomes.length > 0 ? (
                        <div>
                          <p className="font-medium">
                            ${dailyTotal.toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-600">
                            {dailyIncomes.length} income
                            {dailyIncomes.length !== 1 ? "s" : ""}
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">
                          No incomes recorded
                        </p>
                      );
                    })()
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
