"use client";

import { useState, useEffect } from "react";
import { useExpenses } from "@/app/core/hooks/use-expenses";
import { EditExpenseModal } from "./edit-expense-modal";
import { useEditExpenseStore } from "../../store/use-edit-expense-store";

import { Button } from "@/app/core/components/ui/button";
import { Input } from "@/app/core/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/core/components/ui/select";

import {
  ChevronLeft,
  ChevronRight,
  Download,
  Tag,
  Pencil,
  Search,
  DollarSign,
  TrendingUp,
  FileText,
  Calendar,
  Sparkles,
  BarChart3,
  X,
  SortAsc,
  SortDesc,
} from "lucide-react";
import { Badge } from "@/app/core/components/ui/badge";

const EXPENSES_PER_PAGE = 7;

export function ExpenseList() {
  const { expenses, isLoading, isError, error } = useExpenses();
  const { onOpen } = useEditExpenseStore();

  const [currentPage, setCurrentPage] = useState(1);
  const [monthFilter, setMonthFilter] = useState<string>("");
  const [yearFilter, setYearFilter] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "amount" | "category">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Reset to page 1 when filters change - fixed useEffect
  useEffect(() => {
    // Use requestAnimationFrame to avoid cascading renders
    const timer = setTimeout(() => {
      setCurrentPage(1);
    }, 0);

    return () => clearTimeout(timer);
  }, [monthFilter, yearFilter, searchTerm, sortBy, sortOrder]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <div className="w-16 h-16 rounded-full bg-linear-to-br from-blue-100 to-cyan-100 flex items-center justify-center animate-pulse">
          <DollarSign className="w-8 h-8 text-blue-500" />
        </div>
        <p className="text-lg text-slate-700 font-medium">
          Loading expenses...
        </p>
        <p className="text-sm text-slate-500">Fetching your financial data</p>
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

  const safeExpenses = expenses || [];

  // Apply filters and sorting - using const
  const filteredExpenses = safeExpenses.filter((expense) => {
    const expenseDate = new Date(expense.occurredAt);

    // Month filter
    if (monthFilter && expenseDate.getMonth() + 1 !== parseInt(monthFilter)) {
      return false;
    }

    // Year filter
    if (yearFilter && expenseDate.getFullYear() !== parseInt(yearFilter)) {
      return false;
    }

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const note = expense.note?.toLowerCase() || "";
      const category = expense.categoryName?.toLowerCase() || "";
      const amount = expense.amount.toString();

      return (
        note.includes(searchLower) ||
        category.includes(searchLower) ||
        amount.includes(searchTerm)
      );
    }

    return true;
  });

  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    let aValue, bValue;

    switch (sortBy) {
      case "date":
        aValue = new Date(a.occurredAt).getTime();
        bValue = new Date(b.occurredAt).getTime();
        break;
      case "amount":
        aValue = a.amount;
        bValue = b.amount;
        break;
      case "category":
        aValue = a.categoryName?.toLowerCase() || "zzzzzzzzzz"; // Push uncategorized to bottom
        bValue = b.categoryName?.toLowerCase() || "zzzzzzzzzz";
        break;
      default:
        return 0;
    }

    if (sortOrder === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Pagination logic
  const totalPages = Math.max(
    1,
    Math.ceil(sortedExpenses.length / EXPENSES_PER_PAGE)
  );
  const startIndex = (currentPage - 1) * EXPENSES_PER_PAGE;
  const endIndex = Math.min(
    startIndex + EXPENSES_PER_PAGE,
    sortedExpenses.length
  );
  const currentExpenses = sortedExpenses.slice(startIndex, endIndex);

  const totalAmount = sortedExpenses.reduce(
    (sum, e) => sum + (e.amount || 0),
    0
  );
  const averageAmount =
    sortedExpenses.length > 0 ? totalAmount / sortedExpenses.length : 0;

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const exportToCSV = () => {
    if (sortedExpenses.length === 0) {
      alert("No expenses to export!");
      return;
    }

    const headers = ["Date", "Time", "Amount", "Currency", "Note", "Category"];
    const csvData = sortedExpenses.map((expense) => {
      const date = new Date(expense.occurredAt);
      return [
        date.toLocaleDateString(),
        date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
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
      `expenses-${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const clearAllFilters = () => {
    setMonthFilter("");
    setYearFilter("");
    setSearchTerm("");
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Modal Component */}
      <EditExpenseModal />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">All Expenses</h2>
          <p className="text-slate-600 mt-1">
            Track and manage your spending history
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge className="bg-linear-to-r from-blue-100 to-cyan-100 text-blue-700 border border-blue-200/50">
            <DollarSign className="w-3 h-3 mr-1" />
            {sortedExpenses.length}{" "}
            {sortedExpenses.length === 1 ? "transaction" : "transactions"}
          </Badge>

          <Button
            onClick={exportToCSV}
            disabled={sortedExpenses.length === 0}
            className="rounded-full bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-2xl shadow-lg p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search expenses by note, amount, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 rounded-xl border-slate-200/50 bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Sort Controls */}
          <div className="flex gap-2">
            <Select
              value={sortBy}
              onValueChange={(value: "date" | "amount" | "category") =>
                setSortBy(value)
              }
            >
              <SelectTrigger className="h-12 rounded-xl border-slate-200/50 mt-2 bg-white/50 backdrop-blur-sm w-[140px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-200/50 bg-white/90 backdrop-blur-md">
                <SelectItem value="date" className="cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Date
                  </div>
                </SelectItem>
                <SelectItem value="amount" className="cursor-pointer">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Amount
                  </div>
                </SelectItem>
                <SelectItem value="category" className="cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Category
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="h-12 rounded-xl border-slate-200/50 bg-white/50 backdrop-blur-sm min-w-[100px]"
            >
              {sortOrder === "asc" ? (
                <>
                  <SortAsc className="h-4 w-4 mr-2" />
                  Asc
                </>
              ) : (
                <>
                  <SortDesc className="h-4 w-4 mr-2" />
                  Desc
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-linear-to-r from-blue-50 to-cyan-50 border border-blue-200/50 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 flex items-center gap-2">
                <DollarSign className="w-4 h-4" /> Total Amount
              </p>
              <p className="text-2xl font-bold text-slate-900 mt-2">
                ${totalAmount.toFixed(2)}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-linear-to-r from-purple-50 to-pink-50 border border-purple-200/50 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 flex items-center gap-2">
                <FileText className="w-4" /> Total Expenses
              </p>
              <p className="text-2xl font-bold text-slate-900 mt-2">
                {sortedExpenses.length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-linear-to-r from-green-50 to-emerald-50 border border-green-200/50 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Average Amount
              </p>
              <p className="text-2xl font-bold text-slate-900 mt-2">
                ${averageAmount.toFixed(2)}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-linear-to-br from-green-500 to-emerald-500 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {(monthFilter || yearFilter || searchTerm) && (
        <div className="bg-linear-to-r from-blue-50/50 to-cyan-50/50 border border-blue-200/50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-700">
                Active filters:
              </span>
              <div className="flex flex-wrap gap-2">
                {monthFilter && (
                  <Badge className="bg-linear-to-r from-blue-100 to-cyan-100 text-blue-700 border border-blue-200/50">
                    Month:{" "}
                    {new Date(
                      2000,
                      parseInt(monthFilter) - 1,
                      1
                    ).toLocaleDateString("en-US", { month: "long" })}
                  </Badge>
                )}
                {yearFilter && (
                  <Badge className="bg-linear-to-r from-purple-100 to-pink-100 text-purple-700 border border-purple-200/50">
                    Year: {yearFilter}
                  </Badge>
                )}
                {searchTerm && (
                  <Badge className="bg-linear-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200/50">
                    Search: &ldquo;{searchTerm}&rdquo;
                  </Badge>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-slate-600 hover:text-slate-900"
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          </div>
        </div>
      )}

      {/* Expense List */}
      {currentExpenses.length === 0 ? (
        <div className="bg-linear-to-r from-slate-50 to-white border border-slate-200/50 rounded-2xl p-12 text-center">
          <div className="w-20 h-20 rounded-full bg-linear-to-br from-slate-100 to-slate-200 flex items-center justify-center mx-auto mb-6">
            <FileText className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-700 mb-2">
            No expenses found
          </h3>
          <p className="text-slate-500 max-w-md mx-auto mb-6">
            {searchTerm || monthFilter || yearFilter
              ? "Try adjusting your filters or search term"
              : "Start tracking your expenses by adding your first transaction"}
          </p>
          <Button className="rounded-full bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white">
            Add Your First Expense
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {currentExpenses.map((expense) => (
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

                        <span className="text-xs px-2 py-1 bg-linear-to-r from-slate-100 to-slate-50 text-slate-700 rounded-full border border-slate-200/50">
                          <Calendar className="w-3 h-3 inline mr-1" />
                          {new Date(expense.occurredAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </span>

                        {expense.categoryName && (
                          <span className="text-xs px-2 py-1 bg-linear-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full border border-purple-200/50">
                            <Tag className="h-3 w-3 inline mr-1" />
                            {expense.categoryName}
                          </span>
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
      )}

      {/* Pagination */}
      {sortedExpenses.length > EXPENSES_PER_PAGE && (
        <div className="bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-slate-600">
              <span className="font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <span className="text-slate-500 ml-2">
                ({startIndex + 1}-{endIndex} of {sortedExpenses.length}{" "}
                expenses)
              </span>
            </div>

            <div className="flex items-center gap-2">
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

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
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
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => goToPage(pageNum)}
                      className={`min-w-9 h-9 rounded-lg ${
                        currentPage === pageNum
                          ? "bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0"
                          : "border-slate-300/50 hover:bg-slate-100/50 hover:border-slate-400/50"
                      }`}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
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
          </div>
        </div>
      )}
    </div>
  );
}
