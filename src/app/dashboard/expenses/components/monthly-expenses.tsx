"use client";

import { useState, useMemo } from "react";
import { useExpenses } from "@/app/core/hooks/use-expenses";
import { useExpenseCategories } from "@/app/core/hooks/use-categories";
import { EditExpenseModal } from "./edit-expense-modal";
import { useEditExpenseStore } from "../../store/use-edit-expense-store";

import {
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/core/components/ui/card";
import { Button } from "@/app/core/components/ui/button";
import { Badge } from "@/app/core/components/ui/badge";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  Pencil,
  DollarSign,
  FileText,
  TrendingUp,
  Sparkles,
  Target,
  BarChart3,
  ArrowRight,
  Clock,
  Tag,
  Zap,
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

  // Initialize state
  const [currentMonth, setCurrentMonth] = useState<Date>(
    selectedDate || new Date()
  );
  const [lastSelectedDate, setLastSelectedDate] = useState<Date | undefined>(
    selectedDate
  );
  const ITEMS_PER_PAGE = 5;
  const [currentPage, setCurrentPage] = useState(1);

  // Adjust state during render when prop changes
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

  // Calculate statistics
  const monthlyTotal = useMemo(
    () => filteredExpenses.reduce((total, e) => total + e.amount, 0),
    [filteredExpenses]
  );

  const averageExpense =
    filteredExpenses.length > 0 ? monthlyTotal / filteredExpenses.length : 0;

  const highestExpense =
    filteredExpenses.length > 0
      ? Math.max(...filteredExpenses.map((e) => e.amount))
      : 0;

  // Sort expenses by date (newest first)
  const sortedExpenses = useMemo(() => {
    return [...filteredExpenses].sort(
      (a, b) =>
        new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime()
    );
  }, [filteredExpenses]);

  // Pagination logic
  const totalPages = Math.max(
    1,
    Math.ceil(sortedExpenses.length / ITEMS_PER_PAGE)
  );
  const paginatedExpenses = sortedExpenses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

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

  const goToPreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
    setCurrentPage(1);
  };

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

  const goToCurrentMonth = () => {
    setCurrentMonth(new Date());
    setCurrentPage(1);
  };

  // Export to CSV
  const exportToCSV = () => {
    if (filteredExpenses.length === 0) {
      alert("No expenses to export for this month!");
      return;
    }

    const monthName = currentMonth.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
    const headers = ["Date", "Time", "Amount", "Currency", "Note", "Category"];
    const csvData = filteredExpenses.map((expense) => {
      const date = new Date(expense.occurredAt);
      return [
        date.toLocaleDateString(),
        date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        expense.amount?.toFixed(2) || "0.00",
        expense.currency || "USD",
        `"${(expense.note || "").replace(/"/g, '""')}"`,
        expense.categoryName || "Uncategorized",
      ];
    });

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `expenses-${monthName.toLowerCase().replace(" ", "-")}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <div className="w-16 h-16 rounded-full bg-linear-to-br from-blue-100 to-cyan-100 flex items-center justify-center animate-pulse">
          <Calendar className="w-8 h-8 text-blue-500" />
        </div>
        <p className="text-lg text-slate-700 font-medium">
          Loading monthly expenses...
        </p>
        <p className="text-sm text-slate-500">
          Fetching your monthly financial data
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 rounded-full bg-linear-to-br from-red-100 to-pink-100 flex items-center justify-center mx-auto mb-4">
          <BarChart3 className="w-10 h-10 text-red-500" />
        </div>
        <p className="text-lg font-semibold text-red-600">
          Failed to load expenses
        </p>
        <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
          {error?.message ||
            "There was an error loading your expenses. Please try again."}
        </p>
        <Button
          className="mt-4 rounded-full bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <>
      <EditExpenseModal />

      <div className="relative">
        {/* Background effects */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-blue-100/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-cyan-100/10 rounded-full blur-3xl" />
        </div>

        <div className="bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="relative bg-linear-to-r from-blue-500 to-cyan-500 p-6">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 blur-2xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12 blur-2xl" />

            <CardHeader className="relative z-10 p-0">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-white">
                      Monthly Expenses
                    </CardTitle>
                    <p className="text-sm text-blue-100/80">
                      Track your monthly spending patterns
                    </p>
                  </div>
                </div>

                <Button
                  onClick={exportToCSV}
                  disabled={filteredExpenses.length === 0}
                  className="rounded-xl bg-white/20 backdrop-blur-sm hover:bg-white/30 border border-white/30 text-white gap-2 px-4 h-12 transition-all duration-300 group"
                >
                  <Download className="h-4 w-4" />
                  Export Month
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
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
                    {currentMonth.toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </h3>
                  {!isCurrentMonth ? (
                    <Badge className="mt-1 bg-linear-to-r from-amber-100 to-orange-100 text-amber-700 border-amber-200/50">
                      <Clock className="w-3 h-3 mr-1" />
                      Viewing past month
                    </Badge>
                  ) : (
                    <Badge className="mt-1 bg-linear-to-r from-green-100 to-emerald-100 text-green-700 border-green-200/50">
                      <Zap className="w-3 h-3 mr-1" />
                      Current month
                    </Badge>
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToNextMonth}
                  disabled={
                    !isCurrentMonth &&
                    currentMonth.getMonth() >= now.getMonth() &&
                    currentMonth.getFullYear() >= now.getFullYear()
                  }
                  className="rounded-lg w-10 h-10 border-blue-200/50 hover:bg-blue-50 hover:border-blue-300 disabled:opacity-50"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <Button
                variant="outline"
                onClick={goToCurrentMonth}
                disabled={isCurrentMonth}
                className="rounded-xl border-blue-200/50 hover:bg-blue-50 hover:border-blue-300 px-4 h-10"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Current Month
              </Button>
            </div>

            {/* Monthly Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-linear-to-r from-blue-50/50 to-cyan-50/50 border border-blue-200/50 rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 flex items-center gap-2">
                      <DollarSign className="w-4 h-4" /> Total Amount
                    </p>
                    <p className="text-2xl font-bold text-slate-900 mt-2">
                      ${monthlyTotal.toFixed(2)}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-linear-to-r from-purple-50/50 to-pink-50/50 border border-purple-200/50 rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 flex items-center gap-2">
                      <FileText className="w-4 h-4" /> Total Expenses
                    </p>
                    <p className="text-2xl font-bold text-slate-900 mt-2">
                      {filteredExpenses.length}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-linear-to-r from-green-50/50 to-emerald-50/50 border border-green-200/50 rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" /> Average
                    </p>
                    <p className="text-2xl font-bold text-slate-900 mt-2">
                      ${averageExpense.toFixed(2)}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-linear-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-linear-to-r from-amber-50/50 to-orange-50/50 border border-amber-200/50 rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 flex items-center gap-2">
                      <Target className="w-4 h-4" /> Highest
                    </p>
                    <p className="text-2xl font-bold text-slate-900 mt-2">
                      ${highestExpense.toFixed(2)}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-linear-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Expense List */}
            {paginatedExpenses.length === 0 ? (
              <div className="bg-linear-to-r from-slate-50/50 to-white border border-slate-200/50 rounded-2xl p-12 text-center">
                <div className="w-20 h-20 rounded-full bg-linear-to-br from-slate-100 to-slate-200 flex items-center justify-center mx-auto mb-6">
                  <Calendar className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-700 mb-2">
                  No expenses found for this month
                </h3>
                <p className="text-slate-500 max-w-md mx-auto mb-6">
                  {isCurrentMonth
                    ? "Start tracking your expenses by adding your first transaction this month!"
                    : "No expenses were recorded for this month"}
                </p>
                <Button className="rounded-full bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white">
                  Add Your First Expense
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Monthly Expenses ({filteredExpenses.length} total)
                  </h4>
                  <Badge className="bg-linear-to-r from-blue-100 to-cyan-100 text-blue-700 border-blue-200/50">
                    Page {currentPage} of {totalPages}
                  </Badge>
                </div>

                <div className="space-y-3">
                  {paginatedExpenses.map((expense) => (
                    <div
                      key={expense.id}
                      className="bg-white border border-slate-200/50 rounded-xl p-4 hover:shadow-lg hover:border-blue-200/50 transition-all duration-300 group"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-start gap-4">
                            {/* Amount Circle */}
                            <div className="shrink-0">
                              <div className="w-14 h-14 rounded-xl bg-linear-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                                <span className="font-bold text-lg text-blue-700">
                                  ${expense.amount?.toFixed(2).split(".")[0]}
                                </span>
                              </div>
                            </div>

                            {/* Details */}
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <p className="font-semibold text-slate-900 truncate">
                                  ${expense.amount?.toFixed(2)}
                                  <span className="text-sm font-normal text-slate-500 ml-2">
                                    {expense.currency}
                                  </span>
                                </p>

                                <Badge className="bg-linear-to-r from-slate-100 to-slate-50 text-slate-700 border-slate-200/50">
                                  <Calendar className="w-3 h-3 mr-1" />
                                  {new Date(
                                    expense.occurredAt
                                  ).toLocaleDateString("en-US", {
                                    day: "numeric",
                                    weekday: "short",
                                  })}
                                </Badge>

                                <span className="text-xs text-slate-500">
                                  {new Date(
                                    expense.occurredAt
                                  ).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>

                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm text-slate-600">
                                  {new Date(
                                    expense.occurredAt
                                  ).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </span>

                                {expense.categoryName && (
                                  <Badge className="bg-linear-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-200/50">
                                    <Tag className="h-3 w-3 mr-1" />
                                    {expense.categoryName}
                                  </Badge>
                                )}
                              </div>

                              {expense.note && (
                                <p className="text-sm text-slate-700 p-3 bg-linear-to-r from-slate-50/50 to-white rounded-lg border border-slate-200/30">
                                  {expense.note}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Edit Button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onOpen(expense)}
                          className="ml-2 w-8 h-8 rounded-lg border border-transparent hover:border-blue-200/50 hover:bg-blue-50/50 transition-all duration-300 opacity-0 group-hover:opacity-100"
                        >
                          <Pencil className="h-4 w-4 text-slate-400 hover:text-blue-600" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-between items-center pt-4 border-t border-slate-200/50">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToPreviousPage}
                      disabled={currentPage === 1}
                      className="rounded-lg border-slate-300/50 hover:bg-slate-100/50 hover:border-slate-400/50 gap-1"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>

                    <div className="flex items-center gap-2">
                      {Array.from(
                        { length: Math.min(5, totalPages) },
                        (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }

                          return (
                            <Button
                              key={pageNum}
                              variant={
                                currentPage === pageNum ? "default" : "outline"
                              }
                              size="sm"
                              onClick={() => setCurrentPage(pageNum)}
                              className={`min-w-9 h-9 rounded-lg ${
                                currentPage === pageNum
                                  ? "bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0"
                                  : "border-slate-300/50 hover:bg-slate-100/50 hover:border-slate-400/50"
                              }`}
                            >
                              {pageNum}
                            </Button>
                          );
                        }
                      )}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages}
                      className="rounded-lg border-slate-300/50 hover:bg-slate-100/50 hover:border-slate-400/50 gap-1"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </div>
      </div>
    </>
  );
}
