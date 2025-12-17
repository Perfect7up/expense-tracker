"use client";

import { useState } from "react";
import { useSubscription } from "@/app/core/hooks/use-subscription";
import { Button } from "@/app/core/components/ui/button";
import { Plus, Pencil, RotateCw, Calendar, Tag, Activity } from "lucide-react";
import { Badge } from "@/app/core/components/ui/badge";
import { GenericList, type SortOption } from "@/app/core/components/shared/generic-list";
import { format } from "date-fns";

interface SubscriptionListProps {
  onEdit: (subscription: any) => void;
  onAdd?: () => void;
}

export function SubscriptionList({ onEdit, onAdd }: SubscriptionListProps) {
  const { subscriptions, isLoading, isError, error, formatCycle } = useSubscription();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc"); 
  const [currentPage, setCurrentPage] = useState(1);

  const safeSubscriptions = subscriptions || [];

  const exportToCSV = (filteredItems: any[], title: string) => {
    if (filteredItems.length === 0) {
      alert(`No ${title.toLowerCase()} to export!`);
      return;
    }

    const headers = ["Name", "Amount", "Currency", "Cycle", "Next Billing", "Status", "Category"];
    const csvData = filteredItems.map((sub) => {
      return [
        `"${sub.name.replace(/"/g, '""')}"`,
        sub.amount?.toFixed(2) || "0.00",
        sub.currency || "USD",
        sub.cycle,
        format(new Date(sub.nextBilling), "yyyy-MM-dd"),
        sub.isActive ? "Active" : "Inactive",
        sub.category || "Uncategorized",
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
      `subscriptions-${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const renderSubscriptionItem = (sub: any, onEditItem?: (item: any) => void) => (
    <div
      key={sub.id}
      className="bg-white border border-slate-200/50 rounded-xl p-4 hover:shadow-lg hover:border-blue-200/50 transition-all duration-300 group"
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-start gap-4">
            <div className="shrink-0">
              <div className="w-14 h-14 rounded-xl bg-linear-to-br from-indigo-100 to-blue-100 flex items-center justify-center">
                <span className="font-bold text-lg text-indigo-700">
                   {sub.name.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <p className="font-semibold text-slate-900 truncate">
                  {sub.name}
                  <span className="text-sm font-normal text-slate-500 ml-2">
                    {sub.currency} {sub.amount?.toFixed(2)}
                  </span>
                </p>

                <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200">
                  <RotateCw className="w-3 h-3 mr-1" />
                  {formatCycle ? formatCycle(sub.cycle) : sub.cycle}
                </Badge>

                {sub.isActive ? (
                  <Badge className="bg-linear-to-r from-emerald-100 to-green-100 text-emerald-700 border-emerald-200/50">
                    <Activity className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-slate-400 border-slate-200">
                    Inactive
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-3 text-sm text-slate-500">
                <div className="flex items-center">
                  <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  <span>Next: {format(new Date(sub.nextBilling), "MMM d, yyyy")}</span>
                </div>
                {sub.category && (
                  <div className="flex items-center">
                    <Tag className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    <span>{sub.category}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {onEditItem && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEditItem(sub)}
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
        <RotateCw className="w-10 h-10 text-blue-500" />
      </div>
      <h3 className="text-lg font-semibold text-slate-700 mb-2">
        No subscriptions found
      </h3>
      <p className="text-slate-500 max-w-md mx-auto mb-6">
        {hasFilters
          ? "Try adjusting your search terms"
          : "Start tracking your recurring payments by adding a subscription"}
      </p>
      
      {/* FIX: Only show button if hasFilters OR onAdd is present */}
      {(hasFilters || onAdd) && (
        <Button
          className="rounded-full bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
          onClick={hasFilters ? clearAllFilters : onAdd}
        >
          {hasFilters ? "Clear Filters" : "Add Subscription"}
        </Button>
      )}
    </div>
  );

  return (
    <GenericList
      data={safeSubscriptions}
      isLoading={isLoading}
      isError={isError}
      error={error}
      title="All Subscriptions"
      description="Manage your recurring services"
      type="subscription"
      renderItem={renderSubscriptionItem}
      renderEmptyState={renderEmptyState}
      onExport={exportToCSV}
      onEdit={onEdit}
      hasSorting={true}
      sortBy={sortBy}
      onSortByChange={setSortBy}
      sortOrder={sortOrder}
      onSortOrderChange={setSortOrder}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      getItemAmount={(item) => item.amount || 0}
      getItemCategory={(item) => item.category}
      getItemDate={(item) => new Date(item.nextBilling)}
      getItemCurrency={(item) => item.currency || "USD"}
      addButton={
        onAdd ? (
          <Button 
            onClick={onAdd}
            className="rounded-xl bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white gap-2 px-4 h-12 transition-all duration-300"
          >
            <Plus className="h-4 w-4" />
            Add Subscription
          </Button>
        ) : undefined
      }
    />
  );
}