"use client";

import {
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/core/components/ui/card";
import { Button } from "@/app/core/components/ui/button";
import { Badge } from "@/app/core/components/ui/badge";
import {
  BarChart3,
  Calendar,
  PieChart,
  TrendingUp,
  DollarSign,
  FileText,
  Target,
  Sparkles,
  Zap,
  Activity,
  BarChart as BarChartIcon,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

interface AnalyticsData {
  period: string;
  totalAmount: number;
  count: number;
  averageAmount: number;
}

interface AnalyticsSummaryProps {
  title: string;
  description: string;
  data: AnalyticsData[] | undefined;
  isLoading: boolean;
  periodType: "month" | "year";
  onPeriodChange: (period: "month" | "year") => void;
  emptyState: {
    title: string;
    description: string;
    buttonText: string;
    onButtonClick: () => void;
  };
  formatCurrency: (amount: number) => string;
  theme: {
    primary: string;
    secondary: string;
    light: string;
    lighter: string;
    gradient: string;
  };
}

export function AnalyticsSummary({
  title,
  description,
  data,
  isLoading,
  periodType,
  onPeriodChange,
  emptyState,
  formatCurrency = (amount) => `$${amount.toFixed(2)}`,
  theme = {
    primary: "#3B82F6", // blue-500
    secondary: "#06B6D4", // cyan-500
    light: "#EFF6FF", // blue-50
    lighter: "#DBEAFE", // blue-100
    gradient: "from-blue-500 to-cyan-500",
  },
}: AnalyticsSummaryProps) {
  const COLORS = [
    "#3B82F6", // blue-500
    "#2563EB", // blue-600
    "#1D4ED8", // blue-700
    "#0369A1", // blue-800
    "#0EA5E9", // sky-500
    "#06B6D4", // cyan-500
    "#0891B2", // cyan-600
    "#0E7490", // cyan-700
  ];

  const getFormattedData = () => {
    if (!data) return [];

    return data.map((item) => ({
      name: item.period,
      total: item.totalAmount,
      count: item.count,
      average: item.averageAmount,
    }));
  };

  const chartData = getFormattedData();

  const totalSum = chartData.reduce((sum, item) => sum + item.total, 0);
  const totalCount = chartData.reduce((sum, item) => sum + item.count, 0);
  const overallAverage = totalCount > 0 ? totalSum / totalCount : 0;
  const maxPeriod =
    chartData.length > 0
      ? chartData.reduce((max, item) => (item.total > max.total ? item : max))
      : null;
  const minPeriod =
    chartData.length > 0
      ? chartData.reduce((min, item) => (item.total < min.total ? item : min))
      : null;

  // Pie chart data
  const pieChartData = chartData.map((item) => ({
    name: item.name,
    value: item.total,
  }));

  // Calculate trend if we have at least 2 data points
  const getTrend = () => {
    if (chartData.length < 2) return null;

    const sorted = [...chartData].sort((a, b) => {
      // Sort by period name for chronological order
      return a.name.localeCompare(b.name);
    });

    const first = sorted[0].total;
    const last = sorted[sorted.length - 1].total;
    const change = last - first;
    const percentage = first > 0 ? (change / first) * 100 : 0;

    return {
      change,
      percentage: Math.abs(percentage).toFixed(1),
      isPositive: change > 0,
      direction: change > 0 ? "increase" : "decrease",
    };
  };

  const trend = getTrend();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <div className="w-16 h-16 rounded-full bg-linear-to-br from-blue-100 to-cyan-100 flex items-center justify-center animate-pulse">
          <BarChart3 className="w-8 h-8 text-blue-500" />
        </div>
        <p className="text-lg text-slate-700 font-medium">
          Loading analytics...
        </p>
        <p className="text-sm text-slate-500">Analyzing your data patterns</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Background effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-blue-100/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-cyan-100/10 rounded-full blur-3xl" />
      </div>

      <div className="bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className={`relative bg-linear-to-r ${theme.gradient} p-6`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 blur-2xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12 blur-2xl" />

          <CardHeader className="relative z-10 p-0">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-white">
                    {title}
                  </CardTitle>
                  <p className="text-sm text-blue-100/80">{description}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge className="bg-white/20 backdrop-blur-sm border border-white/30 text-white">
                  <Zap className="w-3 h-3 mr-1" />
                  {periodType === "month" ? "Monthly View" : "Yearly View"}
                </Badge>

                <Button
                  variant={periodType === "month" ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPeriodChange("month")}
                  className={`rounded-lg ${
                    periodType === "month"
                      ? "bg-white text-blue-600 hover:bg-white/90"
                      : "bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30"
                  }`}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Monthly
                </Button>
                <Button
                  variant={periodType === "year" ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPeriodChange("year")}
                  className={`rounded-lg ${
                    periodType === "year"
                      ? "bg-white text-blue-600 hover:bg-white/90"
                      : "bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30"
                  }`}
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Yearly
                </Button>
              </div>
            </div>
          </CardHeader>
        </div>

        <CardContent className="p-6 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-linear-to-r from-blue-50/50 to-cyan-50/50 border border-blue-200/50 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" /> Total
                  </p>
                  <p className="text-2xl font-bold text-slate-900 mt-2">
                    {formatCurrency(totalSum)}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Across {chartData.length} periods
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-linear-to-r from-blue-50/50 to-cyan-50/50 border border-blue-200/50 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Total Count
                  </p>
                  <p className="text-2xl font-bold text-slate-900 mt-2">
                    {totalCount}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Average per period:{" "}
                    {(totalCount / chartData.length || 0).toFixed(1)}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-linear-to-r from-blue-50/50 to-cyan-50/50 border border-blue-200/50 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 flex items-center gap-2">
                    <BarChartIcon className="w-4 h-4" /> Average
                  </p>
                  <p className="text-2xl font-bold text-slate-900 mt-2">
                    {formatCurrency(overallAverage)}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Per entry</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <BarChartIcon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-linear-to-r from-blue-50/50 to-cyan-50/50 border border-blue-200/50 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 flex items-center gap-2">
                    <Target className="w-4 h-4" /> Trend
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    {trend?.isPositive ? (
                      <ArrowUp className="w-5 h-5 text-green-500" />
                    ) : (
                      <ArrowDown className="w-5 h-5 text-red-500" />
                    )}
                    <p className="text-xl font-bold text-slate-900">
                      {trend ? `${trend.percentage}%` : "N/A"}
                    </p>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {trend
                      ? `${trend.direction} over period`
                      : "Not enough data"}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          {chartData.length === 0 ? (
            <div className="bg-linear-to-r from-slate-50/50 to-white border border-slate-200/50 rounded-2xl p-12 text-center">
              <div className="w-20 h-20 rounded-full bg-linear-to-br from-blue-100 to-cyan-100 flex items-center justify-center mx-auto mb-6">
                <BarChart3 className="w-10 h-10 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold text-slate-700 mb-2">
                {emptyState.title}
              </h3>
              <p className="text-slate-500 max-w-md mx-auto mb-6">
                {emptyState.description}
              </p>
              <Button
                onClick={emptyState.onButtonClick}
                className="rounded-full bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
              >
                {emptyState.buttonText}
              </Button>
            </div>
          ) : (
            <>
              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Bar Chart */}
                <div className="bg-linear-to-r from-blue-50/30 to-cyan-50/30 border border-blue-200/30 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" />
                      Total by Period
                    </h4>
                    <Badge className="bg-linear-to-r from-blue-100 to-cyan-100 text-blue-700 border-blue-200/50">
                      {maxPeriod
                        ? `Highest: ${maxPeriod.name} (${formatCurrency(maxPeriod.total)})`
                        : "No data"}
                    </Badge>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                        <XAxis
                          dataKey="name"
                          angle={-45}
                          textAnchor="end"
                          height={60}
                          fontSize={12}
                          stroke="#64748B"
                          tickLine={false}
                        />
                        <YAxis
                          stroke="#64748B"
                          tickLine={false}
                          tickFormatter={(value) => formatCurrency(value)}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(255, 255, 255, 0.9)",
                            backdropFilter: "blur(8px)",
                            border: "1px solid rgba(148, 163, 184, 0.3)",
                            borderRadius: "12px",
                            padding: "12px",
                            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                          }}
                          formatter={(value) => [
                            formatCurrency(Number(value)),
                            "Total",
                          ]}
                          labelFormatter={(label) => `Period: ${label}`}
                        />
                        <Bar
                          dataKey="total"
                          fill="url(#colorlinear)"
                          name="Total Amount"
                          radius={[4, 4, 0, 0]}
                        />
                        <defs>
                          <linearGradient
                            id="colorlinear"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="#3B82F6"
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="100%"
                              stopColor="#06B6D4"
                              stopOpacity={0.8}
                            />
                          </linearGradient>
                        </defs>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Pie Chart */}
                <div className="bg-linear-to-r from-blue-50/30 to-cyan-50/30 border border-blue-200/30 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                      <PieChart className="w-4 h-4" />
                      Distribution by Period
                    </h4>
                    <Badge className="bg-linear-to-r from-blue-100 to-cyan-100 text-blue-700 border-blue-200/50">
                      Total: {formatCurrency(totalSum)}
                    </Badge>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={pieChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={(entry) => {
                            const percentage = (
                              (entry.value / totalSum) *
                              100
                            ).toFixed(1);
                            return `${percentage}%`;
                          }}
                          outerRadius={80}
                          innerRadius={40}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {pieChartData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                              stroke="#FFFFFF"
                              strokeWidth={2}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(255, 255, 255, 0.9)",
                            backdropFilter: "blur(8px)",
                            border: "1px solid rgba(148, 163, 184, 0.3)",
                            borderRadius: "12px",
                            padding: "12px",
                            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                          }}
                          formatter={(value) => formatCurrency(Number(value))}
                        />
                        <Legend
                          verticalAlign="bottom"
                          height={36}
                          formatter={(value) => (
                            <span className="text-xs text-slate-700">
                              {value}
                            </span>
                          )}
                        />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Detailed Table */}
              <div className="bg-linear-to-r from-slate-50/50 to-white border border-slate-200/50 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Detailed Period Breakdown
                  </h4>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-linear-to-r from-blue-100 to-cyan-100 text-blue-700 border-blue-200/50">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Max: {maxPeriod?.name} (
                      {formatCurrency(maxPeriod?.total || 0)})
                    </Badge>
                    <Badge className="bg-linear-to-r from-blue-100 to-cyan-100 text-blue-700 border-blue-200/50">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Min: {minPeriod?.name} (
                      {formatCurrency(minPeriod?.total || 0)})
                    </Badge>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200/50">
                        <th className="text-left py-3 px-4 font-semibold text-slate-700 bg-linear-to-r from-slate-50 to-slate-100/50 rounded-l-lg">
                          Period
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-700 bg-linear-to-r from-slate-50 to-slate-100/50">
                          Total Amount
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-700 bg-linear-to-r from-slate-50 to-slate-100/50">
                          Count
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-700 bg-linear-to-r from-slate-50 to-slate-100/50 rounded-r-lg">
                          Average/Entry
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {chartData.map((item, index) => (
                        <tr
                          key={item.name}
                          className="border-b border-slate-100/50 last:border-0 hover:bg-slate-50/50 transition-colors duration-200"
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{
                                  backgroundColor:
                                    COLORS[index % COLORS.length],
                                }}
                              />
                              <span className="font-medium text-slate-900">
                                {item.name}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-900">
                              {formatCurrency(item.total)}
                            </div>
                            <div className="text-xs text-slate-500">
                              {totalSum > 0
                                ? ((item.total / totalSum) * 100).toFixed(1)
                                : 0}
                              % of total
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-medium text-slate-900">
                              {item.count}
                            </div>
                            <div className="text-xs text-slate-500">
                              {totalCount > 0
                                ? ((item.count / totalCount) * 100).toFixed(1)
                                : 0}
                              % of total
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-medium text-slate-900">
                              {formatCurrency(item.average)}
                            </div>
                            <div className="text-xs text-slate-500">
                              {overallAverage > 0
                                ? `${((item.average / overallAverage) * 100).toFixed(1)}% of avg`
                                : "N/A"}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </div>
    </div>
  );
}
