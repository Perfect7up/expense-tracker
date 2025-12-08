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
      <div className="h-full grid grid-cols-1 gap-4">
        <Skeleton className="h-6 w-1/4 mb-2" />
        <Skeleton className="h-[300px] w-full" />
      </div>
    );
  }

  if (error || !trendData.length) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <LineChart className="w-12 h-12 text-slate-300 mb-3" />
        <p className="text-slate-500">No trend data available</p>
        <p className="text-sm text-slate-400 mt-1">
          Add transactions to see trends
        </p>
      </div>
    );
  }

  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-medium text-slate-700">
            Balance Growth Trend
          </h3>
          <div className="flex items-center mt-1">
            <div
              className={`text-2xl font-bold ${
                isPositive ? "text-green-600" : "text-red-600"
              }`}
            >
              {isPositive ? "+" : ""}
              {growth.toFixed(1)}%
            </div>
            <div className="ml-2">
              {isPositive ? (
                <TrendingUp className="w-5 h-5 text-green-500" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-500" />
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span className="text-sm text-slate-600">Income</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
            <span className="text-sm text-slate-600">Expense</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
            <span className="text-sm text-slate-600">Balance</span>
          </div>
        </div>
      </div>

      <div className="h-[calc(100%-60px)]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={trendData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f1f5f9"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#64748b"
              fontSize={12}
              tickFormatter={(value) => `$${value}`}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              formatter={(value: number, name: string) => {
                const formattedName =
                  name === "balance"
                    ? "Balance"
                    : name === "income"
                      ? "Income"
                      : "Expense";
                return [`$${(value || 0).toFixed(2)}`, formattedName];
              }}
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
            />
            <Area
              type="monotone"
              dataKey="income"
              stroke="#10b981"
              fill="url(#colorIncome)"
              fillOpacity={0.3}
              strokeWidth={2}
              stackId="1"
            />
            <Area
              type="monotone"
              dataKey="expense"
              stroke="#ef4444"
              fill="url(#colorExpense)"
              fillOpacity={0.3}
              strokeWidth={2}
              stackId="1"
            />
            <Area
              type="monotone"
              dataKey="balance"
              stroke="#3b82f6"
              fill="url(#colorBalance)"
              fillOpacity={0.1}
              strokeWidth={3}
              dot={{ strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
