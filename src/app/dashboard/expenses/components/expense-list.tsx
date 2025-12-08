"use client";

import { useState } from "react";
import { useExpenses } from "@/app/core/hooks/use-expenses";
import { EditExpenseModal } from "./edit-expense-modal"; // Keep this import
import { useEditExpenseStore } from "../../store/use-edit-expense-store"; // Import the store

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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/core/components/ui/dialog";
// Added 'Pencil' for the edit button icon
import {
  Filter,
  ChevronLeft,
  ChevronRight,
  Download,
  Tag,
  Pencil,
} from "lucide-react";

const EXPENSES_PER_PAGE = 10;

export function ExpenseList() {
  const { expenses, isLoading, isError, error } = useExpenses();
  // Get the onOpen function from your store
  const { onOpen } = useEditExpenseStore();

  const [currentPage, setCurrentPage] = useState(1);
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
  const [monthFilter, setMonthFilter] = useState<string>("");
  const [yearFilter, setYearFilter] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  if (isLoading)
    return <div className="text-center py-8">Loading expenses...</div>;
  if (isError)
    return (
      <div className="text-center py-8">
        <p className="text-red-500 font-medium">Failed to load expenses</p>
        <p className="text-sm text-gray-500 mt-1">
          {error?.message || "Please try again later"}
        </p>
      </div>
    );

  const safeExpenses = expenses || [];

  // Apply filters
  const filteredExpenses = safeExpenses.filter((expense) => {
    const expenseDate = new Date(expense.occurredAt);

    if (dateFilter) {
      const filterDate = new Date(dateFilter);
      if (
        expenseDate.getDate() !== filterDate.getDate() ||
        expenseDate.getMonth() !== filterDate.getMonth() ||
        expenseDate.getFullYear() !== filterDate.getFullYear()
      )
        return false;
    }

    if (monthFilter && expenseDate.getMonth() + 1 !== parseInt(monthFilter))
      return false;
    if (yearFilter && expenseDate.getFullYear() !== parseInt(yearFilter))
      return false;

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        expense.note?.toLowerCase().includes(searchLower) ||
        expense.amount.toString().includes(searchTerm) ||
        (expense.categoryName?.toLowerCase() || "").includes(searchLower)
      );
    }

    return true;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredExpenses.length / EXPENSES_PER_PAGE);
  const startIndex = (currentPage - 1) * EXPENSES_PER_PAGE;
  const endIndex = startIndex + EXPENSES_PER_PAGE;
  const currentExpenses = filteredExpenses.slice(startIndex, endIndex);
  const totalAmount = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Unique years for filter
  const uniqueYears = Array.from(
    new Set(safeExpenses.map((e) => new Date(e.occurredAt).getFullYear()))
  ).sort((a, b) => b - a);

  // Pagination handlers
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
    const headers = ["Date", "Time", "Amount", "Currency", "Note", "Category"];
    const csvData = filteredExpenses.map((expense) => {
      const date = new Date(expense.occurredAt);
      return [
        date.toLocaleDateString(),
        date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        expense.amount,
        expense.currency,
        expense.note || "",
        expense.categoryName || "Uncategorized",
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
    a.download = `expenses-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* 1. Modal Component Placed HERE (or at the bottom) */}
      {/* It sits invisible until triggered by the store */}
      <EditExpenseModal />

      {/* Filters & Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        {/* ... (Existing Filter UI Code kept exactly the same) ... */}
        <div className="flex-1 flex flex-col sm:flex-row gap-2">
          <Input
            placeholder="Search expenses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />

          <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              {/* ... (Existing Dialog Content) ... */}
              <DialogHeader>
                <DialogTitle>Filter Expenses</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Month
                    </label>
                    <Select value={monthFilter} onValueChange={setMonthFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All months" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All months</SelectItem>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(
                          (month) => (
                            <SelectItem key={month} value={month.toString()}>
                              {new Date(2000, month - 1, 1).toLocaleDateString(
                                "en-US",
                                {
                                  month: "long",
                                }
                              )}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Year
                    </label>
                    <Select value={yearFilter} onValueChange={setYearFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All years" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All years</SelectItem>
                        {uniqueYears.map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setDateFilter(undefined);
                      setMonthFilter("");
                      setYearFilter("");
                      setSearchTerm("");
                      setCurrentPage(1);
                      setIsFilterOpen(false);
                    }}
                  >
                    Clear All
                  </Button>
                  <Button onClick={() => setIsFilterOpen(false)}>
                    Apply Filters
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Button
          variant="outline"
          onClick={exportToCSV}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Summary */}
      <div className="p-4 bg-linear-to-r from-blue-50 to-indigo-50 rounded-lg">
        <div className="flex flex-wrap justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">Filtered Expenses</p>
            <p className="text-2xl font-bold">${totalAmount.toFixed(2)}</p>
            <p className="text-sm text-gray-600 mt-1">
              Showing {startIndex + 1}-
              {Math.min(endIndex, filteredExpenses.length)} of{" "}
              {filteredExpenses.length} expenses
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </p>
          </div>
        </div>
      </div>

      {/* Expense List */}
      {currentExpenses.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <div className="text-gray-400 mb-2">No expenses found</div>
          <p className="text-sm text-gray-500">
            Try adjusting your filters or add a new expense
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {currentExpenses.map((expense) => (
            <div
              key={expense.id}
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-lg">
                      ${expense.amount.toFixed(2)}
                      <span className="text-sm text-gray-500 ml-2">
                        {expense.currency}
                      </span>
                    </p>
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
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
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                        <Tag className="h-3 w-3" />
                        {expense.categoryName}
                      </span>
                    )}
                  </div>
                  {expense.note && (
                    <p className="text-sm text-gray-700 mt-2">{expense.note}</p>
                  )}
                </div>

                {/* 2. REPLACED: Edit Button that triggers store */}
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
        </div>
      )}

      {/* Pagination */}
      {filteredExpenses.length > EXPENSES_PER_PAGE && (
        <div className="flex items-center justify-between pt-6 border-t">
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1} to{" "}
            {Math.min(endIndex, filteredExpenses.length)} of{" "}
            {filteredExpenses.length} results
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="gap-1"
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
                    className="min-w-10"
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
              className="gap-1"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
