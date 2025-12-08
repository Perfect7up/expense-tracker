"use client";

import { memo, useMemo } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/app/core/components/ui/card";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Target,
  AlertCircle,
  Sparkles,
  TrendingUp as ArrowUp,
  TrendingDown as ArrowDown,
} from "lucide-react";
import { Skeleton } from "@/app/core/components/ui/skeleton";
import { useKpi } from "../store/kpi-store";
import { cn } from "@/app/core/lib/utils";

const KPI_CARDS = [
  {
    title: "Total Income",
    color: "green",
    gradient: "from-emerald-400 to-teal-500",
    bgGradient: "from-emerald-50 to-teal-50",
    icon: <TrendingUp className="h-5 w-5 text-emerald-600" />,
  },
  {
    title: "Total Expenses",
    color: "red",
    gradient: "from-rose-400 to-pink-500",
    bgGradient: "from-rose-50 to-pink-50",
    icon: <TrendingDown className="h-5 w-5 text-rose-600" />,
  },
  {
    title: "Current Balance",
    color: "blue",
    gradient: "from-blue-400 to-cyan-500",
    bgGradient: "from-blue-50 to-cyan-50",
    icon: <Wallet className="h-5 w-5 text-blue-600" />,
  },
  {
    title: "Savings Rate",
    color: "purple",
    gradient: "from-violet-400 to-purple-500",
    bgGradient: "from-violet-50 to-purple-50",
    icon: <Target className="h-5 w-5 text-violet-600" />,
  },
];

