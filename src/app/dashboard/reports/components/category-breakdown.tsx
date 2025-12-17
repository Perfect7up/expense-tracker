"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/core/components/ui/card";
import { formatCurrency, calculatePercentage } from "../utils/utils";
import type { CategoryData } from "../hooks/use-reports-data";
import {
  ShoppingBag,
  Home,
  Car,
  Utensils,
  Heart,
  GraduationCap,
  Plane,
  Music,
  MoreHorizontal,
  ChevronRight,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/app/core/components/ui/button";

interface CategoryBreakdownProps {
  data: CategoryData[] | null | undefined;
}

// Icon mapping for categories
const CATEGORY_ICONS: Record<string, React.ElementType> = {
  food: Utensils,
  dining: Utensils,
  restaurant: Utensils,
  shopping: ShoppingBag,
  retail: ShoppingBag,
  housing: Home,
  rent: Home,
  mortgage: Home,
  transportation: Car,
  travel: Plane,
  healthcare: Heart,
  medical: Heart,
  education: GraduationCap,
  entertainment: Music,
  leisure: Music,
};

const CATEGORY_COLORS: Record<string, string> = {
  food: "from-orange-400 to-amber-500",
  dining: "from-orange-400 to-amber-500",
  restaurant: "from-orange-400 to-amber-500",
  shopping: "from-pink-400 to-rose-500",
  retail: "from-pink-400 to-rose-500",
  housing: "from-blue-400 to-cyan-500",
  rent: "from-blue-400 to-cyan-500",
  mortgage: "from-blue-400 to-cyan-500",
  transportation: "from-purple-400 to-violet-500",
  travel: "from-sky-400 to-blue-500",
  healthcare: "from-red-400 to-pink-500",
  medical: "from-red-400 to-pink-500",
  education: "from-emerald-400 to-green-500",
  entertainment: "from-indigo-400 to-purple-500",
  leisure: "from-indigo-400 to-purple-500",
};

export function CategoryBreakdown({ data }: CategoryBreakdownProps) {
  // Handle null/undefined or invalid data
  if (!data || !Array.isArray(data)) {
    return (
      <Card className="relative overflow-hidden bg-white/80 backdrop-blur-sm border border-slate-200/50 shadow-xl rounded-2xl w-full">
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-100/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-cyan-100/20 rounded-full blur-3xl" />
        <CardHeader className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl sm:text-2xl font-bold text-slate-900">
                Expense by Category
              </CardTitle>
              <CardDescription className="text-slate-500">
                Breakdown of your spending across categories
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-linear-to-br from-blue-100 to-cyan-100 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-blue-400" />
            </div>
            <p className="text-slate-500">No expense data available</p>
            <p className="text-sm text-slate-400 mt-1">
              Data is not in the expected format
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const total = data.reduce((sum, cat) => sum + (cat.total || 0), 0);
  const sortedData = [...data].sort((a, b) => (b.total || 0) - (a.total || 0));
  const topCategories = sortedData.slice(0, 5);

  const getCategoryIcon = (categoryName: string) => {
    const normalizedName = categoryName?.toLowerCase() || "";
    for (const [key, Icon] of Object.entries(CATEGORY_ICONS)) {
      if (normalizedName.includes(key)) {
        return Icon;
      }
    }
    return MoreHorizontal;
  };

  const getCategoryColor = (categoryName: string) => {
    const normalizedName = categoryName?.toLowerCase() || "";
    for (const [key, color] of Object.entries(CATEGORY_COLORS)) {
      if (normalizedName.includes(key)) {
        return color;
      }
    }
    return "from-blue-400 to-cyan-500";
  };

  return (
    <Card className="relative overflow-hidden bg-white/80 backdrop-blur-sm border border-slate-200/50 shadow-xl rounded-2xl group hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 w-full">
      {/* Background linear accents */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-100/20 rounded-full blur-3xl group-hover:bg-blue-100/30 transition-all duration-500" />
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-cyan-100/20 rounded-full blur-3xl group-hover:bg-cyan-100/30 transition-all duration-500" />

      <CardHeader className="relative z-10">
        {/* RESPONSIVE: Stack vertically on mobile, row on tablet+ */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl sm:text-2xl font-bold text-slate-900">
                Expense by Category
              </CardTitle>
              <CardDescription className="text-slate-500 text-sm">
                Breakdown of your spending across categories
              </CardDescription>
            </div>
          </div>
          
          {data.length > 0 && (
            <div className="self-start sm:self-auto inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full text-sm font-medium">
              <TrendingUp className="w-4 h-4" />
              <span>{sortedData.length} Categories</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="relative z-10 space-y-6">
        {data.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-linear-to-br from-blue-100 to-cyan-100 flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-8 h-8 text-blue-400" />
            </div>
            <p className="text-slate-500">No expense data available</p>
            <p className="text-sm text-slate-400 mt-1">
              Start adding expenses to see your breakdown
            </p>
          </div>
        ) : (
          <>
            {/* Top Categories Grid */}
            {/* RESPONSIVE: 2 cols mobile, 3 cols tablet, 5 cols desktop */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
              {topCategories.map((cat) => {
                const percentage = calculatePercentage(cat.total || 0, total);
                const Icon = getCategoryIcon(cat.categoryName || "Other");
                const colorClass = getCategoryColor(cat.categoryName || "Other");

                return (
                  <div
                    key={cat.categoryId || cat.categoryName}
                    className="bg-linear-to-br from-white to-blue-50/30 rounded-xl p-3 sm:p-4 border border-slate-200/50 hover:border-blue-200 transition-all duration-300 hover:shadow-md group/category"
                  >
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div
                        className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-linear-to-br ${colorClass} flex items-center justify-center shadow-md shrink-0`}
                      >
                        <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                      </div>
                      <div className="w-full">
                        <p className="font-semibold text-slate-900 text-xs sm:text-sm line-clamp-1" title={cat.categoryName}>
                          {cat.categoryName || "Other"}
                        </p>
                        <p className="text-lg sm:text-2xl font-bold text-slate-900 mt-1 truncate">
                          {formatCurrency(cat.total || 0)}
                        </p>
                      </div>
                      <div className="w-full">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[10px] sm:text-xs text-slate-500">Share</span>
                          <span className="text-[10px] sm:text-xs font-semibold text-blue-600">
                            {percentage.toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-200/50 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full transition-all duration-500 bg-linear-to-r ${colorClass}`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Detailed List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900">All Categories</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-full text-xs"
                >
                  View All
                  <ChevronRight className="ml-1 w-3 h-3" />
                </Button>
              </div>

              <div className="space-y-3">
                {sortedData.map((cat) => {
                  const percentage = calculatePercentage(cat.total || 0, total);
                  const Icon = getCategoryIcon(cat.categoryName || "Other");
                  const colorClass = getCategoryColor(cat.categoryName || "Other");

                  return (
                    <div
                      key={cat.categoryId || cat.categoryName}
                      className="flex items-center gap-3 sm:gap-4 p-3 rounded-lg hover:bg-blue-50/30 transition-all duration-200 group/item"
                    >
                      <div
                        className={`w-10 h-10 rounded-lg bg-linear-to-br ${colorClass} flex items-center justify-center shrink-0`}
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      
                      {/* Flex-1 ensures this section takes remaining space */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-slate-900 text-sm truncate pr-2">
                            {cat.categoryName || "Other"}
                          </span>
                          <span className="font-bold text-slate-900 text-sm whitespace-nowrap">
                            {formatCurrency(cat.total || 0)}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-slate-200/50 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-2 rounded-full transition-all duration-500 group-hover/item:scale-y-110 bg-linear-to-r ${colorClass}`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-xs font-semibold text-blue-600 mmin-w-10 text-right">
                            {percentage.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Summary Stats */}
            {/* RESPONSIVE: Stacked (1 col) on mobile, 3 cols on tablet+ */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-4 pt-4 border-t border-slate-200/50 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
              <div className="text-center pb-2 sm:pb-0">
                <p className="text-xs text-slate-500 mb-1">Top Category</p>
                <p className="font-semibold text-slate-900 truncate px-2">
                  {sortedData[0]?.categoryName || "-"}
                </p>
              </div>
              <div className="text-center py-2 sm:py-0">
                <p className="text-xs text-slate-500 mb-1">Average</p>
                <p className="font-semibold text-slate-900">
                  {formatCurrency(data.length > 0 ? total / data.length : 0)}
                </p>
              </div>
              <div className="text-center pt-2 sm:pt-0">
                <p className="text-xs text-slate-500 mb-1">Total Spent</p>
                <p className="font-semibold text-slate-900">
                  {formatCurrency(total)}
                </p>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}