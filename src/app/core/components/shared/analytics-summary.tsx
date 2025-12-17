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
  ChevronDown,
  Menu,
  X,
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
import Loading from "./loading";
import { useState, useEffect } from "react";

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
    primary: "#3B82F6",
    secondary: "#06B6D4",
    light: "#EFF6FF",
    lighter: "#DBEAFE",
    gradient: "from-blue-500 to-cyan-500",
  },
}: AnalyticsSummaryProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
  const [showTable, setShowTable] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      setShowTable(window.innerWidth >= 640);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const COLORS = [
    "#3B82F6",
    "#2563EB",
    "#1D4ED8",
    "#0369A1",
    "#0EA5E9",
    "#06B6D4",
    "#0891B2",
    "#0E7490",
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

  const pieChartData = chartData.map((item) => ({
    name: item.name,
    value: item.total,
  }));

  const getTrend = () => {
    if (chartData.length < 2) return null;
    const sorted = [...chartData].sort((a, b) => a.name.localeCompare(b.name));
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
    return <Loading />;
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
        <div className={`relative bg-linear-to-r ${theme.gradient} p-4 sm:p-6`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 blur-2xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12 blur-2xl" />

          <CardHeader className="relative z-10 p-0">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                    <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="max-w-[180px] sm:max-w-none">
                    <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold text-white line-clamp-1">
                      {title}
                    </CardTitle>
                    <p className="text-xs sm:text-sm text-blue-100/80 line-clamp-2">
                      {description}
                    </p>
                  </div>
                </div>

                {/* Mobile menu button */}
                {isMobile && (
                  <div className="relative">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowPeriodDropdown(!showPeriodDropdown)}
                      className="bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30"
                    >
                      {showPeriodDropdown ? (
                        <X className="h-4 w-4" />
                      ) : (
                        <Menu className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                )}
              </div>

              {/* Period selector - Desktop */}
              <div className="hidden md:flex items-center justify-between">
                <Badge className="bg-white/20 backdrop-blur-sm border border-white/30 text-white">
                  <Zap className="w-3 h-3 mr-1" />
                  {periodType === "month" ? "Monthly View" : "Yearly View"}
                </Badge>

                <div className="flex items-center gap-2">
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

              {/* Period selector - Mobile dropdown */}
              {(showPeriodDropdown || !isMobile) && (
                <div className="md:hidden flex flex-col gap-3 pt-2 border-t border-white/20">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs">
                      <Zap className="w-3 h-3 mr-1" />
                      {periodType === "month" ? "Monthly" : "Yearly"}
                    </Badge>
                    <div className="flex gap-2">
                      <Button
                        variant={periodType === "month" ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          onPeriodChange("month");
                          setShowPeriodDropdown(false);
                        }}
                        className={`text-xs px-3 ${
                          periodType === "month"
                            ? "bg-white text-blue-600"
                            : "bg-white/20 text-white"
                        }`}
                      >
                        <Calendar className="h-3 w-3 mr-1" />
                        Month
                      </Button>
                      <Button
                        variant={periodType === "year" ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          onPeriodChange("year");
                          setShowPeriodDropdown(false);
                        }}
                        className={`text-xs px-3 ${
                          periodType === "year"
                            ? "bg-white text-blue-600"
                            : "bg-white/20 text-white"
                        }`}
                      >
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Year
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardHeader>
        </div>

        <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-linear-to-r from-blue-50/50 to-cyan-50/50 border border-blue-200/50 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-slate-600 flex items-center gap-2 truncate">
                    <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                    <span className="truncate">Total</span>
                  </p>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 mt-1 sm:mt-2 truncate">
                    {formatCurrency(totalSum)}
                  </p>
                  <p className="text-xs text-slate-500 mt-1 truncate">
                    Across {chartData.length} periods
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center shrink-0 ml-2">
                  <DollarSign className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-linear-to-r from-blue-50/50 to-cyan-50/50 border border-blue-200/50 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-slate-600 flex items-center gap-2 truncate">
                    <FileText className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                    <span className="truncate">Total Count</span>
                  </p>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 mt-1 sm:mt-2">
                    {totalCount}
                  </p>
                  <p className="text-xs text-slate-500 mt-1 truncate">
                    Avg: {(totalCount / chartData.length || 0).toFixed(1)}
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center shrink-0 ml-2">
                  <FileText className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-linear-to-r from-blue-50/50 to-cyan-50/50 border border-blue-200/50 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-slate-600 flex items-center gap-2 truncate">
                    <BarChartIcon className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                    <span className="truncate">Average</span>
                  </p>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 mt-1 sm:mt-2 truncate">
                    {formatCurrency(overallAverage)}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Per entry</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center shrink-0 ml-2">
                  <BarChartIcon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-linear-to-r from-blue-50/50 to-cyan-50/50 border border-blue-200/50 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-slate-600 flex items-center gap-2 truncate">
                    <Target className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                    <span className="truncate">Trend</span>
                  </p>
                  <div className="flex items-center gap-1 sm:gap-2 mt-1 sm:mt-2">
                    {trend?.isPositive ? (
                      <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 shrink-0" />
                    ) : (
                      <ArrowDown className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 shrink-0" />
                    )}
                    <p className="text-lg sm:text-xl font-bold text-slate-900 truncate">
                      {trend ? `${trend.percentage}%` : "N/A"}
                    </p>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 truncate">
                    {trend
                      ? `${trend.direction} over period`
                      : "Not enough data"}
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center shrink-0 ml-2">
                  <Target className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          {chartData.length === 0 ? (
            <div className="bg-linear-to-r from-slate-50/50 to-white border border-slate-200/50 rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-12 text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-linear-to-br from-blue-100 to-cyan-100 flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-blue-500" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-slate-700 mb-2 px-2">
                {emptyState.title}
              </h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto mb-4 sm:mb-6 px-4">
                {emptyState.description}
              </p>
              <Button
                onClick={emptyState.onButtonClick}
                className="rounded-full bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white text-sm sm:text-base px-4 sm:px-6"
              >
                {emptyState.buttonText}
              </Button>
            </div>
          ) : (
            <>
              {/* Charts Section */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
                {/* Bar Chart */}
                <div className="bg-linear-to-r from-blue-50/30 to-cyan-50/30 border border-blue-200/30 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 mb-4 sm:mb-6">
                    <h4 className="font-semibold text-slate-900 flex items-center gap-2 text-sm sm:text-base">
                      <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                      Total by Period
                    </h4>
                    <Badge className="text-xs sm:text-sm bg-linear-to-r from-blue-100 to-cyan-100 text-blue-700 border-blue-200/50 max-w-full truncate">
                      {maxPeriod
                        ? `Highest: ${maxPeriod.name}`
                        : "No data"}
                    </Badge>
                  </div>
                  <div className="h-48 sm:h-56 md:h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                        <XAxis
                          dataKey="name"
                          angle={isMobile ? -90 : -45}
                          textAnchor="end"
                          height={isMobile ? 80 : 60}
                          fontSize={isMobile ? 10 : 12}
                          stroke="#64748B"
                          tickLine={false}
                          interval={isMobile ? "preserveStartEnd" : 0}
                        />
                        <YAxis
                          stroke="#64748B"
                          tickLine={false}
                          fontSize={isMobile ? 10 : 12}
                          tickFormatter={(value) => {
                            const formatted = formatCurrency(value);
                            return isMobile && formatted.length > 8
                              ? formatted.slice(0, 5) + "..."
                              : formatted;
                          }}
                          width={isMobile ? 40 : 60}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(255, 255, 255, 0.9)",
                            backdropFilter: "blur(8px)",
                            border: "1px solid rgba(148, 163, 184, 0.3)",
                            borderRadius: "12px",
                            padding: "8px 12px",
                            fontSize: isMobile ? "12px" : "14px",
                            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                            maxWidth: isMobile ? "200px" : "none",
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
                          barSize={isMobile ? 20 : 30}
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
                <div className="bg-linear-to-r from-blue-50/30 to-cyan-50/30 border border-blue-200/30 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 mb-4 sm:mb-6">
                    <h4 className="font-semibold text-slate-900 flex items-center gap-2 text-sm sm:text-base">
                      <PieChart className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                      Distribution
                    </h4>
                    <Badge className="text-xs sm:text-sm bg-linear-to-r from-blue-100 to-cyan-100 text-blue-700 border-blue-200/50">
                      Total: {formatCurrency(totalSum)}
                    </Badge>
                  </div>
                  <div className="h-48 sm:h-56 md:h-64">
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
                            return isMobile && entry.value / totalSum < 0.05
                              ? ""
                              : `${percentage}%`;
                          }}
                          outerRadius={isMobile ? 60 : 70}
                          innerRadius={isMobile ? 30 : 40}
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
                            padding: "8px 12px",
                            fontSize: isMobile ? "12px" : "14px",
                            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                            maxWidth: isMobile ? "200px" : "none",
                          }}
                          formatter={(value) => formatCurrency(Number(value))}
                        />
                        <Legend
                          verticalAlign="bottom"
                          height={isMobile ? 48 : 36}
                          fontSize={isMobile ? 10 : 12}
                          formatter={(value) => (
                            <span className="text-xs text-slate-700 truncate block max-w-[80px] sm:max-w-none">
                              {value}
                            </span>
                          )}
                          wrapperStyle={{
                            paddingTop: isMobile ? "10px" : "0",
                          }}
                        />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Detailed Table - Mobile toggle */}
              <div className="sm:hidden">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowTable(!showTable)}
                  className="w-full justify-between mb-3"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Detailed Breakdown
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      showTable ? "rotate-180" : ""
                    }`}
                  />
                </Button>
              </div>

              {/* Detailed Table */}
              {(showTable || !isMobile) && (
                <div className="bg-linear-to-r from-slate-50/50 to-white border border-slate-200/50 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                  <div className="hidden sm:flex items-center justify-between mb-4 sm:mb-6">
                    <h4 className="font-semibold text-slate-900 flex items-center gap-2 text-sm sm:text-base">
                      <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                      Detailed Period Breakdown
                    </h4>
                    <div className="hidden sm:flex items-center gap-2">
                      <Badge className="text-xs sm:text-sm bg-linear-to-r from-blue-100 to-cyan-100 text-blue-700 border-blue-200/50">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Max: {maxPeriod?.name}
                      </Badge>
                      <Badge className="text-xs sm:text-sm bg-linear-to-r from-blue-100 to-cyan-100 text-blue-700 border-blue-200/50">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Min: {minPeriod?.name}
                      </Badge>
                    </div>
                  </div>

                  {/* Mobile badges */}
                  <div className="sm:hidden flex flex-wrap gap-2 mb-4">
                    <Badge className="text-xs bg-linear-to-r from-blue-100 to-cyan-100 text-blue-700 border-blue-200/50">
                      Max: {maxPeriod?.name}
                    </Badge>
                    <Badge className="text-xs bg-linear-to-r from-blue-100 to-cyan-100 text-blue-700 border-blue-200/50">
                      Min: {minPeriod?.name}
                    </Badge>
                  </div>

                  <div className="overflow-x-auto -mx-4 sm:mx-0">
                    <table className="w-full text-xs sm:text-sm min-w-[500px] sm:min-w-0">
                      <thead>
                        <tr className="border-b border-slate-200/50">
                          <th className="text-left py-2 px-3 sm:py-3 sm:px-4 font-semibold text-slate-700 bg-linear-to-r from-slate-50 to-slate-100/50 rounded-l-lg">
                            Period
                          </th>
                          <th className="text-left py-2 px-3 sm:py-3 sm:px-4 font-semibold text-slate-700 bg-linear-to-r from-slate-50 to-slate-100/50">
                            Total
                          </th>
                          <th className="text-left py-2 px-3 sm:py-3 sm:px-4 font-semibold text-slate-700 bg-linear-to-r from-slate-50 to-slate-100/50">
                            Count
                          </th>
                          <th className="text-left py-2 px-3 sm:py-3 sm:px-4 font-semibold text-slate-700 bg-linear-to-r from-slate-50 to-slate-100/50 rounded-r-lg">
                            Average
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {chartData.map((item, index) => (
                          <tr
                            key={item.name}
                            className="border-b border-slate-100/50 last:border-0 hover:bg-slate-50/50 transition-colors duration-200"
                          >
                            <td className="py-2 px-3 sm:py-3 sm:px-4">
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-2 h-2 sm:w-3 sm:h-3 rounded-full shrink-0"
                                  style={{
                                    backgroundColor:
                                      COLORS[index % COLORS.length],
                                  }}
                                />
                                <span className="font-medium text-slate-900 truncate max-w-[80px] sm:max-w-none">
                                  {item.name}
                                </span>
                              </div>
                            </td>
                            <td className="py-2 px-3 sm:py-3 sm:px-4">
                              <div className="font-bold text-slate-900 truncate">
                                {formatCurrency(item.total)}
                              </div>
                              <div className="text-xs text-slate-500">
                                {totalSum > 0
                                  ? ((item.total / totalSum) * 100).toFixed(1)
                                  : 0}
                                %
                              </div>
                            </td>
                            <td className="py-2 px-3 sm:py-3 sm:px-4">
                              <div className="font-medium text-slate-900">
                                {item.count}
                              </div>
                              <div className="text-xs text-slate-500">
                                {totalCount > 0
                                  ? ((item.count / totalCount) * 100).toFixed(1)
                                  : 0}
                                %
                              </div>
                            </td>
                            <td className="py-2 px-3 sm:py-3 sm:px-4">
                              <div className="font-medium text-slate-900 truncate">
                                {formatCurrency(item.average)}
                              </div>
                              <div className="text-xs text-slate-500">
                                {overallAverage > 0
                                  ? `${((item.average / overallAverage) * 100).toFixed(1)}%`
                                  : "N/A"}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </div>
    </div>
  );
}