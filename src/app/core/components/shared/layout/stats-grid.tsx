"use client";

import {
  DollarSign,
  CalendarDays,
  TrendingUp,
  Calendar,
  BarChart3,
  CheckCircle2,
  Wallet,
  XCircle,
  TrendingDown,
  Package,
  ArrowUp,
  PieChart,
  Activity,
  // 1. New imports added here
  Shield,
  CreditCard,
} from "lucide-react";

interface StatCard {
  title: string;
  value: string | number;
  description: string;
  // 2. New literal types added here
  icon:
    | "dollar"
    | "calendar"
    | "trendingUp"
    | "trendingDown"
    | "calendarDays"
    | "barChart"
    | "checkCircle"
    | "xCircle"
    | "wallet"
    | "package"
    | "arrowUp"
    | "pieChart"
    | "activity"
    | "shield"      // Added
    | "creditCard"; // Added
  iconBg: string;
  loading?: boolean;
  percentageChange?: string;
  prefix?: string;
}

const iconMap = {
  dollar: DollarSign,
  calendar: Calendar,
  trendingUp: TrendingUp,
  trendingDown: TrendingDown,
  calendarDays: CalendarDays,
  barChart: BarChart3,
  checkCircle: CheckCircle2,
  xCircle: XCircle,
  wallet: Wallet,
  package: Package,
  arrowUp: ArrowUp,
  pieChart: PieChart,
  activity: Activity,
  // 3. New mappings added here
  shield: Shield,
  creditCard: CreditCard,
};

export function StatsGrid({ stats }: { stats: StatCard[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => {
        // Safety check: ensure Icon exists, fallback to Package if missing
        const Icon = iconMap[stat.icon] || Package;
        
        const percentageColor =
          parseFloat(stat.percentageChange || "0") >= 0
            ? "text-green-600"
            : "text-red-600";
        const iconColor =
          parseFloat(stat.percentageChange || "0") >= 0
            ? "text-green-500"
            : "text-red-500";

        return (
          <div
            key={index}
            className="bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 flex items-center gap-2 font-medium">
                  <Icon className="h-4 w-4" /> {stat.title}
                </p>
                <p className="text-3xl font-bold mt-3 text-slate-900">
                  {stat.loading ? (
                    "..."
                  ) : (
                    <>
                      {stat.prefix}
                      {typeof stat.value === "number"
                        ? stat.value.toFixed(2)
                        : stat.value}
                    </>
                  )}
                </p>
                {stat.percentageChange ? (
                  <div className="flex items-center gap-2 mt-2">
                    <TrendingUp className={`h-4 w-4 ${iconColor}`} />
                    <span className={`text-sm font-medium ${percentageColor}`}>
                      {stat.percentageChange}% from last month
                    </span>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 mt-2">
                    {stat.description}
                  </p>
                )}
              </div>
              <div className={`p-3 ${stat.iconBg} rounded-xl shadow-lg`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}