"use client";

import { useState } from "react";
import { useIncomes } from "@/app/core/hooks/use-income";
import { useIncomeCategories } from "@/app/core/hooks/use-categories";
import { EditIncomeModal } from "./edit-income-modal";
import { Button } from "@/app/core/components/ui/button";
import { Input } from "@/app/core/components/ui/input";
import { Calendar } from "@/app/core/components/ui/calendar";
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
import { Filter, Calendar as CalendarIcon, Download, Tag } from "lucide-react";

export function IncomeList() {
  const { incomesQuery } = useIncomes();
  const { data: categories, isLoading: categoriesLoading } =
    useIncomeCategories();
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
  const [monthFilter, setMonthFilter] = useState<string>("");
  const [yearFilter, setYearFilter] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const incomes = incomesQuery.data || [];
  const isLoading = incomesQuery.isLoading || categoriesLoading;

  if (isLoading) {
    return <div className="text-center py-8">Loading incomes...</div>;
  }

  if (incomesQuery.isError) {
    return (
      <div className="text-center py-8 text-red-500">
        Failed to load incomes
      </div>
    );
  }

  const safeCategories = categories || [];

  // Helper function to get category name
  const getCategoryName = (categoryId: string | null | undefined) => {
    if (!categoryId) return null;
    if (categoryId === "none") return "No category";
    if (categoryId === "uncategorized") return "Uncategorized";
    const category = safeCategories.find((c) => c.id === categoryId);
    return category?.name || null;
  };

  // Apply filters
  const filteredIncomes = incomes.filter((income: any) => {
    const incomeDate = new Date(income.receivedAt);

    // Date filter
    if (dateFilter) {
      const filterDate = new Date(dateFilter);
      if (
        incomeDate.getDate() !== filterDate.getDate() ||
        incomeDate.getMonth() !== filterDate.getMonth() ||
        incomeDate.getFullYear() !== filterDate.getFullYear()
      ) {
        return false;
      }
    }

    // Month filter
    if (monthFilter) {
      if (incomeDate.getMonth() + 1 !== parseInt(monthFilter)) {
        return false;
      }
    }

    // Year filter
    if (yearFilter) {
      if (incomeDate.getFullYear() !== parseInt(yearFilter)) {
        return false;
      }
    }

    // Search term filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const categoryName = getCategoryName(income.categoryId);
      return (
        income.note?.toLowerCase().includes(searchLower) ||
        income.amount.toString().includes(searchTerm) ||
        income.source?.toLowerCase().includes(searchLower) ||
        categoryName?.toLowerCase().includes(searchLower)
      );
    }

    return true;
  });

  // Calculate totals
  const totalAmount = filteredIncomes.reduce(
    (total: number, income: any) => total + income.amount,
    0
  );

  // Get unique years for filter
  // FIX: Explicitly type the Set as <number> and type the sort arguments
  const uniqueYears = Array.from(
    new Set<number>(
      incomes.map((income: any) => new Date(income.receivedAt).getFullYear())
    )
  ).sort((a: number, b: number) => b - a);

  // Export to CSV
  const exportToCSV = () => {
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
        getCategoryName(income.categoryId) || "",
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
    a.download = `incomes-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  console.log("Categories loaded:", safeCategories);
  console.log("Sample income categoryId:", incomes[0]?.categoryId);

  return (
    <div className="mt-6 space-y-4">
      {/* Filters and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex-1 flex flex-col sm:flex-row gap-2">
          <Input
            placeholder="Search incomes..."
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
              <DialogHeader>
                <DialogTitle>Filter Incomes</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Select Date
                  </label>
                  <Calendar
                    mode="single"
                    selected={dateFilter}
                    onSelect={setDateFilter}
                    className="rounded-md border"
                  />
                </div>
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
                        <SelectItem value="none">All months</SelectItem>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(
                          (month) => (
                            <SelectItem key={month} value={month.toString()}>
                              {new Date(2000, month - 1, 1).toLocaleDateString(
                                "en-US",
                                { month: "long" }
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
                        <SelectItem value="none">All years</SelectItem>
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
                      setIsFilterOpen(false);
                    }}
                  >
                    Clear Filters
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

      {/* Active Filters */}
      {(dateFilter || monthFilter || yearFilter) && (
        <div className="flex flex-wrap gap-2 items-center text-sm">
          <span className="text-gray-600">Active filters:</span>
          {dateFilter && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full flex items-center gap-1">
              <CalendarIcon className="h-3 w-3" />
              {dateFilter.toLocaleDateString()}
              <button
                onClick={() => setDateFilter(undefined)}
                className="ml-1 hover:text-blue-600"
              >
                ×
              </button>
            </span>
          )}
          {monthFilter && (
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full">
              Month:{" "}
              {new Date(2000, parseInt(monthFilter) - 1, 1).toLocaleDateString(
                "en-US",
                { month: "long" }
              )}
              <button
                onClick={() => setMonthFilter("")}
                className="ml-1 hover:text-green-600"
              >
                ×
              </button>
            </span>
          )}
          {yearFilter && (
            <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
              Year: {yearFilter}
              <button
                onClick={() => setYearFilter("")}
                className="ml-1 hover:text-purple-600"
              >
                ×
              </button>
            </span>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setDateFilter(undefined);
              setMonthFilter("");
              setYearFilter("");
            }}
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Summary */}
      <div className="p-4 bg-linear-to-r from-green-50 to-emerald-50 rounded-lg">
        <div className="flex flex-wrap justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">Filtered Incomes</p>
            <p className="text-2xl font-bold">${totalAmount.toFixed(2)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">
              {filteredIncomes.length} of {incomes.length} incomes
            </p>
            <p className="text-sm">
              {dateFilter
                ? "Showing selected date"
                : monthFilter
                  ? `Showing ${new Date(2000, parseInt(monthFilter) - 1, 1).toLocaleDateString("en-US", { month: "long" })}`
                  : yearFilter
                    ? `Showing ${yearFilter}`
                    : "Showing all incomes"}
            </p>
          </div>
        </div>
      </div>

      {/* Income List */}
      {filteredIncomes.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <div className="text-gray-400 mb-2">No incomes found</div>
          <p className="text-sm text-gray-500">
            {searchTerm || dateFilter || monthFilter || yearFilter
              ? "Try adjusting your filters or search term"
              : "Add your first income to get started!"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredIncomes.map((income: any) => {
            const categoryName = getCategoryName(income.categoryId);

            console.log(
              `Income ${income.id}: categoryId=${income.categoryId}, categoryName=${categoryName}`
            );

            return (
              <div
                key={income.id}
                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-lg">
                        ${income.amount.toFixed(2)}
                        <span className="text-sm text-gray-500 ml-2">
                          {income.currency}
                        </span>
                      </p>
                      {income.source && (
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                          {income.source}
                        </span>
                      )}
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                        {new Date(income.receivedAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </span>
                      {categoryName && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                          <Tag className="h-3 w-3" />
                          {categoryName}
                        </span>
                      )}
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                      <CalendarIcon className="h-3 w-3" />
                      {new Date(income.receivedAt).toLocaleDateString("en-US", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                    {income.note && (
                      <p className="text-sm text-gray-700 mt-2">
                        {income.note}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <EditIncomeModal income={income} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
