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
import Loading from "@/app/core/components/shared/loading";

// Convert hex colors to rgba for transparency
const getColorWithAlpha = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const ExpensePieChart = () => {
  const { data, isLoading, error } = useKpi();

  const expensesByCategory = useMemo(() => data?.expensesByCategory || [], [data]);

  const chartData = useMemo(
    () =>
      expensesByCategory
        .filter((item) => item.value && item.value > 0) // Only categories with actual expenses
        .map((item, index) => ({
          name: item.name,
          value: item.value!,
          color: COLORS[index % COLORS.length],
          fill: COLORS[index % COLORS.length],
        })),
    [expensesByCategory]
  );
  
  const totalExpenses = useMemo(
    () => chartData.reduce((sum, item) => sum + item.value, 0),
    [chartData]
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

  const topCategoryIndex = useMemo(
    () => expensesByCategory.findIndex((item) => item.name === topCategory.name),
    [expensesByCategory, topCategory]
  );

  const renderCustomizedLabel = useCallback((props: PieLabelRenderProps) => {
    const { cx = 0, cy = 0, midAngle = 0, outerRadius = 0, percent = 0 } = props;
    if (percent === 0 || percent < 0.05) return null;

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

  // Loading state
  if (isLoading) {
    return (
      <Loading />
    );
  }

  // Error state
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
          <p className="text-slate-600 text-center">Please try refreshing the page</p>
          <p className="text-sm text-slate-400 mt-1 text-center">
            If the problem persists, contact support
          </p>
        </CardContent>
      </Card>
    );
  }

  // Empty state: no expenses
  // Empty state: no expenses or totalExpenses is 0
if (expensesByCategory.length === 0 || totalExpenses === 0) {
  return (
    <Card className="border-slate-200/50 shadow-sm flex flex-col items-center justify-center h-[400px]">
      <PieChartIcon className="w-12 h-12 text-slate-400 mb-4" />
      <p className="text-slate-600 text-center">
        No expenses yet. Add an expense to see the chart.
      </p>
    </Card>
  );
}


if (chartData.length === 0) {
  return (
    <Card className="border-slate-200/50 shadow-sm flex flex-col items-center justify-center h-[400px]">
      <PieChartIcon className="w-12 h-12 text-slate-400 mb-4" />
      <p className="text-slate-600 text-center">
        No expenses yet. Add an expense to see the chart.
      </p>
    </Card>
  );
}


  // Chart rendering
  return (
    <Card className="relative overflow-hidden group border-slate-200/50 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-[#0088FE] to-[#00C49F]" />

      <CardHeader className="relative z-10">
        <CardTitle className="flex items-center gap-2 text-slate-900">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#0088FE]/10 to-[#00C49F]/10 flex items-center justify-center">
            <PieChartIcon className="h-5 w-5 text-[#0088FE]" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Expense Breakdown</h3>
            <p className="text-sm text-slate-500 font-normal">Monthly spending by category</p>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="relative z-10">
        <div className="space-y-8">
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
                  wrapperStyle={{ paddingLeft: "20px", fontSize: "11px", fontWeight: "500" }}
                  formatter={(value) => <span className="text-slate-700">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Stats cards for total, top, average expenses (same as before) */}
        </div>
      </CardContent>
    </Card>
  );
};
