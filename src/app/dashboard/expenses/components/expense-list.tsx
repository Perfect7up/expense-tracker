"use client";

import { useState } from "react";
import { useExpenses } from "@/app/core/hooks/use-expenses";
import { EditExpenseModal } from "./edit-expense-modal";
import { useEditExpenseStore } from "../../store/use-edit-expense-store";
import { Button } from "@/app/core/components/ui/button";
import { Plus, Pencil, DollarSign, Calendar, Tag } from "lucide-react";
import { Badge } from "@/app/core/components/ui/badge";
import { GenericList } from "@/app/core/components/shared/generic-list";

export function ExpenseList() {
  const { expenses, isLoading, isError, error } = useExpenses();
  const { onOpen } = useEditExpenseStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "amount" | "category">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);

  const safeExpenses = expenses || [];
  const exportToCSV = (filteredExpenses: any[], title: string) => {
    if (filteredExpenses.length === 0) {
      alert(`No ${title.toLowerCase()} to export!`);
      return;
    }

    const headers = ["Date", "Time", "Amount", "Currency", "Note", "Category"];
    const csvData = filteredExpenses.map((expense) => {
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
      `${title.toLowerCase()}-${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const renderExpenseItem = (expense: any, onEdit?: (item: any) => void) => (
    <div
      key={expense.id}
      className="bg-white border border-slate-200/50 rounded-xl p-4 hover:shadow-lg hover:border-blue-200/50 transition-all duration-300 group"
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-start gap-4">
            <div className="shrink-0">
              <div className="w-14 h-14 rounded-xl bg-linear-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                <span className="font-bold text-lg text-blue-700">
                  ${expense.amount?.toFixed(2).split(".")[0]}
                </span>
              </div>
            </div>

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
                  {new Date(expense.occurredAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </Badge>

                {expense.categoryName && (
                  <Badge className="bg-linear-to-r from-sky-100 to-blue-100 text-sky-700 border-sky-200/50">
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

        {onEdit && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(expense)}
            className="ml-2 w-8 h-8 rounded-lg border border-transparent hover:border-blue-200/50 hover:bg-blue-50/50 transition-all duration-300 opacity-0 group-hover:opacity-100"
          >
            <Pencil className="h-4 w-4 text-slate-400 hover:text-blue-600" />
          </Button>
        )}
      </div>
    </div>
  );

  const renderEmptyState = (
    searchTerm: string,
    hasFilters: boolean,
    clearAllFilters: () => void
  ) => (
    <div className="bg-linear-to-r from-slate-50/50 to-white border border-slate-200/50 rounded-2xl p-12 text-center">
      <div className="w-20 h-20 rounded-full bg-linear-to-br from-blue-100 to-cyan-100 flex items-center justify-center mx-auto mb-6">
        <DollarSign className="w-10 h-10 text-blue-500" />
      </div>
      <h3 className="text-lg font-semibold text-slate-700 mb-2">
        No expenses found
      </h3>
      <p className="text-slate-500 max-w-md mx-auto mb-6">
        {hasFilters
          ? "Try adjusting your filters or search term"
          : "Start tracking your expenses by adding your first transaction"}
      </p>
      <Button
        className="rounded-full bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
        onClick={clearAllFilters}
      >
        {hasFilters ? "Clear Filters" : "Add Your First Expense"}
      </Button>
    </div>
  );

  return (
    <>
      <EditExpenseModal />
      <GenericList
        data={safeExpenses}
        isLoading={isLoading}
        isError={isError}
        error={error}
        title="All Expenses"
        description="Track and manage your spending history"
        type="expense"
        renderItem={renderExpenseItem}
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
        getItemAmount={(expense) => expense.amount || 0}
        getItemCategory={(expense) => expense.categoryName}
        getItemDate={(expense) => new Date(expense.occurredAt)}
        getItemCurrency={(expense) => expense.currency || "USD"}
        addButton={
          <Button className="rounded-xl bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white gap-2 px-4 h-12 transition-all duration-300">
            <Plus className="h-4 w-4" />
            Add Expense
          </Button>
        }
      />
    </>
  );
}
