"use client";

import { useState, useMemo, useCallback } from "react";
import { useIncomes } from "@/app/core/hooks/use-income";
import { useIncomeCategories } from "@/app/core/hooks/use-categories";
import { EditIncomeModal } from "./edit-income-modal";
import { Button } from "@/app/core/components/ui/button";
import { Plus, Wallet, Calendar, Tag } from "lucide-react";
import { Badge } from "@/app/core/components/ui/badge";
import { GenericList } from "@/app/core/components/shared/generic-list";

export function IncomeList() {
  // 1. FIX: Destructure direct values instead of 'incomesQuery'
  const { incomes: rawIncomes, isLoading, isError, error } = useIncomes();
  const { data: categories } = useIncomeCategories();

  // State
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "amount" | "category">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);

  // 2. FIX: Use the rawIncomes directly (it's already an array)
  const incomes = useMemo(() => rawIncomes || [], [rawIncomes]);

  // Helper function
  const getCategoryName = useCallback(
    (categoryId: string | null | undefined) => {
      if (!categoryId) return null;
      if (categoryId === "none") return "No category";
      if (categoryId === "uncategorized") return "Uncategorized";
      const category = (categories || []).find((c: any) => c.id === categoryId);
      return category?.name || null;
    },
    [categories]
  );

  // Map incomes with category names
  const mappedIncomes = useMemo(() => {
    return incomes.map((income: any) => ({
      ...income,
      categoryName: getCategoryName(income.categoryId),
    }));
  }, [incomes, getCategoryName]);

  // Export function
  const exportToCSV = (filteredIncomes: any[], title: string) => {
    if (filteredIncomes.length === 0) {
      alert(`No ${title.toLowerCase()} to export!`);
      return;
    }

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
        income.amount?.toFixed(2) || "0.00",
        income.currency || "USD",
        income.source || "",
        `"${(income.note || "").replace(/"/g, '""')}"`,
        income.categoryName || "Uncategorized",
      ];
    });

    const csvContent = [
      headers.join(","),
      ...csvData.map((row: any) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `${title.toLowerCase()}-${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const renderIncomeItem = (income: any) => {
    const categoryName = getCategoryName(income.categoryId);

    return (
      <div
        key={income.id}
        className="bg-white border border-slate-200/50 rounded-xl p-4 hover:shadow-lg hover:border-blue-200/50 transition-all duration-300 group"
      >
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-start gap-4">
              {/* Amount Circle */}
              <div className="shrink-0">
                <div className="w-14 h-14 rounded-xl bg-linear-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                  <span className="font-bold text-lg text-blue-700">
                    ${income.amount?.toFixed(2).split(".")[0]}
                  </span>
                </div>
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <p className="font-semibold text-slate-900 truncate">
                    ${income.amount.toFixed(2)}
                    <span className="text-sm font-normal text-slate-500 ml-2">
                      {income.currency}
                    </span>
                  </p>

                  {income.source && (
                    <Badge className="bg-linear-to-r from-blue-100 to-cyan-100 text-blue-700 border-blue-200/50">
                      {income.source}
                    </Badge>
                  )}

                  <Badge className="bg-linear-to-r from-slate-100 to-slate-50 text-slate-700 border-slate-200/50">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(income.receivedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </Badge>

                  {categoryName && (
                    <Badge className="bg-linear-to-r from-sky-100 to-blue-100 text-sky-700 border-sky-200/50">
                      <Tag className="h-3 w-3 mr-1" />
                      {categoryName}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-2 mb-2 text-sm text-slate-600">
                  <span>
                    {new Date(income.receivedAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                {income.note && (
                  <p className="text-sm text-slate-700 p-3 bg-linear-to-r from-slate-50/50 to-white rounded-lg border border-slate-200/30">
                    {income.note}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="ml-2">
            <EditIncomeModal income={income} />
          </div>
        </div>
      </div>
    );
  };

  const renderEmptyState = (
    searchTerm: string,
    hasFilters: boolean,
    clearAllFilters: () => void
  ) => (
    <div className="bg-linear-to-r from-slate-50/50 to-white border border-slate-200/50 rounded-2xl p-12 text-center">
      <div className="w-20 h-20 rounded-full bg-linear-to-br from-blue-100 to-cyan-100 flex items-center justify-center mx-auto mb-6">
        <Wallet className="w-10 h-10 text-blue-500" />
      </div>
      <h3 className="text-lg font-semibold text-slate-700 mb-2">
        No incomes found
      </h3>
      <p className="text-slate-500 max-w-md mx-auto mb-6">
        {hasFilters
          ? "Try adjusting your filters or search term"
          : "Start tracking your incomes by adding your first transaction"}
      </p>
      <Button
        className="rounded-full bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
        onClick={clearAllFilters}
      >
        {hasFilters ? "Clear Filters" : "Add Your First Income"}
      </Button>
    </div>
  );

  return (
    <GenericList
      data={mappedIncomes}
      isLoading={isLoading}
      isError={isError}
      error={error as Error}
      title="All Incomes"
      description="Track and manage your income history"
      type="income"
      renderItem={renderIncomeItem}
      renderEmptyState={renderEmptyState}
      onExport={exportToCSV}
      hasSorting={true}
      sortBy={sortBy}
      onSortByChange={setSortBy}
      sortOrder={sortOrder}
      onSortOrderChange={setSortOrder}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      getItemAmount={(income) => income.amount || 0}
      getItemCategory={(income) => income.categoryName}
      getItemDate={(income) => new Date(income.receivedAt)}
      getItemCurrency={(income) => income.currency || "USD"}
      addButton={
        <Button className="rounded-xl bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white gap-2 px-4 h-12 transition-all duration-300">
          <Plus className="h-4 w-4" />
          Add Income
        </Button>
      }
    />
  );
}
