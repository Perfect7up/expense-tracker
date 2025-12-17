"use client";

import { useMemo } from "react";
import {
  Loader2,
  Search,
  Download,
  Filter,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
} from "lucide-react";
import { Button } from "@/app/core/components/ui/button";

export type ListType = "expense" | "income" | "subscription" | "investment";
export type SortOption = "date" | "amount" | "category" | "name" | "subscription" | "return" | "value";

interface GenericListProps<T> {
  data: T[];
  isLoading: boolean;
  isError: boolean;
  error?: Error;

  title: string;
  description: string;
  type: ListType;
  addButton?: React.ReactNode;

  renderItem: (item: T, onEdit?: (item: T) => void) => React.ReactNode;
  renderEmptyState: (
    searchTerm: string,
    hasFilters: boolean,
    clearFilters: () => void
  ) => React.ReactNode;
  onEdit?: (item: T) => void;
  onExport?: (data: T[], title: string) => void;

  searchTerm: string;
  onSearchChange: (term: string) => void;

  hasSorting?: boolean;
  sortBy?: SortOption; 
  onSortByChange?: (sort: SortOption) => void;

  sortOrder?: "asc" | "desc";
  onSortOrderChange?: (order: "asc" | "desc") => void;

  currentPage: number;
  onPageChange: (page: number) => void;
  itemsPerPage?: number;

  getItemDate: (item: T) => Date;
  getItemAmount: (item: T) => number;
  getItemCategory: (item: T) => string | null | undefined;
  getItemCurrency: (item: T) => string;
  getItemName?: (item: T) => string; 
  getItemSubscription?: (item: T) => string | null | undefined;
  getItemReturn?: (item: T) => number;
  getItemValue?: (item: T) => number;
}

