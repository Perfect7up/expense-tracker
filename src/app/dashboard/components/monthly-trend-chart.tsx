"use client";

import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, TrendingDown, LineChart } from "lucide-react";
import { Skeleton } from "@/app/core/components/ui/skeleton";
import { useKpi } from "../store/kpi-store";
import { TrendData } from "../types/types";

export default function MonthlyTrendChart() {
  const { data: kpiData, isLoading, error } = useKpi();

  const trendData: TrendData[] = useMemo(() => {
    return (kpiData?.monthlyTrends || []).map((item, index, array) => {
      const previousBalance =
        index > 0
          ? (array[index - 1].income || 0) - (array[index - 1].expense || 0)
          : 0;
      return {
        month: item.month || "",
        income: item.income || 0,
        expense: item.expense || 0,
        balance: (item.income || 0) - (item.expense || 0) + previousBalance,
      };
    });
  }, [kpiData]);

  const growth = useMemo(() => {
    if (trendData.length < 2) return 0;
    const first = trendData[0].balance || 0;
    const last = trendData[trendData.length - 1].balance || 0;
    if (Math.abs(first) === 0) return last > 0 ? 100 : 0;
    return ((last - first) / Math.abs(first)) * 100;
  }, [trendData]);

  const isPositive = growth >= 0;

  if (isLoading) {
    return (
      <div className="h-full flex flex-col gap-3 sm:gap-4 p-2 sm:p-0">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-5 w-5 rounded-full" />
            </div>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center">
                <Skeleton className="h-3 w-3 rounded-full mr-2" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </div>
        <Skeleton className="h-[220px] sm:h-[250px] md:h-[280px] w-full rounded-md" />
      </div>
    );
  }

  if (error || !trendData.length) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-4 sm:p-6">
        <LineChart className="w-10 h-10 sm:w-12 sm:h-12 text-slate-300 mb-3" />
        <p className="text-slate-500 text-sm sm:text-base text-center">
          No trend data available
        </p>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 text-center">
          Add transactions to see trends
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-1 sm:p-2">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
        {/* Growth Info */}
        <div>
          <h3 className="text-sm sm:text-base font-medium text-slate-700">
            Balance Growth Trend
          </h3>
          <div className="flex items-center mt-1">
            <div
              className={`text-xl sm:text-2xl font-bold ${
                isPositive ? "text-green-600" : "text-red-600"
              }`}
            >
              {isPositive ? "+" : ""}
              {growth.toFixed(1)}%
            </div>
            <div className="ml-2">
              {isPositive ? (
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
              ) : (
                <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
              )}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-2 sm:gap-3 lg:gap-4 justify-start sm:justify-end">
          <div className="flex items-center">
            <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500 mr-1 sm:mr-2"></div>
            <span className="text-xs sm:text-sm text-slate-600">Income</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500 mr-1 sm:mr-2"></div>
            <span className="text-xs sm:text-sm text-slate-600">Expense</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-blue-500 mr-1 sm:mr-2"></div>
            <span className="text-xs sm:text-sm text-slate-600">Balance</span>
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="flex-1 min-h-[220px] sm:min-h-[250px] md:min-h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={trendData}
            margin={{ 
              top: 5, 
              right: 10, 
              left: 0, 
              bottom: 5 
            }}
          >
            <CartesianGrid
              strokeDasharray="2 2"
              stroke="#f1f5f9"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickMargin={5}
              minTickGap={10}
              interval="preserveStartEnd"
            />
            <YAxis
              stroke="#64748b"
              fontSize={10}
              tickFormatter={(value) => {
                if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
                if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`;
                return `$${value}`;
              }}
              tickLine={false}
              axisLine={false}
              width={40}
              tickMargin={5}
            />
            <Tooltip
              formatter={(value: number, name: string) => {
                const formattedName =
                  name === "balance"
                    ? "Balance"
                    : name === "income"
                      ? "Income"
                      : "Expense";
                return [
                  <span 
                    key={name} 
                    className="font-semibold text-sm"
                  >
                    ${(value || 0).toFixed(2)}
                  </span>,
                  <span key={`label-${name}`} className="text-sm">
                    {formattedName}
                  </span>,
                ];
              }}
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                fontSize: "12px",
                padding: "8px 12px",
              }}
              labelFormatter={(label) => (
                <span className="text-sm font-medium">Month: {label}</span>
              )}
            />
            <Area
              type="monotone"
              dataKey="income"
              stroke="#10b981"
              fill="url(#colorIncome)"
              fillOpacity={0.2}
              strokeWidth={1.5}
              stackId="1"
              dot={false}
              activeDot={false}
            />
            <Area
              type="monotone"
              dataKey="expense"
              stroke="#ef4444"
              fill="url(#colorExpense)"
              fillOpacity={0.2}
              strokeWidth={1.5}
              stackId="1"
              dot={false}
              activeDot={false}
            />
            <Area
              type="monotone"
              dataKey="balance"
              stroke="#3b82f6"
              fill="url(#colorBalance)"
              fillOpacity={0.05}
              strokeWidth={2}
              dot={{ strokeWidth: 1, r: 2 }}
              activeDot={{ r: 4 }}
            />
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}