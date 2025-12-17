"use client";

import { ReactNode } from "react";
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
  Loader2,
} from "lucide-react";

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

  const getTypeColor = () => {
    return "from-blue-500 to-cyan-500";
  };

  if (isLoading) {
    return (
       <div className="flex flex-col items-center justify-center py-20 text-slate-400">
         <Loader2 className="w-10 h-10 animate-spin mb-4 text-blue-500" />
         <p>Loading data...</p>
       </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12 sm:py-16 px-4">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-red-100 to-pink-100 flex items-center justify-center mx-auto mb-4">
          <BarChart3 className="w-8 h-8 sm:w-10 sm:h-10 text-red-500" />
        </div>
        <p className="text-base sm:text-lg font-semibold text-red-600">
          Failed to load {title.toLowerCase()}
        </p>
        <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-md mx-auto">
          {error?.message ||
            `There was an error loading your ${title.toLowerCase()}. Please try again.`}
        </p>
        <Button
          className="mt-4 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
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
        <div className="absolute top-1/4 left-1/4 w-32 sm:w-48 h-32 sm:h-48 bg-blue-100/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-32 sm:w-48 h-32 sm:h-48 bg-cyan-100/10 rounded-full blur-3xl" />
      </div>

      <div className="bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-xl sm:rounded-2xl shadow-xl overflow-hidden">
        {/* Header - Always blue theme */}
        <div className={`relative bg-gradient-to-r ${getTypeColor()} p-4 sm:p-6`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 blur-2xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12 blur-2xl" />

          <CardHeader className="relative z-10 p-0">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 shrink-0">
                  {icon}
                </div>
                <div>
                  <CardTitle className="text-xl sm:text-2xl font-bold text-white">
                    {title}
                  </CardTitle>
                  <p className="text-xs sm:text-sm text-blue-100/80">{description}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 w-full md:w-auto">
  <div className="flex justify-center w-full">
    {addButton}
  </div>
  <div className="flex justify-center w-full">
    <Button
      onClick={onExport}
      disabled={data.length === 0}
      className="w-full sm:w-auto rounded-xl bg-white/20 backdrop-blur-sm hover:bg-white/30 border border-white/30 text-white gap-2 px-4 h-10 sm:h-12 transition-all duration-300 group whitespace-nowrap text-sm"
    >
      <Download className="h-4 w-4" />
      <span className="hidden sm:inline">Export Month</span>
      <span className="sm:hidden">Export</span>
      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
    </Button>
  </div>
</div>
            </div>
          </CardHeader>
        </div>

        <CardContent className="p-3 sm:p-6 space-y-4 sm:space-y-6">
          {/* Month Navigation */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gradient-to-r from-blue-50/50 to-cyan-50/50 rounded-xl border border-blue-100/30">
            <div className="flex items-center justify-between w-full md:w-auto gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPreviousMonth}
                className="rounded-lg w-9 h-9 sm:w-10 sm:h-10 border-blue-200/50 hover:bg-blue-50 hover:border-blue-300 -mr-2.5"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="text-center min-w-[140px]">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                  {currentMonth.toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </h3>
                {!isCurrentMonth ? (
                  <Badge className="mt-0.5 sm:mt-1 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border-blue-200/50 text-[10px] sm:text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    Viewing past
                  </Badge>
                ) : (
                  <Badge className="mt-0.5 sm:mt-1 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border-blue-200/50 text-[10px] sm:text-xs">
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
                className="rounded-lg w-9 h-9 sm:w-10 sm:h-10 border-blue-200/50 hover:bg-blue-50 hover:border-blue-300 disabled:opacity-50 -ml-2.5"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <Button
              variant="outline"
              onClick={onCurrentMonthClick}
              disabled={isCurrentMonth}
              className="w-full md:w-auto rounded-xl border-blue-200/50 hover:bg-blue-50 hover:border-blue-300 px-4 h-9 sm:h-10 text-sm"
            >
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
              Current Month
            </Button>
          </div>

          {/* Summary Cards - Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-gradient-to-r from-blue-50/50 to-cyan-50/50 border border-blue-200/50 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-slate-600 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" /> Total Amount
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 sm:mt-2">
                    ${totalAmount.toFixed(2)}
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-100/50 to-cyan-100/50 border border-blue-200/50 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-slate-600 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Total Items
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 sm:mt-2">
                    {itemCount}
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-sky-50/50 to-blue-50/50 border border-sky-200/50 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-slate-600 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" /> Average
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 sm:mt-2">
                    ${averageAmount.toFixed(2)}
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-sky-500 to-blue-500 flex items-center justify-center shadow-lg shadow-sky-500/20">
                  <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-indigo-50/50 to-blue-50/50 border border-indigo-200/50 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-slate-600 flex items-center gap-2">
                    <Target className="w-4 h-4" /> Highest
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 sm:mt-2">
                    ${highestAmount.toFixed(2)}
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                  <Target className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Data List */}
          {data.length === 0 ? (
            renderEmptyState()
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1 sm:px-2">
                <h4 className="font-semibold text-slate-900 flex items-center gap-2 text-sm sm:text-base">
                  <FileText className="w-4 h-4" />
                  {title} ({itemCount} total)
                </h4>
                {showPagination && (
                  <Badge className="bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border-blue-200/50 text-[10px] sm:text-xs">
                    Page {currentPage} of {totalPages}
                  </Badge>
                )}
              </div>

              <div className="grid gap-3">{data.map(renderItem)}</div>

              {/* Pagination Controls - Justify Center */}
              {showPagination &&
                totalPages > 1 &&
                onPreviousPage &&
                onNextPage &&
                onPageChange && (
                  <div className="flex justify-center items-center pt-4 border-t border-slate-200/50 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onPreviousPage}
                      disabled={currentPage === 1}
                      className="rounded-lg border-blue-200/50 hover:bg-blue-50/50 hover:border-blue-300/50 gap-1 px-3 sm:px-4"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span className="hidden sm:inline">Previous</span>
                    </Button>

                    <div className="flex items-center gap-1 sm:gap-2">
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
                              className={`w-8 h-8 sm:min-w-9 sm:h-9 p-0 sm:px-3 rounded-lg text-xs sm:text-sm  ${
                                currentPage === pageNum
                                  ? "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0"
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
                      className="rounded-lg border-blue-200/50 hover:bg-blue-50/50 hover:border-blue-300/50 gap-1 px-3 sm:px-4"
                    >
                      <span className="hidden sm:inline">Next</span>
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

// Data Item Renderer with better mobile responsiveness
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
  action, 
}: {
  item: T;
  type: "expense" | "income";
  onEdit?: (item: T) => void;
  action?: ReactNode; 
}) {
  const dateField = type === "expense" ? "occurredAt" : "receivedAt";
  const date = new Date(item[dateField] as string | Date);
  const amount = item.amount || 0;

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
    <div className="bg-white border border-slate-200/50 rounded-xl p-3 sm:p-4 hover:shadow-lg hover:border-blue-200/50 transition-all duration-300 group">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-start gap-3 sm:gap-4">
            {/* Amount Circle */}
            <div className="shrink-0">
              <div
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl ${theme.background} flex items-center justify-center`}
              >
                <span className={`font-bold text-base sm:text-lg ${theme.text}`}>
                  ${amount.toFixed(0)}
                </span>
              </div>
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1.5 sm:mb-2">
                <p className="font-semibold text-slate-900 truncate text-sm sm:text-base">
                  ${amount.toFixed(2)}
                  <span className="text-xs sm:text-sm font-normal text-slate-500 ml-1.5">
                    {item.currency}
                  </span>
                </p>

                {item.source && type === "income" && (
                  <Badge className={theme.badge + " text-[10px] sm:text-xs"}>{item.source}</Badge>
                )}

                <Badge className="bg-gradient-to-r from-slate-100 to-slate-50 text-slate-700 border-slate-200/50 text-[10px] sm:text-xs">
                  <Calendar className="w-3 h-3 mr-1" />
                  {date.toLocaleDateString("en-US", {
                    day: "numeric",
                    weekday: "short",
                  })}
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-xs text-slate-600 hidden sm:inline">
                  {date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>

                {item.categoryName && (
                  <Badge className="bg-gradient-to-r from-sky-100 to-blue-100 text-sky-700 border-sky-200/50 text-[10px] sm:text-xs">
                    <Tag className="h-3 w-3 mr-1" />
                    {item.categoryName}
                  </Badge>
                )}
                
                <span className="text-xs text-slate-400 sm:hidden">
                  {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {item.note && (
                <p className="text-xs sm:text-sm text-slate-700 p-2 sm:p-3 bg-gradient-to-r from-slate-50/50 to-white rounded-lg border border-slate-200/30">
                  {item.note}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="ml-2 flex items-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
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
    <div className="bg-gradient-to-r from-slate-50/50 to-white border border-slate-200/50 rounded-2xl p-6 sm:p-12 text-center">
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center mx-auto mb-4 sm:mb-6">
        <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
      </div>
      <h3 className="text-base sm:text-lg font-semibold text-slate-700 mb-2">
        No {title} found for this month
      </h3>
      <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
        {isCurrentMonth
          ? `Start tracking your ${title} by adding your first transaction this month!`
          : `No ${title} were recorded for this month`}
      </p>
      <Button className="w-full sm:w-auto rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white">
        {actionText}
      </Button>
    </div>
  );
}