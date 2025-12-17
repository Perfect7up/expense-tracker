"use client";

import { useState, useMemo, useCallback } from "react";
import { useIncomes } from "@/app/core/hooks/use-income";
import { useIncomeCategories } from "@/app/core/hooks/use-categories";
import { EditIncomeModal } from "./edit-income-modal";
import { useEditIncomeStore } from "../store/use-edit-income-store";
import { Button } from "@/app/core/components/ui/button";
import { Plus, Pencil, Wallet, Calendar, Tag, DollarSign, TrendingUp, ArrowRight } from "lucide-react";
import { Badge } from "@/app/core/components/ui/badge";
import { GenericList, type SortOption } from "@/app/core/components/shared/generic-list";

export function IncomeList() {
  const { incomes: rawIncomes, isLoading, isError, error } = useIncomes();
  const { data: categories } = useIncomeCategories();
  const { onOpen } = useEditIncomeStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);

  const incomes = useMemo(() => rawIncomes || [], [rawIncomes]);

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

  const mappedIncomes = useMemo(() => {
    return incomes.map((income: any) => ({
      ...income,
      categoryName: getCategoryName(income.categoryId),
    }));
  }, [incomes, getCategoryName]);

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
      "Investment",
      "Investment Symbol",
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
        income.investmentName || "",
        income.investmentSymbol || "",
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

  const renderIncomeItem = (income: any, onEdit?: (item: any) => void) => {
    const categoryName = getCategoryName(income.categoryId);

    return (
      <div
        key={income.id}
        className="bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-xl p-4 hover:shadow-lg hover:border-blue-200 transition-all duration-300 group hover:bg-white/90"
      >
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-start gap-4">
              {/* Amount Circle */}
              <div className="shrink-0">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-md ${income.investmentName ? "bg-gradient-to-br from-emerald-500 to-green-500 shadow-emerald-500/20" : "bg-gradient-to-br from-blue-500 to-cyan-400 shadow-blue-500/20"}`}>
                  {income.investmentName ? (
                    <TrendingUp className="w-6 h-6 text-white" />
                  ) : (
                    <DollarSign className="w-6 h-6 text-white" />
                  )}
                </div>
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <p className="font-bold text-slate-900 text-lg truncate">
                    ${income.amount?.toFixed(2)}
                    <span className="text-sm font-normal text-slate-500 ml-2">
                      {income.currency}
                    </span>
                  </p>

                  {income.source && (
                    <Badge className="bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-600 border border-blue-200/50">
                      {income.source}
                    </Badge>
                  )}

                  <Badge className="bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-600 border border-blue-200/50">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(income.receivedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </Badge>

                  {categoryName && (
                    <Badge className="bg-gradient-to-r from-sky-50 to-blue-50 text-sky-600 border border-sky-200/50">
                      <Tag className="h-3 w-3 mr-1" />
                      {categoryName}
                    </Badge>
                  )}

                  {/* Investment Badge */}
                  {income.investmentName && (
                    <Badge className="bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-600 border border-emerald-200/50">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {income.investmentName}
                      {income.investmentSymbol && ` (${income.investmentSymbol})`}
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
                  <p className="text-sm text-slate-700 p-3 bg-gradient-to-r from-slate-50/50 to-white rounded-lg border border-slate-200/50">
                    {income.note}
                  </p>
                )}
              </div>
            </div>
          </div>

          {onEdit && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(income)}
              className="ml-2 w-8 h-8 rounded-lg border border-transparent hover:border-blue-200 hover:bg-blue-50/80 transition-all duration-300 opacity-0 group-hover:opacity-100"
            >
              <Pencil className="h-4 w-4 text-slate-400 hover:text-blue-600" />
            </Button>
          )}
        </div>
      </div>
    );
  };

  const renderEmptyState = (
    searchTerm: string,
    hasFilters: boolean,
    clearAllFilters: () => void
  ) => (
    <div className="bg-gradient-to-r from-slate-50/50 to-white border border-slate-200/50 rounded-2xl p-12 text-center">
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center mx-auto mb-6">
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
        className="rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 group"
        onClick={clearAllFilters}
      >
        {hasFilters ? "Clear Filters" : "Add Your First Income"}
        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </Button>
    </div>
  );

  return (
    <>
      <EditIncomeModal />
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 shadow-lg">
        {/* Custom Header to match the new design */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Income List</h2>
            <p className="text-slate-500 mt-1">
              View and manage all your income sources
            </p>
          </div>
          <Button 
            className="rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white gap-2 px-6 h-12 transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 group"
          >
            <Plus className="h-4 w-4" />
            Add Income
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        {/* GenericList with minimal title/description that won't be displayed */}
        <GenericList
          data={mappedIncomes}
          isLoading={isLoading}
          isError={isError}
          error={error as Error}
          title=""
          description=""
          type="income"
          renderItem={renderIncomeItem}
          renderEmptyState={renderEmptyState}
          onExport={exportToCSV}
          onEdit={onOpen}
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
          getItemSubscription={(income) => income.investmentName}
          addButton={null}
        />
      </div>
    </>
  );
}