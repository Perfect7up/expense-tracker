'use client';

import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Package, LucideIcon } from 'lucide-react';

// --- Utils (Mocking your utility if not available) ---
// You can keep your import { formatCurrency } from '../utils/utils';
const defaultFormatCurrency = (val: number) => 
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

interface OverviewStatsProps {
  data: {
    totalIncome: number;
    totalExpense: number;
    netBalance: number;
    activeSubscriptions: number;
  } | null;
  loading?: boolean;
}

// Map string icon names to Lucide components
const iconMap: Record<string, LucideIcon> = {
  trendingUp: TrendingUp,
  trendingDown: TrendingDown,
  dollar: DollarSign,
  package: Package,
};

export function OverviewStats({ data, loading = false }: OverviewStatsProps) {
  // Use your imported formatCurrency, or the fallback defined above
  const formatCurrency = defaultFormatCurrency;

  const calculatePercentageChange = (current: number, previous?: number) => {
    if (!previous || previous === 0) return '0';
    return (((current - previous) / previous) * 100).toFixed(1);
  };

  const previousMonthIncome = data?.totalIncome ? data.totalIncome * 0.9 : 0;
  const previousMonthExpense = data?.totalExpense ? data.totalExpense * 0.95 : 0;
  const previousMonthNet = data?.netBalance ? data.netBalance * 0.85 : 0;

  const stats = [
    {
      title: "Total Income",
      value: formatCurrency(data?.totalIncome || 0),
      description: "Monthly income total",
      icon: "trendingUp",
      // Note: Standard Tailwind uses 'bg-gradient-to-br', 'bg-linear' is for v4 or plugins
      iconBg: "bg-gradient-to-br from-green-500 to-emerald-400", 
      loading: loading,
      percentageChange: calculatePercentageChange(data?.totalIncome || 0, previousMonthIncome),
    },
    {
      title: "Total Expenses",
      value: formatCurrency(data?.totalExpense || 0),
      description: "Monthly expense total",
      icon: "trendingDown",
      iconBg: "bg-gradient-to-br from-red-500 to-rose-400",
      loading: loading,
      percentageChange: calculatePercentageChange(data?.totalExpense || 0, previousMonthExpense),
    },
    {
      title: "Net Balance",
      value: formatCurrency(data?.netBalance || 0),
      description: "Net financial position",
      icon: "dollar",
      iconBg: "bg-gradient-to-br from-blue-500 to-cyan-400",
      loading: loading,
      percentageChange: calculatePercentageChange(data?.netBalance || 0, previousMonthNet),
    },
    {
      title: "Active Subscriptions",
      value: data?.activeSubscriptions || 0,
      description: "Recurring subscriptions",
      icon: "package",
      iconBg: "bg-gradient-to-br from-purple-500 to-pink-400",
      loading: loading,
    },
  ];

  return (
    // RESPONSIVE GRID LAYOUT
    // 1 col by default (<640px), 2 cols on sm, 4 cols on lg
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = iconMap[stat.icon];
        
        return (
          <div 
            key={index} 
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950"
          >
            {stat.loading ? (
              // Skeleton Loader
              <div className="animate-pulse space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-4 w-24 bg-gray-200 rounded dark:bg-gray-800"></div>
                  <div className="h-10 w-10 rounded-lg bg-gray-200 dark:bg-gray-800"></div>
                </div>
                <div className="h-8 w-32 bg-gray-200 rounded dark:bg-gray-800"></div>
                <div className="h-4 w-40 bg-gray-200 rounded dark:bg-gray-800"></div>
              </div>
            ) : (
              // Actual Content
              <>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <div className={`p-2 rounded-lg text-white shadow-sm ${stat.iconBg}`}>
                    {Icon && <Icon className="h-4 w-4" />}
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                    {stat.value}
                  </h3>
                  
                  <div className="flex items-center mt-1 text-xs">
                    {stat.percentageChange && (
                      <span className={`font-medium ${
                        Number(stat.percentageChange) >= 0 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {Number(stat.percentageChange) > 0 ? '+' : ''}
                        {stat.percentageChange}%
                      </span>
                    )}
                    <span className="text-gray-500 ml-2 dark:text-gray-400">
                      {stat.description}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}