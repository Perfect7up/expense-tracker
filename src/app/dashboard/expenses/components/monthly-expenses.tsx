"use client";

import { useState, useMemo } from "react"; // Removed useEffect
import { useExpenses } from "@/app/core/hooks/use-expenses";
import { useExpenseCategories } from "@/app/core/hooks/use-categories";
import { EditExpenseModal } from "./edit-expense-modal";
import { useEditExpenseStore } from "../../store/use-edit-expense-store";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/core/components/ui/card";
import { Button } from "@/app/core/components/ui/button";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  Pencil,
} from "lucide-react";

interface ExpenseWithCategory {
  id: string;
  amount: number;
  note?: string | null;
  occurredAt: string | Date;
  currency: string;
  categoryId?: string | null;
  categoryName?: string | null;
  userId: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

interface MonthlyExpensesProps {
  selectedDate?: Date;
}

export function MonthlyExpenses({ selectedDate }: MonthlyExpensesProps) {
  const { expenses, isLoading, isError, error } = useExpenses();
  const { data: categories } = useExpenseCategories();
  const { onOpen } = useEditExpenseStore();

  // 1. Initialize State
  const [currentMonth, setCurrentMonth] = useState<Date>(
    selectedDate || new Date()
  );

  // 2. State to track the prop for changes
  const [lastSelectedDate, setLastSelectedDate] = useState<Date | undefined>(
    selectedDate
  );

  const ITEMS_PER_PAGE = 5;
  const [currentPage, setCurrentPage] = useState(1);

  // 3. FIX: Adjust state during render (replaces useEffect)
  // If the prop changes, we update state immediately.
  // React discards the current render and re-runs it with the new values.
  if (selectedDate !== lastSelectedDate) {
    setLastSelectedDate(selectedDate);
    if (selectedDate) {
      setCurrentMonth(selectedDate);
      setCurrentPage(1);
    }
  }

  // Map expenses to include categoryName
  const mappedExpenses: ExpenseWithCategory[] = useMemo(() => {
    return (expenses || []).map((expense) => ({
      ...expense,
      categoryName: categories?.find((c) => c.id === expense.categoryId)?.name,
    }));
  }, [expenses, categories]);

  // Filter expenses for the selected month
  const filteredExpenses = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    return mappedExpenses.filter((expense) => {
      const expenseDate = new Date(expense.occurredAt);
      return (
        expenseDate.getFullYear() === year && expenseDate.getMonth() === month
      );
    });
  }, [mappedExpenses, currentMonth]);

  // Calculate total for the month
  const monthlyTotal = useMemo(
    () => filteredExpenses.reduce((total, e) => total + e.amount, 0),
    [filteredExpenses]
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredExpenses.length / ITEMS_PER_PAGE);
  const paginatedExpenses = filteredExpenses
    .sort(
      (a, b) =>
        new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime()
    )
    .slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  // Navigation helpers for month
  const now = new Date();
  const isCurrentMonth =
    currentMonth.getFullYear() === now.getFullYear() &&
    currentMonth.getMonth() === now.getMonth();

  const goToPreviousMonth = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  const goToNextMonth = () => {
    const nextMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      1
    );
    if (nextMonth > now) return;
    setCurrentMonth(nextMonth);
    setCurrentPage(1);
  };
  const goToCurrentMonth = () => setCurrentMonth(new Date());

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">Loading expenses...</div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8 text-red-500">
            Failed to load expenses: {error?.message}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <EditExpenseModal />

      <Card className="w-full">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Monthly Expenses
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const monthName = currentMonth.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                });
                const headers = [
                  "Date",
                  "Time",
                  "Amount",
                  "Currency",
                  "Note",
                  "Category",
                ];
                const csvData = filteredExpenses.map((expense) => {
                  const date = new Date(expense.occurredAt);
                  return [
                    date.toLocaleDateString(),
                    date.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    }),
                    expense.amount,
                    expense.currency,
                    expense.note || "",
                    expense.categoryName || "",
                  ];
                });
                const csvContent = [
                  headers.join(","),
                  ...csvData.map((row) => row.join(",")),
                ].join("\n");
                const blob = new Blob([csvContent], { type: "text/csv" });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `expenses-${monthName
                  .toLowerCase()
                  .replace(" ", "-")}.csv`;
                a.click();
                window.URL.revokeObjectURL(url);
              }}
              disabled={filteredExpenses.length === 0}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
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
                    Viewing past month&apos;s expenses
                  </p>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={goToNextMonth}
                disabled={currentMonth >= now}
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
          <div className="mb-6 p-4 bg-linear-to-r from-blue-50 to-indigo-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Total Expenses</p>
                <p className="text-2xl font-bold">${monthlyTotal.toFixed(2)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Number of Expenses</p>
                <p className="text-2xl font-bold">{filteredExpenses.length}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Average per Expense</p>
                <p className="text-2xl font-bold">
                  $
                  {filteredExpenses.length > 0
                    ? (monthlyTotal / filteredExpenses.length).toFixed(2)
                    : "0.00"}
                </p>
              </div>
            </div>
          </div>

          {/* Expense List with Pagination */}
          {paginatedExpenses.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <div className="text-gray-400 mb-2">
                No expenses found for this month
              </div>
              <p className="text-sm text-gray-500">
                {isCurrentMonth
                  ? "Add your first expense for this month!"
                  : "No expenses were recorded for this month"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {paginatedExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-lg">
                          ${expense.amount.toFixed(2)}
                          <span className="text-sm text-gray-500 ml-2">
                            {expense.currency}
                          </span>
                        </p>
                        <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                          {new Date(expense.occurredAt).toLocaleDateString(
                            "en-US",
                            { day: "numeric", weekday: "short" }
                          )}
                        </span>
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        {new Date(expense.occurredAt).toLocaleDateString(
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
                      {expense.note && (
                        <p className="text-sm text-gray-700 mt-2">
                          {expense.note}
                        </p>
                      )}
                      {expense.categoryName && (
                        <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full mt-2">
                          {expense.categoryName}
                        </span>
                      )}
                    </div>

                    {/* 5. Trigger Edit via Store */}
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onOpen(expense)}
                      >
                        <Pencil className="h-4 w-4 text-gray-500 hover:text-gray-900" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Pagination Controls */}
              <div className="flex justify-between mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <p className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
