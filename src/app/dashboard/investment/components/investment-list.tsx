// app/investments/components/investment-list.tsx
"use client";

import { useState } from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  MoreVertical, 
  Pencil, 
  Trash2, 
  PieChart, 
  ArrowRightLeft 
} from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/app/core/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/core/components/ui/dropdown-menu";

import { GenericList, SortOption } from "@/app/core/components/shared/generic-list"; // Adjust path if needed
import { Investment } from "@/app/core/types/investments";

interface Props {
  data: Investment[];
  isLoading?: boolean;
  onEdit: (inv: Investment) => void;
  onDelete: (id: string) => void;
}

export function InvestmentList({ 
  data, 
  isLoading = false, 
  onEdit, 
  onDelete 
}: Props) {
  // Local state for GenericList controls
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);

  // --- Helper Calculations ---
  const calculateCurrentValue = (inv: Investment) => {
    const price = inv.currentPrice ?? inv.averageBuyPrice;
    return inv.quantity * price;
  };

  const calculateReturn = (inv: Investment) => {
    if (!inv.currentPrice) return 0;
    const diff = inv.currentPrice - inv.averageBuyPrice;
    return diff * inv.quantity;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // --- Render Item (Card Design) ---
  const renderItem = (inv: Investment) => {
    const totalValue = calculateCurrentValue(inv);
    const totalReturn = calculateReturn(inv);
    const isPositive = totalReturn >= 0;
    const hasCurrentPrice = inv.currentPrice !== undefined && inv.currentPrice !== null;

    return (
      <div
        key={inv.id}
        className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:shadow-md hover:border-blue-200 transition-all duration-200 gap-4"
      >
        {/* Left: Icon & Main Info */}
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
            inv.type === 'sell' 
              ? "bg-amber-50 text-amber-600" 
              : "bg-blue-50 text-blue-600"
          }`}>
            {inv.type === 'sell' ? (
              <ArrowRightLeft className="w-6 h-6" />
            ) : (
              <PieChart className="w-6 h-6" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-800">{inv.name}</h3>
              {inv.symbol && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {inv.symbol}
                </span>
              )}
            </div>
            
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-slate-500">
              <span className="flex items-center gap-1">
                Qty: <span className="text-slate-700 font-medium">{inv.quantity}</span>
              </span>
              <span className="flex items-center gap-1">
                Avg: <span className="text-slate-700 font-medium">{formatCurrency(inv.averageBuyPrice)}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right: Financials & Actions */}
        <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pl-16 sm:pl-0">
          <div className="text-right">
            <p className="font-bold text-slate-800 text-lg">
              {formatCurrency(totalValue)}
            </p>
            {hasCurrentPrice ? (
              <p className={`text-xs font-medium flex items-center justify-end gap-1 ${
                isPositive ? "text-emerald-600" : "text-rose-600"
              }`}>
                {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {totalReturn > 0 ? "+" : ""}{formatCurrency(totalReturn)}
              </p>
            ) : (
              <p className="text-xs text-slate-400">Current price not set</p>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              <DropdownMenuItem onClick={() => onEdit(inv)} className="cursor-pointer">
                <Pencil className="w-4 h-4 mr-2 text-slate-500" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(inv.id)} 
                className="cursor-pointer text-rose-600 focus:text-rose-600 focus:bg-rose-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    );
  };

  // --- Empty State ---
  const renderEmptyState = (term: string, hasFilters: boolean, clearFilters: () => void) => (
    <div className="text-center py-12 px-4">
      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <PieChart className="w-8 h-8 text-slate-300" />
      </div>
      <h3 className="text-lg font-medium text-slate-900">
        {hasFilters ? "No matching investments" : "No investments yet"}
      </h3>
      <p className="text-slate-500 max-w-sm mx-auto mt-2 mb-6">
        {hasFilters 
          ? `We couldn't find any investments matching "${term}".`
          : "Start building your portfolio by adding your first asset."}
      </p>
      {hasFilters && (
        <Button variant="outline" onClick={clearFilters}>
          Clear Filters
        </Button>
      )}
    </div>
  );

  return (
    <GenericList<Investment>
      data={data}
      isLoading={isLoading}
      isError={false} // You can pass actual error state if available
      title="Portfolio Assets"
      description="Manage your stocks, crypto, and other holdings."
      type="investment"
      
      // State Management
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      sortBy={sortBy}
      onSortByChange={setSortBy}
      sortOrder={sortOrder}
      onSortOrderChange={setSortOrder}
      hasSorting={true}

      // Renderers
      renderItem={renderItem}
      renderEmptyState={renderEmptyState}
      onEdit={onEdit}
      
      // Accessors for GenericList logic
      getItemDate={(item) => item.createdAt ? new Date(item.createdAt) : new Date()} 
      getItemAmount={(item) => item.quantity * item.averageBuyPrice}
      getItemCategory={(item) => item.categoryId}
      getItemCurrency={() => "USD"} // Default or dynamic if you have it
      getItemName={(item) => item.name}
      getItemValue={calculateCurrentValue}
      getItemReturn={calculateReturn}
    />
  );
}