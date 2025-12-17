"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { BarChart3 } from "lucide-react";
import { Skeleton } from "@/app/core/components/ui/skeleton";
import { useKpi } from "../store/kpi-store";
import { MonthlyData } from "../types/types";

export default function IncomeExpenseBarChart() {
  const { data: kpiData, isLoading, error } = useKpi();

  const monthlyData: MonthlyData[] = useMemo(() => {
    return (
      kpiData?.monthlyTrends?.map((item) => ({
        month: item.month || "",
        income: item.income || 0,
        expense: item.expense || 0,
        savings: (item.income || 0) - (item.expense || 0),
      })) || []
    );
  }, [kpiData]);

  const latestMonth = useMemo(
    () => monthlyData[monthlyData.length - 1] || { income: 0, expense: 0 },
    [monthlyData]
  );
  const netSavings = latestMonth.income - latestMonth.expense;
  const savingsRate =
    latestMonth.income > 0
      ? ((netSavings / latestMonth.income) * 100).toFixed(1)
      : "0.0";

  if (isLoading) {
    return (
      <div className="h-full flex flex-col gap-3 sm:gap-4 p-2 sm:p-0">
        <Skeleton className="h-[200px] sm:h-[220px] md:h-[240px] w-full rounded-md" />
        <div className="grid grid-cols-1 xs:grid-cols-3 gap-2 sm:gap-4">
          <Skeleton className="h-14 sm:h-16 rounded-md" />
          <Skeleton className="h-14 sm:h-16 rounded-md" />
          <Skeleton className="h-14 sm:h-16 rounded-md" />
        </div>
      </div>
    );
  }

  if (error || !monthlyData.length) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-4 sm:p-6">
        <BarChart3 className="w-10 h-10 sm:w-12 sm:h-12 text-slate-300 mb-3" />
        <p className="text-slate-500 text-sm sm:text-base text-center">
          No monthly data available
        </p>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 text-center">
          Add transactions to see trends
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-1 sm:p-2">
      {/* Chart Container */}
      <div className="flex-1 min-h-[200px] sm:min-h-[220px] md:min-h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={monthlyData}
            margin={{ 
              top: 10, 
              right: 10, 
              left: 0, 
              bottom: 5 
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f1f5f9"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              tickMargin={8}
              interval="preserveStartEnd"
              minTickGap={10}
            />
            <YAxis
              stroke="#64748b"
              fontSize={10}
              tickFormatter={(value) => {
                if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`;
                return `$${value}`;
              }}
              tickLine={false}
              width={40}
              tickMargin={5}
            />
            <Tooltip
              formatter={(value: number, name: string) => {
                const label =
                  name === "income"
                    ? "Income"
                    : name === "expense"
                      ? "Expense"
                      : "Savings";
                const color =
                  name === "income"
                    ? "#10b981"
                    : name === "expense"
                      ? "#ef4444"
                      : "#3b82f6";
                return [
                  <span 
                    key={name} 
                    className="font-semibold text-sm" 
                    style={{ color }}
                  >
                    ${typeof value === 'number' ? value.toFixed(2) : value}
                  </span>,
                  <span key={`label-${name}`} className="text-sm">
                    {label}
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
            <Legend
              formatter={(value) => (
                <span className="text-xs sm:text-sm text-slate-700">
                  {value}
                </span>
              )}
              iconSize={8}
              wrapperStyle={{
                fontSize: "10px",
                paddingTop: "10px",
              }}
            />
            <Bar
              dataKey="income"
              name="Income"
              fill="#10b981"
              radius={[2, 2, 0, 0]}
              maxBarSize={30}
            />
            <Bar
              dataKey="expense"
              name="Expense"
              fill="#ef4444"
              radius={[2, 2, 0, 0]}
              maxBarSize={30}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Stats Section */}
      <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-slate-200">
        <div className="grid grid-cols-1 xs:grid-cols-3 gap-2 sm:gap-3">
          <div className="text-center p-2 sm:p-3 bg-slate-50/50 rounded-lg">
            <div className="text-xs sm:text-sm text-slate-600 font-medium mb-1">
              Latest Income
            </div>
            <div className="text-base sm:text-lg font-bold text-green-600 truncate">
              ${latestMonth.income.toLocaleString()}
            </div>
          </div>
          <div className="text-center p-2 sm:p-3 bg-slate-50/50 rounded-lg">
            <div className="text-xs sm:text-sm text-slate-600 font-medium mb-1">
              Latest Expense
            </div>
            <div className="text-base sm:text-lg font-bold text-red-600 truncate">
              ${latestMonth.expense.toLocaleString()}
            </div>
          </div>
          <div className="text-center p-2 sm:p-3 bg-slate-50/50 rounded-lg">
            <div className="text-xs sm:text-sm text-slate-600 font-medium mb-1">
              Savings Rate
            </div>
            <div
              className={`text-base sm:text-lg font-bold ${
                parseFloat(savingsRate) > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {savingsRate}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}