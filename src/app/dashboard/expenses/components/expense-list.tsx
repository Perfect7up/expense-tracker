"use client";

import { useState } from "react";
import { useExpenses } from "../hooks/use-expenses";
import { EditExpenseModal } from "./edit-expense-modal";
import { useEditExpenseStore } from "../store/use-edit-expense-store";
import { Button } from "@/app/core/components/ui/button";
import { Plus, Pencil, DollarSign, Calendar, Tag, Repeat, RefreshCw, ArrowRight } from "lucide-react";
import { Badge } from "@/app/core/components/ui/badge";
import { GenericList, SortOption } from "@/app/core/components/shared/generic-list";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { cn } from "@/app/core/lib/utils";

export function ExpenseList() {
  const { expenses, isLoading, isError, error } = useExpenses();
  const { onOpen } = useEditExpenseStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [isSyncing, setIsSyncing] = useState(false);
  const queryClient = useQueryClient();

  const safeExpenses = expenses || [];

  const handleSyncSubscriptions = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch("/api/subscription/sync", { method: "POST" });
      const data = await res.json();
      
      if (res.ok) {
        if (data.processed > 0) {
          toast.success(`Generated ${data.processed} expenses from subscriptions!`);
          queryClient.invalidateQueries({ queryKey: ["expenses"] });
          queryClient.invalidateQueries({ queryKey: ["subscriptions"] }); 
        } else {
          toast.info("No subscriptions are currently due.");
        }
      } else {
        throw new Error(data.error || "Failed to sync");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to sync subscriptions");
    } finally {
      setIsSyncing(false);
    }
  };
  
  const exportToCSV = (filteredExpenses: any[], title: string) => {
    if (filteredExpenses.length === 0) {
      alert(`No ${title.toLowerCase()} to export!`);
      return;
    }

    const headers = ["Date", "Time", "Amount", "Currency", "Note", "Category", "Subscription"];
    const csvData = filteredExpenses.map((expense) => {
      const date = new Date(expense.occurredAt);
      return [
        date.toLocaleDateString(),
        date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        expense.amount?.toFixed(2) || "0.00",
        expense.currency || "USD",
        `"${(expense.note || "").replace(/"/g, '""')}"`,
        expense.categoryName || "Uncategorized",
        expense.subscriptionName || expense.subscription?.name || "", 
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
      className="bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-xl p-3 sm:p-4 hover:shadow-lg hover:border-blue-200 transition-all duration-300 group hover:bg-white/90 relative"
    >
      <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
        {/* Header Section Mobile: Icon + Amount + Edit */}
        <div className="flex items-center justify-between sm:hidden w-full mb-2">
           <div className="flex items-center gap-3">
              <div className="shrink-0 w-10 h-10 rounded-xl bg-linear-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-md shadow-blue-500/20">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <p className="font-bold text-slate-900 text-lg">
                  ${expense.amount?.toFixed(2)}
                  <span className="text-sm font-normal text-slate-500 ml-1">
                    {expense.currency}
                  </span>
              </p>
           </div>
           {onEdit && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(expense)}
              className="h-8 w-8 rounded-lg"
            >
              <Pencil className="h-4 w-4 text-slate-400" />
            </Button>
           )}
        </div>

        {/* Desktop Icon */}
        <div className="hidden sm:block shrink-0">
          <div className="w-14 h-14 rounded-xl bg-linear-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-md shadow-blue-500/20">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          {/* Desktop Amount & Badges */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <div className="flex flex-wrap items-center gap-2">
              <p className="hidden sm:block font-bold text-slate-900 text-lg truncate mr-2">
                ${expense.amount?.toFixed(2)}
                <span className="text-sm font-normal text-slate-500 ml-2">
                  {expense.currency}
                </span>
              </p>

              <div className="flex flex-wrap gap-2">
                <Badge className="bg-linear-to-r from-blue-50 to-cyan-50 text-blue-600 border border-blue-200/50 text-[10px] sm:text-xs">
                  <Calendar className="w-3 h-3 mr-1" />
                  {new Date(expense.occurredAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </Badge>

                {expense.categoryName && (
                  <Badge className="bg-linear-to-r from-sky-50 to-blue-50 text-sky-600 border border-sky-200/50 text-[10px] sm:text-xs">
                    <Tag className="h-3 w-3 mr-1" />
                    {expense.categoryName}
                  </Badge>
                )}

                {(expense.subscriptionName || expense.subscription?.name) && (
                  <Badge className="bg-linear-to-r from-purple-50 to-indigo-50 text-purple-600 border border-purple-200/50 text-[10px] sm:text-xs">
                    <Repeat className="h-3 w-3 mr-1" />
                    {expense.subscriptionName || expense.subscription?.name}
                  </Badge>
                )}
              </div>
            </div>

            {/* Desktop Edit Button */}
            {onEdit && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(expense)}
                className="hidden sm:flex shrink-0 w-8 h-8 rounded-lg border border-transparent hover:border-blue-200 hover:bg-blue-50/80 transition-all duration-300 opacity-0 group-hover:opacity-100"
              >
                <Pencil className="h-4 w-4 text-slate-400 hover:text-blue-600" />
              </Button>
            )}
          </div>

          {/* Notes */}
          {expense.note && (
            <p className="text-xs sm:text-sm text-slate-700 p-2 sm:p-3 bg-linear-to-r from-slate-50/50 to-white rounded-lg border border-slate-200/50">
              {expense.note}
            </p>
          )}

          {/* Subscription Detail */}
          {expense.subscription?.cycle && (
            <div className="mt-2 text-xs text-slate-500 flex flex-wrap items-center gap-1">
              <Repeat className="w-3 h-3" />
              <span>
                {(() => {
                  const cycleMap: Record<string, string> = {
                    "DAILY": "Daily",
                    "WEEKLY": "Weekly", 
                    "MONTHLY": "Monthly",
                    "QUARTERLY": "Quarterly",
                    "BIANNUALLY": "Every 6 Months",
                    "YEARLY": "Yearly"
                  };
                  return cycleMap[expense.subscription.cycle] || expense.subscription.cycle.toLowerCase();
                })()}
              </span>
              {expense.subscription.amount && (
                <span className="ml-1">
                  • ${expense.subscription.amount}
                  {expense.subscription.currency && expense.subscription.currency !== "USD" ? ` ${expense.subscription.currency}` : ''}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderEmptyState = (
    searchTerm: string,
    hasFilters: boolean,
    clearAllFilters: () => void
  ) => (
    <div className="bg-linear-to-r from-slate-50/50 to-white border border-slate-200/50 rounded-2xl p-6 sm:p-12 text-center">
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-linear-to-br from-blue-100 to-cyan-100 flex items-center justify-center mx-auto mb-4 sm:mb-6">
        <DollarSign className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
      </div>
      <h3 className="text-base sm:text-lg font-semibold text-slate-700 mb-2">
        No expenses found
      </h3>
      <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
        {hasFilters
          ? "Try adjusting your filters or search term"
          : "Start tracking your expenses by adding your first transaction"}
      </p>
      <Button
        className="w-full sm:w-auto rounded-full bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 group"
        onClick={clearAllFilters}
      >
        {hasFilters ? "Clear Filters" : "Add Your First Expense"}
        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </Button>
    </div>
  );

  return (
    <>
      <EditExpenseModal />
      <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-6 border border-slate-200/50 shadow-lg">
        {/* Responsive Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 sm:mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Expense List</h2>
            <p className="text-sm text-slate-500 mt-1">
              View and manage all your expenses
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <Button 
              onClick={handleSyncSubscriptions}
              disabled={isSyncing}
              variant="outline"
              className="w-full sm:w-auto rounded-full h-10 sm:h-12 border-blue-200/50 text-blue-600 hover:bg-blue-50/80 hover:border-blue-300 transition-all duration-300 justify-center"
            >
              <RefreshCw className={cn("h-4 w-4 mr-2", isSyncing && "animate-spin")} />
              {isSyncing ? "Checking..." : "Check Due Subs"}
            </Button>

            <Button className="w-full sm:w-auto rounded-full bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white gap-2 px-6 h-10 sm:h-12 transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 group justify-center">
              <Plus className="h-4 w-4" />
              Add Expense
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>

        <GenericList
          data={safeExpenses}
          isLoading={isLoading}
          isError={isError}
          error={error}
          title=""
          description=""
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
          getItemSubscription={(expense) => expense.subscriptionName || expense.subscription?.name}
          addButton={null}
        />
      </div>
    </>
  );
}