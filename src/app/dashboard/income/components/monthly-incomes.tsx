"use client";

import { useState, useMemo } from "react";
import { useIncomes } from "@/app/core/hooks/use-income";
import { EditIncomeModal } from "./edit-income-modal";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/core/components/ui/card";
import { Button } from "@/app/core/components/ui/button";
import { ChevronLeft, ChevronRight, Download, DollarSign } from "lucide-react";

interface MonthlyIncomesProps {
  selectedDate?: Date;
  categories: { id: string; name: string }[];
}

export function MonthlyIncomes({
  selectedDate,
  categories,
}: MonthlyIncomesProps) {
  const { incomesQuery } = useIncomes();

  // 1. FIX: Memoize 'incomes' to ensure stable reference across renders.
  // This prevents the downstream useMemo (filteredIncomes) from re-calculating unnecessarily.
  const incomes = useMemo(() => incomesQuery.data || [], [incomesQuery.data]);
  const isLoading = incomesQuery.isLoading;

  // 2. State Initialization
  const [currentMonth, setCurrentMonth] = useState<Date>(
    selectedDate || new Date()
  );

  // 3. Track previous prop value for Render-Phase State Update
  const [lastSelectedDate, setLastSelectedDate] = useState<Date | undefined>(
    selectedDate
  );

  // 4. Sync state during render phase (replaces useEffect)
  if (selectedDate !== lastSelectedDate) {
    setLastSelectedDate(selectedDate);
    if (selectedDate) {
      setCurrentMonth(selectedDate);
    }
  }

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  // Navigate to next month
  const goToNextMonth = () => {
    const nextMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      1
    );
    const now = new Date();

    // Don't allow navigation to future months
    if (
      nextMonth.getFullYear() > now.getFullYear() ||
      (nextMonth.getFullYear() === now.getFullYear() &&
        nextMonth.getMonth() > now.getMonth())
    ) {
      return;
    }

    setCurrentMonth(nextMonth);
  };

  // Navigate to current month
  const goToCurrentMonth = () => {
    setCurrentMonth(new Date());
  };

  // Filter incomes for the selected month using useMemo for performance
  const filteredIncomes = useMemo(() => {
    if (!incomes || incomes.length === 0) return [];

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    return incomes.filter((income: any) => {
      const incomeDate = new Date(income.receivedAt);
      return (
        incomeDate.getFullYear() === year && incomeDate.getMonth() === month
      );
    });
  }, [incomes, currentMonth]);

  // Calculate total for the month
  const monthlyTotal = useMemo(() => {
    return filteredIncomes.reduce(
      (total: number, income: any) => total + income.amount,
      0
    );
  }, [filteredIncomes]);

  // Export monthly incomes to CSV
  const exportMonthlyCSV = () => {
    const monthName = currentMonth.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });

    // Helper to map ID → Name
    const getCategoryName = (categoryId: string | null | undefined) => {
      if (!categoryId) return "";
      const category = categories.find((c) => c.id === categoryId);
      return category?.name || "";
    };

    const headers = [
      "Date",
      "Time",
      "Amount",
      "Currency",
      "Source",
      "Note",
      "Category",
    ];

    const csvData = filteredIncomes.map((income: any) => {
      const date = new Date(income.receivedAt);

      return [
        date.toLocaleDateString(),
        date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        income.amount,
        income.currency,
        income.source || "",
        income.note || "",
        getCategoryName(income.categoryId),
      ];
    });

    const csvContent = [
      headers.join(","),
      ...csvData.map((row: any) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `incomes-${monthName.toLowerCase().replace(" ", "-")}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const now = new Date();
  const isCurrentMonth =
    currentMonth.getFullYear() === now.getFullYear() &&
    currentMonth.getMonth() === now.getMonth();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">Loading incomes...</div>
        </CardContent>
      </Card>
    );
  }

  if (incomesQuery.isError) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8 text-red-500">
            Failed to load incomes
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Monthly Incomes
          </CardTitle>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={exportMonthlyCSV}
              disabled={filteredIncomes.length === 0}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Month Navigation */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="text-center">
              <h3 className="text-xl font-semibold">
                {currentMonth.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </h3>
              {!isCurrentMonth && (
                <p className="text-sm text-gray-500">
                  Viewing past month&apos;s incomes
                </p>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={goToNextMonth}
              disabled={
                currentMonth.getFullYear() > now.getFullYear() ||
                (currentMonth.getFullYear() === now.getFullYear() &&
                  currentMonth.getMonth() >= now.getMonth())
              }
              title={
                currentMonth.getMonth() >= now.getMonth() &&
                currentMonth.getFullYear() >= now.getFullYear()
                  ? "Cannot navigate to future months"
                  : ""
              }
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={goToCurrentMonth}
            disabled={isCurrentMonth}
          >
            Current Month
          </Button>
        </div>

        {/* Monthly Summary */}
        <div className="mb-6 p-4 bg-linear-to-r from-green-50 to-emerald-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Income</p>
              <p className="text-2xl font-bold">${monthlyTotal.toFixed(2)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Number of Incomes</p>
              <p className="text-2xl font-bold">{filteredIncomes.length}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Average per Income</p>
              <p className="text-2xl font-bold">
                $
                {filteredIncomes.length > 0
                  ? (monthlyTotal / filteredIncomes.length).toFixed(2)
                  : "0.00"}
              </p>
            </div>
          </div>
        </div>

        {/* Income List */}
        {filteredIncomes.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <div className="text-gray-400 mb-2">
              No incomes found for this month
            </div>
            <p className="text-sm text-gray-500">
              {isCurrentMonth
                ? "Add your first income for this month!"
                : "No incomes were recorded for this month"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700">
              Incomes in this month:
            </h4>
            {filteredIncomes
              .sort(
                (a: any, b: any) =>
                  new Date(b.receivedAt).getTime() -
                  new Date(a.receivedAt).getTime()
              )
              .map((income: any) => (
                <div
                  key={income.id}
                  className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-lg">
                          ${income.amount.toFixed(2)}
                          <span className="text-sm text-gray-500 ml-2">
                            {income.currency}
                          </span>
                        </p>
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                          {income.source || "Income"}
                        </span>
                        <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                          {new Date(income.receivedAt).toLocaleDateString(
                            "en-US",
                            {
                              day: "numeric",
                              weekday: "short",
                            }
                          )}
                        </span>
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        {new Date(income.receivedAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </div>
                      {income.note && (
                        <p className="text-sm text-gray-700 mt-2">
                          {income.note}
                        </p>
                      )}
                      {income.categoryId && (
                        <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full mt-2">
                          Category:{" "}
                          {categories.find((c) => c.id === income.categoryId)
                            ?.name || income.categoryId}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <EditIncomeModal income={income} />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Month Comparison */}
        {filteredIncomes.length > 0 && (
          <div className="mt-8 pt-6 border-t">
            <h4 className="text-sm font-medium mb-4">Month Insights</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Highest Income</p>
                <p className="font-semibold">
                  $
                  {Math.max(
                    ...filteredIncomes.map((e: any) => e.amount)
                  ).toFixed(2)}
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Lowest Income</p>
                <p className="font-semibold">
                  $
                  {Math.min(
                    ...filteredIncomes.map((e: any) => e.amount)
                  ).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