export function GenericList<T extends { id: string | number; note?: string }>({
  data,
  isLoading,
  isError,
  error,
  title,
  description,
  type = "expense",
  addButton,
  renderItem,
  renderEmptyState,
  onEdit,
  onExport,
  searchTerm,
  onSearchChange,
  hasSorting,
  sortBy = "date",
  onSortByChange,
  sortOrder = "desc",
  onSortOrderChange,
  currentPage,
  onPageChange,
  itemsPerPage = 10,
  getItemDate,
  getItemAmount,
  getItemCategory,
  getItemCurrency,
  getItemName, 
  getItemSubscription,
  getItemReturn,
  getItemValue,
}: GenericListProps<T>) {
  const processedData = useMemo(() => {
    if (!data) return [];

    let result = [...data];

    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter((item) => {
        const amount = getItemAmount(item).toString();
        const category = getItemCategory(item)?.toLowerCase() || "";
        const note = item.note?.toLowerCase() || "";
        const currency = getItemCurrency(item).toLowerCase();
        const name = getItemName ? getItemName(item).toLowerCase() : "";
        const subscription = getItemSubscription ? getItemSubscription(item)?.toLowerCase() || "" : "";
        const itemReturn = getItemReturn ? getItemReturn(item).toString() : "";
        const itemValue = getItemValue ? getItemValue(item).toString() : "";

        return (
          note.includes(lowerTerm) ||
          amount.includes(lowerTerm) ||
          category.includes(lowerTerm) ||
          currency.includes(lowerTerm) ||
          name.includes(lowerTerm) ||
          subscription.includes(lowerTerm) ||
          itemReturn.includes(lowerTerm) ||
          itemValue.includes(lowerTerm)
        );
      });
    }

    if (hasSorting && sortBy) {
      result.sort((a, b) => {
        let valA: any, valB: any;

        switch (sortBy) {
          case "amount":
            valA = getItemAmount(a);
            valB = getItemAmount(b);
            break;
          case "category":
            valA = getItemCategory(a) || "";
            valB = getItemCategory(b) || "";
            break;
          case "name":
            valA = getItemName ? getItemName(a) : "";
            valB = getItemName ? getItemName(b) : "";
            break;
          case "subscription":
            valA = getItemSubscription ? getItemSubscription(a) || "" : "";
            valB = getItemSubscription ? getItemSubscription(b) || "" : "";
            break;
          case "return":
            valA = getItemReturn ? getItemReturn(a) : 0;
            valB = getItemReturn ? getItemReturn(b) : 0;
            break;
          case "value":
            valA = getItemValue ? getItemValue(a) : 0;
            valB = getItemValue ? getItemValue(b) : 0;
            break;
          case "date":
          default:
            valA = getItemDate(a).getTime();
            valB = getItemDate(b).getTime();
            break;
        }

        if (valA < valB) return sortOrder === "asc" ? -1 : 1;
        if (valA > valB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [
    data,
    searchTerm,
    sortBy,
    sortOrder,
    hasSorting,
    getItemAmount,
    getItemCategory,
    getItemCurrency,
    getItemDate,
    getItemName,
    getItemSubscription,
    getItemReturn,
    getItemValue,
  ]);

  const totalItems = processedData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = processedData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const hasFilters = !!searchTerm;

  const handleSearch = (value: string) => {
    onSearchChange(value);
    onPageChange(1);
  };

  const handleSortByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onSortByChange) onSortByChange(e.target.value as SortOption);
    onPageChange(1);
  };

  const toggleSortOrder = () => {
    if (onSortOrderChange) {
      onSortOrderChange(sortOrder === "asc" ? "desc" : "asc");
      onPageChange(1);
    }
  };

  const clearAllFilters = () => {
    onSearchChange("");
    onPageChange(1);
  };

  if (isError) {
    return (
      <div className="text-center p-10 bg-red-50 rounded-xl text-red-600">
        <p>Error loading data: {error?.message}</p>
        <Button
          variant="outline"
          onClick={() => window.location.reload()}
          className="mt-4"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
          <p className="text-slate-500">{description}</p>
        </div>
        <div className="flex items-center gap-3">
          {onExport && (
            <Button
              variant="outline"
              className="hidden sm:flex rounded-xl border-slate-200 hover:bg-slate-50 text-slate-600"
              onClick={() => onExport(processedData, title)}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          )}
          {addButton}
        </div>
      </div>

      {/* Toolbar Section */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm space-y-4 md:space-y-0 md:flex md:items-center md:gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder={
              type === "subscription" 
                ? "Search by name, amount, category..." 
                : type === "investment"
                ? "Search by name, symbol, category, returns..."
                : "Search by note, amount, category, subscription..."
            }
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
          />
        </div>

        {/* Sorting Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {hasSorting && (
            <div className="flex items-center gap-2 bg-slate-50 rounded-lg border border-slate-200 p-1">
              <select
                value={sortBy}
                onChange={handleSortByChange}
                className="bg-transparent border-none text-sm text-slate-600 focus:ring-0 cursor-pointer py-1 pl-2 pr-1"
              >
                <option value="date">Date</option>
                <option value="amount">Amount</option>
                <option value="category">Category</option>
                {getItemName && <option value="name">Name</option>}
                {getItemSubscription && <option value="subscription">Subscription</option>}
                {getItemReturn && <option value="return">Return</option>}
                {getItemValue && <option value="value">Value</option>}
              </select>
              <div className="w-px h-4 bg-slate-300 mx-1" />
              <button
                onClick={toggleSortOrder}
                className="p-1 hover:bg-slate-200 rounded-md transition-colors"
                title={`Sort ${
                  sortOrder === "asc" ? "Ascending" : "Descending"
                }`}
              >
                <ArrowUpDown
                  className={`h-4 w-4 text-slate-500 transition-transform ${
                    sortOrder === "asc" ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Filter Summary */}
      {hasFilters && (
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Filter className="w-3 h-3" />
          <span>Found {processedData.length} results</span>
          <button
            onClick={clearAllFilters}
            className="text-blue-600 hover:underline ml-2 font-medium"
          >
            Clear search
          </button>
        </div>
      )}

      {/* Content Section */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 className="w-10 h-10 animate-spin mb-4 text-blue-500" />
            <p>Loading records...</p>
          </div>
        ) : processedData.length === 0 ? (
          renderEmptyState(searchTerm, hasFilters, clearAllFilters)
        ) : (
          <div className="grid gap-4">
            {paginatedData.map((item) => renderItem(item, onEdit))}
          </div>
        )}
      </div>

      {/* Pagination Section */}
      {processedData.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <div className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-medium text-slate-900">{startIndex + 1}</span>{" "}
            to{" "}
            <span className="font-medium text-slate-900">
              {Math.min(startIndex + itemsPerPage, processedData.length)}
            </span>{" "}
            of{" "}
            <span className="font-medium text-slate-900">
              {processedData.length}
            </span>{" "}
            results
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-9 w-9 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let p = i + 1;
                if (totalPages > 5) {
                  if (currentPage > 3) p = currentPage - 3 + i;
                  if (p > totalPages) p = i + (totalPages - 4);
                }

                return (
                  <Button
                    key={p}
                    variant={currentPage === p ? "default" : "ghost"}
                    size="sm"
                    onClick={() => onPageChange(p)}
                    className={`h-9 w-9 p-0 ${
                      currentPage === p
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {p}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="h-9 w-9 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}