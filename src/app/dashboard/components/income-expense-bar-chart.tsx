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
      <div className="h-full flex flex-col gap-4">
        <Skeleton className="h-64 w-full rounded-md" />
        <div className="grid grid-cols-3 gap-4">
          <Skeleton className="h-16 rounded-md" />
          <Skeleton className="h-16 rounded-md" />
          <Skeleton className="h-16 rounded-md" />
        </div>
      </div>
    );
  }

  if (error || !monthlyData.length) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <BarChart3 className="w-12 h-12 text-slate-300 mb-3" />
        <p className="text-slate-500">No monthly data available</p>
        <p className="text-sm text-slate-400 mt-1">
          Add transactions to see trends
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={monthlyData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
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
            />
            <YAxis
              stroke="#64748b"
              fontSize={12}
              tickFormatter={(value) => `$${value}`}
              tickLine={false}
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
                  <span key={name} className="font-semibold" style={{ color }}>
                    ${value.toFixed(2)}
                  </span>,
                  label,
                ];
              }}
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
              labelFormatter={(label) => `Month: ${label}`}
            />
            <Legend
              formatter={(value) => (
                <span className="text-sm text-slate-700">{value}</span>
              )}
            />
            <Bar
              dataKey="income"
              name="Income"
              fill="#10b981"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
            <Bar
              dataKey="expense"
              name="Expense"
              fill="#ef4444"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-200">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-sm text-slate-600">Latest Income</div>
            <div className="text-lg font-bold text-green-600">
              ${latestMonth.income.toLocaleString()}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-slate-600">Latest Expense</div>
            <div className="text-lg font-bold text-red-600">
              ${latestMonth.expense.toLocaleString()}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-slate-600">Savings Rate</div>
            <div
              className={`text-lg font-bold ${parseFloat(savingsRate) > 0 ? "text-green-600" : "text-red-600"}`}
            >
              {savingsRate}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
