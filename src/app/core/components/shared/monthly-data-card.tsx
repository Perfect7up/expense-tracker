"use client";

import { ReactNode } from "react";
// ... (Your existing imports remain the same) ...
import {
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/core/components/ui/card";
import { Button } from "@/app/core/components/ui/button";
import { Badge } from "@/app/core/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Calendar,
  Sparkles,
  Clock,
  Zap,
  ArrowRight,
  FileText,
  TrendingUp,
  Target,
  BarChart3,
  DollarSign,
  Tag,
  Pencil,
} from "lucide-react";

// ... (MonthlyDataCardProps and MonthlyDataCard function remain exactly the same) ...

export interface MonthlyDataCardProps<T> {
  // Core data
  data: T[];
  isLoading: boolean;
  isError: boolean;
  error?: Error | null;

  // Configuration
  title: string;
  description: string;
  type: "expense" | "income";
  icon: ReactNode;

  // Date handling
  selectedDate?: Date;
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
  onCurrentMonthClick: () => void;
  onExport: () => void;

  // Render functions
  renderItem: (item: T) => ReactNode;
  renderEmptyState: () => ReactNode;

  // Statistics
  totalAmount: number;
  itemCount: number;
  averageAmount: number;
  highestAmount: number;
  lowestAmount?: number;

  // Pagination
  showPagination?: boolean;
  currentPage?: number;
  totalPages?: number;
  onPreviousPage?: () => void;
  onNextPage?: () => void;
  onPageChange?: (page: number) => void;

  // Actions
  onEdit?: (item: T) => void;
  addButton?: ReactNode;
}

