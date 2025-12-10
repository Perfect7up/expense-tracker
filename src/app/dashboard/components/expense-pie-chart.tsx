"use client";

import { useMemo, useCallback } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  PieLabelRenderProps,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  PieChart as PieChartIcon,
  AlertCircle,
  Zap,
  TrendingUp as ArrowUp,
} from "lucide-react";
import { Skeleton } from "@/app/core/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/core/components/ui/card";

import { useKpi } from "../store/kpi-store";
import { COLORS } from "../constants/constants";
import { cn } from "@/app/core/lib/utils";

// Convert hex colors to rgba for transparency
const getColorWithAlpha = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const ExpensePieChart = () => {
  const { data, isLoading, error } = useKpi();

  const expensesByCategory = useMemo(
    () => data?.expensesByCategory || [],
    [data]
  );

  const chartData = useMemo(
    () =>
      expensesByCategory.map((item, index) => ({
        name: item.name,
        value: item.value || 0,
        color: COLORS[index % COLORS.length],
        fill: COLORS[index % COLORS.length],
      })),
    [expensesByCategory]
  );

  const totalExpenses = useMemo(
    () => expensesByCategory.reduce((sum, item) => sum + (item.value || 0), 0),
    [expensesByCategory]
  );

  const topCategory = useMemo(
    () =>
      expensesByCategory.reduce(
        (max, item) => (item.value > max.value ? item : max),
        { name: "None", value: 0 }
      ),
    [expensesByCategory]
  );

  const averageExpense = useMemo(() => {
    if (expensesByCategory.length === 0) return 0;
    return totalExpenses / expensesByCategory.length;
  }, [expensesByCategory, totalExpenses]);

  const topCategoryIndex = useMemo(() => {
    return expensesByCategory.findIndex(
      (item) => item.name === topCategory.name
    );
  }, [expensesByCategory, topCategory]);

  const renderCustomizedLabel = useCallback((props: PieLabelRenderProps) => {
    const {
      cx = 0,
      cy = 0,
      midAngle = 0,
      outerRadius = 0,
      percent = 0,
    } = props;
    if (percent === 0) return null;
    if (percent < 0.05) return null; // Hide small percentages

    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 30;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#475569"
        fontSize={11}
        fontWeight={500}
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  }, []);

  const renderTooltipContent = useCallback(
    (props: any) => {
      const { active, payload } = props;
      if (!active || !payload || payload.length === 0) return null;

      const data = payload[0].payload;
      const percent = (data.value / totalExpenses) * 100;

      return (
        <div className="bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-xl border border-slate-200/50">
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: data.color || COLORS[0] }}
            />
            <span className="font-semibold text-slate-900">{data.name}</span>
          </div>
          <div className="text-lg font-bold text-slate-900">
            ${data.value.toFixed(2)}
          </div>
          <div className="text-sm text-slate-600">
            {percent.toFixed(1)}% of total
          </div>
        </div>
      );
    },
    [totalExpenses]
  );

  if (isLoading) {
    return (
      <Card className="relative overflow-hidden border-slate-200/50 bg-white/80 backdrop-blur-sm shadow-lg">
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-blue-500 to-cyan-400" />
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="h-80 w-full flex items-center justify-center">
              <div className="relative">
                <Skeleton className="w-64 h-64 rounded-full" />
                <Skeleton className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Skeleton className="h-24 rounded-xl" />
              <Skeleton className="h-24 rounded-xl" />
              <Skeleton className="h-24 rounded-xl" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="relative overflow-hidden border-rose-200/50 bg-linear-to-br from-rose-50/50 to-pink-50/30 backdrop-blur-sm shadow-lg">
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-rose-400 to-pink-500" />
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-rose-800">
            <AlertCircle className="h-5 w-5" />
            Unable to load expense data
          </CardTitle>
        </CardHeader>
        <CardContent className="min-h-[400px] flex flex-col items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-linear-to-br from-rose-100 to-pink-100 flex items-center justify-center mb-4">
            <AlertCircle className="w-12 h-12 text-rose-400" />
          </div>
          <p className="text-slate-600 text-center">
            Please try refreshing the page
          </p>
          <p className="text-sm text-slate-400 mt-1 text-center">
            If the problem persists, contact support
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden group border-slate-200/50 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
      {/* linear accent line - Using first two colors from COLORS array */}
      <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-[#0088FE] to-[#00C49F]" />

      {/* Animated background effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-linear-to-br from-[#0088FE]/10 to-[#00C49F]/10 rounded-full blur-3xl" />
      </div>

      <CardHeader className="relative z-10">
        <CardTitle className="flex items-center gap-2 text-slate-900">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#0088FE]/10 to-[#00C49F]/10 flex items-center justify-center">
            <PieChartIcon className="h-5 w-5 text-[#0088FE]" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Expense Breakdown</h3>
            <p className="text-sm text-slate-500 font-normal">
              Monthly spending by category
            </p>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="relative z-10">
        <div className="space-y-8">
          {/* Chart Area */}
          <div className="h-60 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                  innerRadius={60}
                  paddingAngle={2}
                  dataKey="value"
                  label={renderCustomizedLabel}
                  labelLine={false}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      stroke="#fff"
                      strokeWidth={3}
                      className="transition-all duration-300 hover:opacity-90"
                    />
                  ))}
                </Pie>
                <Tooltip content={renderTooltipContent} />
                <Legend
                  layout="vertical"
                  align="right"
                  verticalAlign="middle"
                  wrapperStyle={{
                    paddingLeft: "20px",
                    fontSize: "11px",
                    fontWeight: "500",
                  }}
                  formatter={(value) => (
                    <span className="text-slate-700">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Total Expenses */}
            <div
              className={cn(
                "relative overflow-hidden rounded-xl p-4",
                "backdrop-blur-sm border",
                "group hover:scale-[1.02] transition-all duration-300"
              )}
              style={{
                backgroundColor: getColorWithAlpha(COLORS[0], 0.08),
                borderColor: getColorWithAlpha(COLORS[0], 0.3),
              }}
            >
              <div
                className="absolute top-0 left-0 w-full h-1"
                style={{
                  backgroundColor: COLORS[0],
                }}
              />
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-600 mb-1">
                    Total Expenses
                  </p>
                  <div className="text-2xl font-bold text-slate-900">
                    $
                    {totalExpenses.toLocaleString(undefined, {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">This month</p>
                </div>
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{
                    backgroundColor: getColorWithAlpha(COLORS[0], 0.2),
                  }}
                >
                  <TrendingDown
                    className="w-5 h-5"
                    style={{
                      color: COLORS[0],
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Top Category */}
            <div
              className={cn(
                "relative overflow-hidden rounded-xl p-4",
                "backdrop-blur-sm border",
                "group hover:scale-[1.02] transition-all duration-300"
              )}
              style={{
                backgroundColor:
                  topCategoryIndex >= 0
                    ? getColorWithAlpha(
                        COLORS[topCategoryIndex % COLORS.length],
                        0.08
                      )
                    : getColorWithAlpha(COLORS[1], 0.08),
                borderColor:
                  topCategoryIndex >= 0
                    ? getColorWithAlpha(
                        COLORS[topCategoryIndex % COLORS.length],
                        0.3
                      )
                    : getColorWithAlpha(COLORS[1], 0.3),
              }}
            >
              <div
                className="absolute top-0 left-0 w-full h-1"
                style={{
                  backgroundColor:
                    topCategoryIndex >= 0
                      ? COLORS[topCategoryIndex % COLORS.length]
                      : COLORS[1],
                }}
              />
              <div className="flex items-start justify-between">
                <div className="overflow-hidden">
                  <p className="text-xs font-medium text-slate-600 mb-1">
                    Top Category
                  </p>
                  <div className="text-lg font-semibold text-slate-900 truncate">
                    {topCategory?.name || "N/A"}
                  </div>
                  <div className="text-2xl font-bold text-slate-900">
                    $
                    {(topCategory?.value || 0).toLocaleString(undefined, {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}
                  </div>
                </div>
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{
                    backgroundColor:
                      topCategoryIndex >= 0
                        ? getColorWithAlpha(
                            COLORS[topCategoryIndex % COLORS.length],
                            0.2
                          )
                        : getColorWithAlpha(COLORS[1], 0.2),
                  }}
                >
                  <Zap
                    className="w-5 h-5"
                    style={{
                      color:
                        topCategoryIndex >= 0
                          ? COLORS[topCategoryIndex % COLORS.length]
                          : COLORS[1],
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Average per Category */}
            <div
              className={cn(
                "relative overflow-hidden rounded-xl p-4",
                "backdrop-blur-sm border",
                "group hover:scale-[1.02] transition-all duration-300"
              )}
              style={{
                backgroundColor: getColorWithAlpha(COLORS[2], 0.08),
                borderColor: getColorWithAlpha(COLORS[2], 0.3),
              }}
            >
              <div
                className="absolute top-0 left-0 w-full h-1"
                style={{
                  backgroundColor: COLORS[2],
                }}
              />
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-600 mb-1">
                    Avg per Category
                  </p>
                  <div className="text-2xl font-bold text-slate-900">
                    $
                    {averageExpense.toLocaleString(undefined, {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <ArrowUp
                      className="w-3 h-3"
                      style={{
                        color:
                          expensesByCategory.length > 0 &&
                          topCategory?.value > averageExpense
                            ? COLORS[1]
                            : COLORS[3],
                      }}
                    />
                    <span className="text-xs text-slate-500">
                      {expensesByCategory.length > 0
                        ? (
                            (topCategory?.value || 0) / averageExpense -
                            1
                          ).toFixed(1) + "x top"
                        : "No data"}
                    </span>
                  </div>
                </div>
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{
                    backgroundColor: getColorWithAlpha(COLORS[2], 0.2),
                  }}
                >
                  <TrendingUp
                    className="w-5 h-5"
                    style={{
                      color: COLORS[2],
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
