"use client";

import { useMemo, useCallback } from "react";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  PieLabelRenderProps,
} from "recharts";
import {
  PieChart as PieChartIcon,
  AlertCircle,
  TrendingUp,
  DollarSign,
  Target,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/app/core/components/ui/card";
import { useKpi } from "../store/kpi-store";
import { COLORS } from "../constants/constants";
import Loading from "@/app/core/components/shared/loading";

export const ExpensePieChart = () => {
  const { data, isLoading, error } = useKpi();

  const expensesByCategory = useMemo(() => data?.expensesByCategory || [], [data]);

  const chartData = useMemo(
    () =>
      expensesByCategory
        .filter((item) => item.value && item.value > 0)
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
      chartData.length > 0 
        ? chartData.reduce(
            (max, item) => (item.value > max.value ? item : max),
            chartData[0]
          )
        : { name: "None", value: 0, color: COLORS[0] },
    [chartData]
  );

  const averageExpense = useMemo(() => {
    if (chartData.length === 0) return 0;
    return totalExpenses / chartData.length;
  }, [chartData, totalExpenses]);

  const renderCustomizedLabel = useCallback((props: PieLabelRenderProps) => {
    const { cx = 0, cy = 0, midAngle = 0, outerRadius = 0, percent = 0 } = props;
    if (!percent || percent < 0.05) return null;

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
        className="text-xs sm:text-sm"
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
        <div className="bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-slate-200 min-w-[160px]">
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: data.color || COLORS[0] }}
            />
            <span className="font-semibold text-slate-900 text-sm truncate">
              {data.name}
            </span>
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
      <Card className="border-slate-200/50 shadow-sm h-full">
        <CardContent className="h-[400px] sm:h-[450px] flex items-center justify-center p-6">
          <Loading />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="relative overflow-hidden border-rose-200/50 bg-linear-to-br from-rose-50/50 to-pink-50/30 backdrop-blur-sm shadow-lg h-full">
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-rose-400 to-pink-500" />
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-rose-800 text-lg sm:text-xl">
            <AlertCircle className="h-5 w-5" />
            Unable to load expense data
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[350px] sm:h-[400px] flex flex-col items-center justify-center p-4 sm:p-6">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-linear-to-br from-rose-100 to-pink-100 flex items-center justify-center mb-4">
            <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-rose-400" />
          </div>
          <p className="text-slate-600 text-center text-sm sm:text-base">
            Please try refreshing the page
          </p>
          <p className="text-sm text-slate-400 mt-1 text-center">
            If the problem persists, contact support
          </p>
        </CardContent>
      </Card>
    );
  }

  if (expensesByCategory.length === 0 || totalExpenses === 0 || chartData.length === 0) {
    return (
      <Card className="border-slate-200/50 shadow-sm h-full flex flex-col items-center justify-center p-4 sm:p-6 min-h-[400px]">
        <PieChartIcon className="w-10 h-10 sm:w-12 sm:h-12 text-slate-400 mb-4" />
        <CardTitle className="text-lg sm:text-xl font-semibold text-slate-700 mb-2">
          No expenses yet
        </CardTitle>
        <CardDescription className="text-center text-sm sm:text-base">
          Add an expense to see the chart breakdown
        </CardDescription>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden group border-slate-200/50 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 h-full">
      <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-[#0088FE] to-[#00C49F]" />

      <CardHeader className="relative z-10 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <div className="w-12 h-12 rounded-xl bg-linear-to-br from-[#0088FE]/10 to-[#00C49F]/10 flex items-center justify-center shrink-0">
            <PieChartIcon className="h-5 w-5 sm:h-6 sm:w-6 text-[#0088FE]" />
          </div>
          <div>
            <CardTitle className="text-lg sm:text-xl font-semibold text-slate-900">
              Expense Distribution
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              This month
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative z-10 p-4 sm:p-6 h-[calc(100%-80px)]">
        <div className="flex flex-col lg:flex-row h-full gap-4 sm:gap-6">
          {/* Chart Container */}
          <div className="w-full lg:w-2/3 h-[250px] sm:h-[280px] md:h-[300px] lg:h-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  outerRadius="70%"
                  innerRadius="40%"
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
                      strokeWidth={2}
                      className="transition-all duration-300 hover:opacity-80"
                    />
                  ))}
                </Pie>
                <Tooltip content={renderTooltipContent} />
                <Legend
                  layout="vertical"
                  align="right"
                  verticalAlign="middle"
                  wrapperStyle={{
                    paddingLeft: "10px",
                    fontSize: "10px",
                    fontWeight: "500",
                  }}
                  iconSize={8}
                  iconType="circle"
                  formatter={(value) => (
                    <span className="text-xs text-slate-700 truncate">{value}</span>
                  )}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>

          {/* Stats Section - Now on the right side */}
          <div className="w-full lg:w-1/3">
            <div className="space-y-3 sm:space-y-4 h-full">
              {/* Total Expenses */}
              <div className="bg-slate-50/80 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-slate-200/50">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <DollarSign className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-slate-700">Total</span>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-slate-900">
                  ${totalExpenses.toFixed(2)}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Overall spending this month
                </div>
              </div>

              {/* Top Category */}
              <div className="bg-slate-50/80 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-slate-200/50">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-amber-600" />
                  </div>
                  <span className="text-sm font-medium text-slate-700">Top Category</span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: topCategory.color }}
                  />
                  <div className="text-lg sm:text-xl font-bold text-slate-900 truncate">
                    {topCategory.name}
                  </div>
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  ${topCategory.value.toFixed(2)} ({(topCategory.value / totalExpenses * 100).toFixed(1)}%)
                </div>
              </div>

              {/* Average Expense */}
              <div className="bg-slate-50/80 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-slate-200/50">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <Target className="h-4 w-4 text-emerald-600" />
                  </div>
                  <span className="text-sm font-medium text-slate-700">Average</span>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-slate-900">
                  ${averageExpense.toFixed(2)}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Per category ({chartData.length} categories)
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};