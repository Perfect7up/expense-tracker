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
  if (!data || !Array.isArray(data)) {
    return (
      <Card className="relative overflow-hidden bg-white/80 backdrop-blur-sm border border-slate-200/50 shadow-xl rounded-3xl lg:rounded-[2rem] w-full">
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-100/20  blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-cyan-100/20 blur-3xl" />
        <CardHeader className="relative z-10 p-4 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-blue-500/20 shrink-0">
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900">
                Expense by Category
              </CardTitle>
              <CardDescription className="text-slate-500 text-xs sm:text-sm">
                Breakdown of your spending across categories
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="relative z-10 p-4 sm:p-6">
          <div className="text-center py-8 sm:py-12">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
            </div>
            <p className="text-slate-500 text-sm sm:text-base">No expense data available</p>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
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
    <Card className="relative overflow-hidden bg-white/80 backdrop-blur-sm border border-slate-200/50 transition-all duration-300 w-full rounded-2xl lg:rounded-3xl">
      {/* Background gradient accents */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-100/20 rounded-full blur-3xl group-hover:bg-blue-100/30 transition-all duration-500" />
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-cyan-100/20 rounded-full blur-3xl group-hover:bg-cyan-100/30 transition-all duration-500" />

      <CardHeader className="relative z-10 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900">
                Expense by Category
              </CardTitle>
              <CardDescription className="text-slate-500 text-xs sm:text-sm">
                Breakdown of your spending across categories
              </CardDescription>
            </div>
          </div>
          
          {data.length > 0 && (
            <div className="self-start sm:self-auto inline-flex items-center gap-1.5 sm:gap-2 bg-blue-50 text-blue-600 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium">
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>{sortedData.length} Categories</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="relative z-10 p-4 sm:p-6 space-y-4 sm:space-y-6">
        {data.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <ShoppingBag className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
            </div>
            <p className="text-slate-500 text-sm sm:text-base">No expense data available</p>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Start adding expenses to see your breakdown
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
              {topCategories.map((cat) => {
                const percentage = calculatePercentage(cat.total || 0, total);
                const Icon = getCategoryIcon(cat.categoryName || "Other");
                const colorClass = getCategoryColor(cat.categoryName || "Other");

                return (
                  <div
                    key={cat.categoryId || cat.categoryName}
                    className="bg-gradient-to-br from-white to-blue-50/30 rounded-xl p-3 sm:p-4 border border-slate-200/50 hover:border-blue-200 transition-all duration-300 hover:shadow-md group/category"
                  >
                    <div className="flex flex-col items-center text-center space-y-2 sm:space-y-3">
                      <div
                        className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br ${colorClass} flex items-center justify-center shadow-md shrink-0`}
                      >
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                      </div>
                      <div className="w-full">
                        <p 
                          className="font-semibold text-slate-900 text-xs sm:text-sm line-clamp-1 truncate" 
                          title={cat.categoryName}
                        >
                          {cat.categoryName || "Other"}
                        </p>
                        <p className="text-base sm:text-lg lg:text-2xl font-bold text-slate-900 mt-1 truncate">
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
                            className={`h-1.5 rounded-full transition-all duration-500 bg-gradient-to-r ${colorClass}`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Detailed List */}
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900 text-sm sm:text-base">All Categories</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-full text-xs sm:text-sm h-8 sm:h-9"
                >
                  View All
                  <ChevronRight className="ml-1 w-3 h-3 sm:w-3 sm:h-3" />
                </Button>
              </div>

              <div className="space-y-2 sm:space-y-3 max-h-64 sm:max-h-72 overflow-y-auto pr-1 sm:pr-2">
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
                        className={`w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-lg bg-gradient-to-br ${colorClass} flex items-center justify-center shrink-0`}
                      >
                        <Icon className="w-4 h-4 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-white" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-slate-900 text-sm truncate pr-2" title={cat.categoryName}>
                            {cat.categoryName || "Other"}
                          </span>
                          <span className="font-bold text-slate-900 text-sm whitespace-nowrap shrink-0 ml-2">
                            {formatCurrency(cat.total || 0)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="flex-1 bg-slate-200/50 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-2 rounded-full transition-all duration-500 group-hover/item:scale-y-110 bg-gradient-to-r ${colorClass}`}
                              style={{ width: `${Math.min(percentage, 100)}%` }}
                            />
                          </div>
                          <span className="text-xs font-semibold text-blue-600 min-w-8 sm:min-w-10 text-right">
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
            <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-3 sm:pt-4 border-t border-slate-200/50">
              <div className="text-center">
                <p className="text-xs text-slate-500 mb-1">Top Category</p>
                <p className="font-semibold text-slate-900 text-sm truncate px-1" title={sortedData[0]?.categoryName}>
                  {sortedData[0]?.categoryName || "-"}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-500 mb-1">Average</p>
                <p className="font-semibold text-slate-900 text-sm">
                  {formatCurrency(data.length > 0 ? total / data.length : 0)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-500 mb-1">Total Spent</p>
                <p className="font-semibold text-slate-900 text-sm">
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