export function MonthlyDataCard<T>({
  data,
  isLoading,
  isError,
  error,
  title,
  description,
  icon,
  currentMonth,
  onMonthChange,
  onCurrentMonthClick,
  onExport,
  renderItem,
  renderEmptyState,
  totalAmount,
  itemCount,
  averageAmount,
  highestAmount,
  showPagination = false,
  currentPage = 1,
  totalPages = 1,
  onPreviousPage,
  onNextPage,
  onPageChange,
  addButton,
}: MonthlyDataCardProps<T>) {
  const now = new Date();
  const isCurrentMonth =
    currentMonth.getFullYear() === now.getFullYear() &&
    currentMonth.getMonth() === now.getMonth();

  const goToPreviousMonth = () => {
    onMonthChange(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    const nextMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      1
    );
    if (nextMonth > now) return;
    onMonthChange(nextMonth);
  };

  // All components now use blue theme
  const getTypeColor = () => {
    return "from-blue-500 to-cyan-500";
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <div className="w-16 h-16 rounded-full bg-linear-to-br from-blue-100 to-cyan-100 flex items-center justify-center animate-pulse">
          <Calendar className="w-8 h-8 text-blue-500" />
        </div>
        <p className="text-lg text-slate-700 font-medium">
          Loading {title.toLowerCase()}...
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
          Failed to load {title.toLowerCase()}
        </p>
        <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
          {error?.message ||
            `There was an error loading your ${title.toLowerCase()}. Please try again.`}
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

  return (
    <div className="relative">
      {/* Background effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-blue-100/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-cyan-100/10 rounded-full blur-3xl" />
      </div>

      <div className="bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-2xl shadow-xl overflow-hidden">
        {/* Header - Always blue theme */}
        <div className={`relative bg-linear-to-r ${getTypeColor()} p-6`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 blur-2xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12 blur-2xl" />

          <CardHeader className="relative z-10 p-0">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                  {icon}
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-white">
                    {title}
                  </CardTitle>
                  <p className="text-sm text-blue-100/80">{description}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {addButton}
                <Button
                  onClick={onExport}
                  disabled={data.length === 0}
                  className="rounded-xl bg-white/20 backdrop-blur-sm hover:bg-white/30 border border-white/30 text-white gap-2 px-4 h-12 transition-all duration-300 group"
                >
                  <Download className="h-4 w-4" />
                  Export Month
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </CardHeader>
        </div>

        <CardContent className="p-6 space-y-6">
          {/* Month Navigation */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-linear-to-r from-blue-50/50 to-cyan-50/50 rounded-xl border border-blue-100/30">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPreviousMonth}
                className="rounded-lg w-10 h-10 border-blue-200/50 hover:bg-blue-50 hover:border-blue-300"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="text-center">
                <h3 className="text-xl font-bold text-slate-900">
                  {currentMonth.toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </h3>
                {!isCurrentMonth ? (
                  <Badge className="mt-1 bg-linear-to-r from-blue-100 to-cyan-100 text-blue-700 border-blue-200/50">
                    <Clock className="w-3 h-3 mr-1" />
                    Viewing past month
                  </Badge>
                ) : (
                  <Badge className="mt-1 bg-linear-to-r from-blue-100 to-cyan-100 text-blue-700 border-blue-200/50">
                    <Zap className="w-3 h-3 mr-1" />
                    Current month
                  </Badge>
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={goToNextMonth}
                disabled={
                  !isCurrentMonth &&
                  currentMonth.getMonth() >= now.getMonth() &&
                  currentMonth.getFullYear() >= now.getFullYear()
                }
                className="rounded-lg w-10 h-10 border-blue-200/50 hover:bg-blue-50 hover:border-blue-300 disabled:opacity-50"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <Button
              variant="outline"
              onClick={onCurrentMonthClick}
              disabled={isCurrentMonth}
              className="rounded-xl border-blue-200/50 hover:bg-blue-50 hover:border-blue-300 px-4 h-10"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Current Month
            </Button>
          </div>

          {/* Summary Cards - All blue variants */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-linear-to-r from-blue-50/50 to-cyan-50/50 border border-blue-200/50 rounded-2xl p-6">
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

            <div className="bg-linear-to-r from-blue-100/50 to-cyan-100/50 border border-blue-200/50 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Total {title.split(" ")[1]}
                  </p>
                  <p className="text-2xl font-bold text-slate-900 mt-2">
                    {itemCount}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-linear-to-r from-sky-50/50 to-blue-50/50 border border-sky-200/50 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" /> Average
                  </p>
                  <p className="text-2xl font-bold text-slate-900 mt-2">
                    ${averageAmount.toFixed(2)}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-sky-500 to-blue-500 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-linear-to-r from-indigo-50/50 to-blue-50/50 border border-indigo-200/50 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 flex items-center gap-2">
                    <Target className="w-4 h-4" /> Highest
                  </p>
                  <p className="text-2xl font-bold text-slate-900 mt-2">
                    ${highestAmount.toFixed(2)}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-indigo-500 to-blue-500 flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Data List */}
          {data.length === 0 ? (
            renderEmptyState()
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  {title} ({itemCount} total)
                </h4>
                {showPagination && (
                  <Badge className="bg-linear-to-r from-blue-100 to-cyan-100 text-blue-700 border-blue-200/50">
                    Page {currentPage} of {totalPages}
                  </Badge>
                )}
              </div>

              <div className="space-y-3">{data.map(renderItem)}</div>

              {/* Pagination Controls */}
              {showPagination &&
                totalPages > 1 &&
                onPreviousPage &&
                onNextPage &&
                onPageChange && (
                  <div className="flex justify-between items-center pt-4 border-t border-slate-200/50">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onPreviousPage}
                      disabled={currentPage === 1}
                      className="rounded-lg border-blue-200/50 hover:bg-blue-50/50 hover:border-blue-300/50 gap-1"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>

                    <div className="flex items-center gap-2">
                      {Array.from(
                        { length: Math.min(5, totalPages) },
                        (_, i) => {
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
                              variant={
                                currentPage === pageNum ? "default" : "outline"
                              }
                              size="sm"
                              onClick={() => onPageChange(pageNum)}
                              className={`min-w-9 h-9 rounded-lg ${
                                currentPage === pageNum
                                  ? "bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0"
                                  : "border-blue-200/50 hover:bg-blue-50/50 hover:border-blue-300/50"
                              }`}
                            >
                              {pageNum}
                            </Button>
                          );
                        }
                      )}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onNextPage}
                      disabled={currentPage === totalPages}
                      className="rounded-lg border-blue-200/50 hover:bg-blue-50/50 hover:border-blue-300/50 gap-1"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
            </div>
          )}
        </CardContent>
      </div>
    </div>
  );
}

// ✅ FIXED: Updated DataItemRenderer to accept 'action' prop
export function DataItemRenderer<
  T extends {
    amount: number;
    currency: string;
    occurredAt?: string | Date;
    receivedAt?: string | Date;
    note?: string | null;
    categoryName?: string | null;
    source?: string;
  },
>({
  item,
  type,
  onEdit,
  action, // Destructure action prop
}: {
  item: T;
  type: "expense" | "income";
  onEdit?: (item: T) => void;
  action?: ReactNode; // Add type definition
}) {
  const dateField = type === "expense" ? "occurredAt" : "receivedAt";
  const date = new Date(item[dateField] as string | Date);
  const amount = item.amount || 0;

  // Both expense and income use blue theme
  const getItemTheme = () => {
    return {
      background: "bg-linear-to-br from-blue-100 to-cyan-100",
      text: "text-blue-700",
      badge:
        "bg-linear-to-r from-blue-100 to-cyan-100 text-blue-700 border-blue-200/50",
    };
  };

  const theme = getItemTheme();

  return (
    <div className="bg-white border border-slate-200/50 rounded-xl p-4 hover:shadow-lg hover:border-blue-200/50 transition-all duration-300 group">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-start gap-4">
            {/* Amount Circle */}
            <div className="shrink-0">
              <div
                className={`w-14 h-14 rounded-xl ${theme.background} flex items-center justify-center`}
              >
                <span className={`font-bold text-lg ${theme.text}`}>
                  ${amount.toFixed(2).split(".")[0]}
                </span>
              </div>
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <p className="font-semibold text-slate-900 truncate">
                  ${amount.toFixed(2)}
                  <span className="text-sm font-normal text-slate-500 ml-2">
                    {item.currency}
                  </span>
                </p>

                {item.source && type === "income" && (
                  <Badge className={theme.badge}>{item.source}</Badge>
                )}

                <Badge className="bg-linear-to-r from-slate-100 to-slate-50 text-slate-700 border-slate-200/50">
                  <Calendar className="w-3 h-3 mr-1" />
                  {date.toLocaleDateString("en-US", {
                    day: "numeric",
                    weekday: "short",
                  })}
                </Badge>

                <span className="text-xs text-slate-500">
                  {date.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-slate-600">
                  {date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>

                {item.categoryName && (
                  <Badge className="bg-linear-to-r from-sky-100 to-blue-100 text-sky-700 border-sky-200/50">
                    <Tag className="h-3 w-3 mr-1" />
                    {item.categoryName}
                  </Badge>
                )}
              </div>

              {item.note && (
                <p className="text-sm text-slate-700 p-3 bg-linear-to-r from-slate-50/50 to-white rounded-lg border border-slate-200/30">
                  {item.note}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ✅ FIXED: Render Action or onEdit button */}
        <div className="ml-2 flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {action ? (
            action
          ) : onEdit ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(item)}
              className="w-8 h-8 rounded-lg border border-transparent hover:border-blue-200/50 hover:bg-blue-50/50 transition-all duration-300"
            >
              <Pencil className="h-4 w-4 text-slate-400 hover:text-blue-600" />
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function EmptyStateRenderer({
  type,
  isCurrentMonth,
}: {
  type: "expense" | "income";
  isCurrentMonth: boolean;
}) {
  const title = type === "expense" ? "expenses" : "incomes";
  const actionText =
    type === "expense" ? "Add Your First Expense" : "Add Your First Income";

  return (
    <div className="bg-linear-to-r from-slate-50/50 to-white border border-slate-200/50 rounded-2xl p-12 text-center">
      <div className="w-20 h-20 rounded-full bg-linear-to-br from-blue-100 to-cyan-100 flex items-center justify-center mx-auto mb-6">
        <Calendar className="w-10 h-10 text-blue-500" />
      </div>
      <h3 className="text-lg font-semibold text-slate-700 mb-2">
        No {title} found for this month
      </h3>
      <p className="text-slate-500 max-w-md mx-auto mb-6">
        {isCurrentMonth
          ? `Start tracking your ${title} by adding your first transaction this month!`
          : `No ${title} were recorded for this month`}
      </p>
      <Button className="rounded-full bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white">
        {actionText}
      </Button>
    </div>
  );
}