function KpiCardComponent() {
  const { data, isLoading, error } = useKpi();

  const growthStats = useMemo(() => {
    if (!data || !data.monthlyTrends || data.monthlyTrends.length < 2)
      return { incomeGrowth: 0, expenseGrowth: 0 };

    const current = data.monthlyTrends.at(-1)!;
    const prev = data.monthlyTrends.at(-2)!;
    const calc = (c: number, p: number) =>
      p === 0 ? (c > 0 ? 100 : 0) : ((c - p) / p) * 100;

    return {
      incomeGrowth: calc(current.income, prev.income),
      expenseGrowth: calc(current.expense, prev.expense),
    };
  }, [data]);

  const cards = useMemo(() => {
    if (!data) return [];

    return KPI_CARDS.map((card, idx) => {
      let value: string | number = "";
      let extraInfo: React.ReactNode = null;
      let isPositive: boolean = true;

      switch (card.title) {
        case "Total Income":
          value = `$${data.totalIncome.toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}`;
          isPositive = growthStats.incomeGrowth >= 0;
          extraInfo = (
            <div className="flex items-center gap-1.5">
              {isPositive ? (
                <ArrowUp className="h-3 w-3 text-emerald-500" />
              ) : (
                <ArrowDown className="h-3 w-3 text-rose-500" />
              )}
              <span
                className={cn(
                  "text-xs font-semibold",
                  isPositive ? "text-emerald-600" : "text-rose-600"
                )}
              >
                {Math.abs(growthStats.incomeGrowth).toFixed(1)}%
              </span>
              <span className="text-xs text-slate-500">vs last month</span>
            </div>
          );
          break;

        case "Total Expenses":
          value = `$${data.totalExpense.toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}`;
          isPositive = growthStats.expenseGrowth <= 0; // Lower expenses are positive
          extraInfo = (
            <div className="flex items-center gap-1.5">
              {isPositive ? (
                <ArrowDown className="h-3 w-3 text-emerald-500" />
              ) : (
                <ArrowUp className="h-3 w-3 text-rose-500" />
              )}
              <span
                className={cn(
                  "text-xs font-semibold",
                  isPositive ? "text-emerald-600" : "text-rose-600"
                )}
              >
                {Math.abs(growthStats.expenseGrowth).toFixed(1)}%
              </span>
              <span className="text-xs text-slate-500">vs last month</span>
            </div>
          );
          break;

        case "Current Balance":
          value = `$${data.balance.toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}`;
          isPositive = data.balance >= 0;
          extraInfo = (
            <div className="flex items-center gap-1.5">
              {isPositive ? (
                <Sparkles className="h-3 w-3 text-emerald-500" />
              ) : (
                <AlertCircle className="h-3 w-3 text-amber-500" />
              )}
              <span
                className={cn(
                  "text-xs font-semibold",
                  isPositive ? "text-emerald-600" : "text-amber-600"
                )}
              >
                {isPositive ? "Healthy" : "Monitor"}
              </span>
            </div>
          );
          break;

        case "Savings Rate":
          value = `${data.savingsRate.toFixed(1)}%`;
          isPositive = data.savingsRate >= 20;
          extraInfo = (
            <div className="flex items-center gap-1.5">
              <div
                className={cn(
                  "h-2 w-8 rounded-full",
                  isPositive ? "bg-emerald-200" : "bg-rose-200"
                )}
              >
                <div
                  className={cn(
                    "h-full rounded-full",
                    isPositive
                      ? "bg-linear-to-r from-emerald-400 to-teal-500"
                      : "bg-linear-to-r from-rose-400 to-pink-500"
                  )}
                  style={{ width: `${Math.min(data.savingsRate, 100)}%` }}
                />
              </div>
              <span
                className={cn(
                  "text-xs font-semibold",
                  isPositive ? "text-emerald-600" : "text-rose-600"
                )}
              >
                {isPositive ? "On track" : "Below target"}
              </span>
            </div>
          );
          break;
      }

      return (
        <Card
          key={idx}
          className={cn(
            "relative group overflow-hidden border-slate-200/50",
            "bg-white/80 backdrop-blur-sm",
            "shadow-lg hover:shadow-xl transition-all duration-300",
            "hover:scale-[1.02] hover:border-slate-300/50",
            "animate-fade-in"
          )}
        >
          {/* Gradient accent line */}
          <div
            className={cn(
              "absolute top-0 left-0 w-full h-1 bg-linear-to-r",
              card.gradient
            )}
          />

          {/* Animated background effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute top-0 left-0 w-32 h-32 bg-linear-to-br from-white/20 to-transparent rounded-full blur-xl" />
          </div>

          <CardHeader className="flex flex-row justify-between items-start pb-3 relative z-10">
            <div className="space-y-1">
              <CardTitle className="text-sm font-semibold text-slate-600 tracking-wide">
                {card.title}
              </CardTitle>
              <div className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                {value}
              </div>
            </div>
            <div
              className={cn(
                "w-10 h-10 rounded-xl",
                "bg-linear-to-br shadow-sm",
                card.bgGradient,
                "flex items-center justify-center",
                "group-hover:scale-110 transition-transform duration-300"
              )}
            >
              {card.icon}
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            {extraInfo && <div className="mt-2">{extraInfo}</div>}
          </CardContent>
        </Card>
      );
    });
  }, [data, growthStats]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {KPI_CARDS.map((card, i) => (
          <Card
            key={i}
            className="relative overflow-hidden border-slate-200/50 bg-white/80 backdrop-blur-sm shadow-lg"
          >
            <div
              className={cn("absolute top-0 left-0 w-full h-1", "bg-slate-200")}
            />
            <CardHeader className="flex flex-row justify-between items-start pb-3">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-32" />
              </div>
              <Skeleton className="h-10 w-10 rounded-xl" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {KPI_CARDS.map((card, i) => (
          <Card
            key={i}
            className={cn(
              "relative overflow-hidden border-red-200/50",
              "bg-linear-to-br from-red-50/50 to-rose-50/30",
              "backdrop-blur-sm shadow-lg"
            )}
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-red-400 to-rose-500" />
            <CardHeader className="flex flex-row justify-between items-start pb-3">
              <div className="space-y-1">
                <CardTitle className="text-sm font-semibold text-red-700">
                  Unable to load
                </CardTitle>
                <div className="text-2xl font-bold text-red-900">--</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-red-100/50 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-red-600/70">Please try again later</p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards}
    </div>
  );
}

export const KpiCard = memo(KpiCardComponent);
