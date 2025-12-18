"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/core/components/ui/card";
import {
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  Wallet,
  Target,
  ChevronRight,
} from "lucide-react";
import { formatCurrency, formatDate } from "../utils/utils";
import { Button } from "@/app/core/components/ui/button";

interface CashflowAnalysisProps {
  data: {
    from?: string;
    to?: string;
    totalIncome: number;
    totalExpense: number;
    net: number;
    trend?: number;
    previousPeriodNet?: number;
  } | null;
}

export function CashflowAnalysis({ data }: CashflowAnalysisProps) {
  const netPositive = (data?.net || 0) >= 0;
  const trend = data?.trend || 0;
  const trendPositive = trend >= 0;

  return (
    <Card className="relative overflow-hidden bg-white/80 backdrop-blur-sm border border-slate-200/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 w-full">
      {/* Background linear accents */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-100/20 rounded-full blur-3xl group-hover:bg-blue-100/30 transition-all duration-500" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-cyan-100/20 rounded-full blur-3xl group-hover:bg-cyan-100/30 transition-all duration-500" />

      <CardHeader className="relative z-10 pb-4">
        {/* RESPONSIVE: Stack vertically on mobile (flex-col), row on tablet/desktop (sm:flex-row) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <CardTitle className="text-xl sm:text-2xl font-bold text-slate-900">
                Cash Flow Analysis
              </CardTitle>
            </div>
            <CardDescription className="flex items-center gap-2 text-slate-500 text-sm">
              <Calendar className="w-4 h-4 shrink-0" />
              <span className="truncate">
                {data?.from && data?.to
                  ? `${formatDate(data.from)} - ${formatDate(data.to)}`
                  : "All-time overview"}
              </span>
            </CardDescription>
          </div>
          
          {trend !== 0 && (
            <div
              // RESPONSIVE: Self-start on mobile to align left, auto on desktop
              className={`self-start sm:self-auto inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium ${
                trendPositive
                  ? "bg-green-50 text-green-600"
                  : "bg-red-50 text-red-600"
              }`}
            >
              {trendPositive ? (
                <ArrowUpRight className="w-4 h-4" />
              ) : (
                <ArrowDownRight className="w-4 h-4" />
              )}
              <span>{Math.abs(trend)}%</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="relative z-10 space-y-6">
        {/* Summary cards grid */}
        {/* RESPONSIVE: 1 col on mobile, 3 cols on large screens */}
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
          
          {/* INCOME CARD */}
          <div className="bg-linear-to-br from-blue-50 to-cyan-50/50 rounded-xl p-5 border border-blue-100/50 hover:border-blue-200 transition-all duration-300 group/card">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-lg bg-linear-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-md shadow-green-500/20 shrink-0">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              {data?.previousPeriodNet && (
                <div className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full whitespace-nowrap ml-2">
                  +{formatCurrency(data.totalIncome - data.previousPeriodNet)}
                </div>
              )}
            </div>
            <p className="text-sm text-slate-500 mb-1">Total Income</p>
            <p className="text-2xl font-bold text-slate-900 truncate">
              {formatCurrency(data?.totalIncome || 0)}
            </p>
            <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
              <div className="w-full bg-slate-200 rounded-full h-1.5">
                <div
                  className="bg-linear-to-r from-green-400 to-emerald-500 h-full rounded-full"
                  style={{
                    width: `${
                      data?.totalIncome && data?.totalExpense
                        ? Math.min(
                            (data.totalIncome / (data.totalIncome + data.totalExpense)) *
                              100,
                            100
                          )
                        : 50
                    }%`,
                  }}
                />
              </div>
              <span>Income</span>
            </div>
          </div>

          {/* EXPENSES CARD */}
          <div className="bg-linear-to-br from-blue-50 to-cyan-50/50 rounded-xl p-5 border border-blue-100/50 hover:border-blue-200 transition-all duration-300 group/card">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-lg bg-linear-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-md shadow-orange-500/20 shrink-0">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              {data?.previousPeriodNet && (
                <div className="text-xs text-red-600 font-medium bg-red-50 px-2 py-1 rounded-full whitespace-nowrap ml-2">
                  -{formatCurrency(data.totalExpense - data.previousPeriodNet)}
                </div>
              )}
            </div>
            <p className="text-sm text-slate-500 mb-1">Total Expenses</p>
            <p className="text-2xl font-bold text-slate-900 truncate">
              {formatCurrency(data?.totalExpense || 0)}
            </p>
            <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
              <div className="w-full bg-slate-200 rounded-full h-1.5">
                <div
                  className="bg-linear-to-r from-orange-400 to-red-500 h-full rounded-full"
                  style={{
                    width: `${
                      data?.totalIncome && data?.totalExpense
                        ? Math.min(
                            (data.totalExpense / (data.totalIncome + data.totalExpense)) *
                              100,
                            100
                          )
                        : 50
                    }%`,
                  }}
                />
              </div>
              <span>Expenses</span>
            </div>
          </div>

          {/* NET CASH FLOW CARD */}
          <div
            className={`rounded-xl p-5 border transition-all duration-300 group/card ${
              netPositive
                ? "bg-linear-to-br from-green-50 to-emerald-50/50 border-green-100/50 hover:border-green-200"
                : "bg-linear-to-br from-red-50 to-orange-50/50 border-red-100/50 hover:border-red-200"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center shadow-md shrink-0 ${
                  netPositive
                    ? "bg-linear-to-br from-green-400 to-emerald-500 shadow-green-500/20"
                    : "bg-linear-to-br from-red-400 to-orange-500 shadow-red-500/20"
                }`}
              >
                <Target className="w-6 h-6 text-white" />
              </div>
              <div
                className={`text-xs font-medium px-2 py-1 rounded-full ${
                  netPositive
                    ? "text-green-600 bg-green-50"
                    : "text-red-600 bg-red-50"
                }`}
              >
                {netPositive ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
              </div>
            </div>
            <p className="text-sm text-slate-500 mb-1">Net Cash Flow</p>
            <p
              className={`text-2xl font-bold truncate ${
                netPositive ? "text-green-600" : "text-red-600"
              }`}
            >
              {formatCurrency(data?.net || 0)}
            </p>
            <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
              <div className="w-full bg-slate-200 rounded-full h-1.5">
                <div
                  className={`h-full rounded-full ${
                    netPositive
                      ? "bg-linear-to-r from-green-400 to-emerald-500"
                      : "bg-linear-to-r from-red-400 to-orange-500"
                  }`}
                  style={{
                    width: `${Math.min(Math.abs(data?.net || 0) / 5000 * 100, 100)}%`,
                  }}
                />
              </div>
              <span>{netPositive ? "Profit" : "Loss"}</span>
            </div>
          </div>
        </div>

        {/* Insights & Action Section */}
        <div className="bg-linear-to-r from-blue-50/50 to-cyan-50/30 rounded-xl p-4 border border-blue-100/50">
          {/* RESPONSIVE: Stack on mobile, row on tablet */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-linear-to-br from-blue-400 to-cyan-500 flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-slate-900">Financial Insight</p>
                <p className="text-sm text-slate-500">
                  {netPositive
                    ? `You've saved ${formatCurrency(data?.net || 0)} this period`
                    : `Consider reducing expenses by ${formatCurrency(Math.abs(data?.net || 0))}`}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              // RESPONSIVE: Full width button on mobile for better touch target
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-full w-full sm:w-auto mt-2 sm:mt-0"
            >
              View Details
              <ChevronRight className="ml-1 w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        {/* RESPONSIVE: grid-cols-2 is usually fine on mobile, but added gap control */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/50 rounded-lg p-3 border border-slate-200/50">
            <p className="text-xs text-slate-500">Savings Rate</p>
            <p className="text-lg font-semibold text-slate-900">
              {data?.totalIncome
                ? `${Math.max(0, ((data.net || 0) / data.totalIncome) * 100).toFixed(1)}%`
                : "0%"}
            </p>
          </div>
          <div className="bg-white/50 rounded-lg p-3 border border-slate-200/50">
            <p className="text-xs text-slate-500">Expense Ratio</p>
            <p className="text-lg font-semibold text-slate-900">
              {data?.totalIncome
                ? `${((data.totalExpense || 0) / data.totalIncome * 100).toFixed(1)}%`
                : "0%"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}