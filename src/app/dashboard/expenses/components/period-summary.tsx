"use client";

import { useState } from "react";
import {
  Card,
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
  ChevronDown,
  Activity,
  BarChart as BarChartIcon
} from "lucide-react";
import { useExpenseSummary } from "@/app/core/hooks/use-expense-aggregate";
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
  AreaChart,
  Area,
} from "recharts";

export function PeriodSummary() {
  const [periodType, setPeriodType] = useState<"month" | "year">("month");
  const { data: summaryData, isLoading } = useExpenseSummary({
    period: periodType,
    limit: periodType === "month" ? 12 : 5,
  });

  const COLORS = [
    "#3B82F6", // blue-500
    "#06B6D4", // cyan-500
    "#8B5CF6", // violet-500
    "#EC4899", // pink-500
    "#10B981", // emerald-500
    "#F59E0B", // amber-500
    "#EF4444", // red-500
    "#6366F1", // indigo-500
  ];

  const getFormattedData = () => {
    if (!summaryData) return [];

    return summaryData.map((item) => ({
      name: item.period,
      total: item.totalAmount,
      count: item.expenseCount,
      average: item.averageAmount,
    }));
  };

  const chartData = getFormattedData();

  // Calculate statistics for summary
  const totalSum = chartData.reduce((sum, item) => sum + item.total, 0);
  const totalCount = chartData.reduce((sum, item) => sum + item.count, 0);
  const overallAverage = totalCount > 0 ? totalSum / totalCount : 0;
  const maxPeriod = chartData.length > 0 
    ? chartData.reduce((max, item) => item.total > max.total ? item : max)
    : null;
  const minPeriod = chartData.length > 0
    ? chartData.reduce((min, item) => item.total < min.total ? item : min)
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
      direction: change > 0 ? "increase" : "decrease"
    };
  };

  const trend = getTrend();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center animate-pulse">
          <BarChart3 className="w-8 h-8 text-blue-500" />
        </div>
        <p className="text-lg text-slate-700 font-medium">Loading analytics...</p>
        <p className="text-sm text-slate-500">Analyzing your spending patterns</p>
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
        <div className="relative bg-gradient-to-r from-blue-500 to-cyan-500 p-6">
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
                    Expense Analytics
                  </CardTitle>
                  <p className="text-sm text-blue-100/80">
                    Advanced insights and spending patterns
                  </p>
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
                  onClick={() => setPeriodType("month")}
                  className={`rounded-lg ${periodType === "month" 
                    ? 'bg-white text-blue-600 hover:bg-white/90' 
                    : 'bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30'}`}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Monthly
                </Button>
                <Button
                  variant={periodType === "year" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPeriodType("year")}
                  className={`rounded-lg ${periodType === "year" 
                    ? 'bg-white text-blue-600 hover:bg-white/90' 
                    : 'bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30'}`}
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
            <div className="bg-gradient-to-r from-blue-50/50 to-cyan-50/50 border border-blue-200/50 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" /> Total Spent
                  </p>
                  <p className="text-2xl font-bold text-slate-900 mt-2">
                    ${totalSum.toFixed(2)}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Across {chartData.length} periods
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50/50 to-pink-50/50 border border-purple-200/50 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Total Expenses
                  </p>
                  <p className="text-2xl font-bold text-slate-900 mt-2">
                    {totalCount}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Average per period: {(totalCount / chartData.length).toFixed(1)}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50/50 to-emerald-50/50 border border-green-200/50 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 flex items-center gap-2">
                    <BarChartIcon className="w-4 h-4" /> Average Expense
                  </p>
                  <p className="text-2xl font-bold text-slate-900 mt-2">
                    ${overallAverage.toFixed(2)}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Per transaction
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                  <BarChartIcon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-amber-50/50 to-orange-50/50 border border-amber-200/50 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 flex items-center gap-2">
                    <Target className="w-4 h-4" /> Trend
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <TrendingUp className={`w-5 h-5 ${trend?.isPositive ? 'text-green-500' : 'text-red-500'}`} />
                    <p className="text-xl font-bold text-slate-900">
                      {trend ? `${trend.percentage}%` : 'N/A'}
                    </p>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {trend ? `${trend.direction} over period` : 'Not enough data'}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          {chartData.length === 0 ? (
            <div className="bg-gradient-to-r from-slate-50/50 to-white border border-slate-200/50 rounded-2xl p-12 text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mx-auto mb-6">
                <BarChart3 className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-700 mb-2">
                No data available for this period
              </h3>
              <p className="text-slate-500 max-w-md mx-auto mb-6">
                Start tracking your expenses to see detailed analytics and trends
              </p>
              <Button className="rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white">
                Track Your First Expense
              </Button>
            </div>
          ) : (
            <>
              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Bar Chart */}
                <div className="bg-gradient-to-r from-blue-50/30 to-cyan-50/30 border border-blue-200/30 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" />
                      Total Expenses by Period
                    </h4>
                    <Badge className="bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border-blue-200/50">
                      {maxPeriod ? `Highest: ${maxPeriod.name} ($${maxPeriod.total.toFixed(2)})` : 'No data'}
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
                          tickFormatter={(value) => `$${value.toLocaleString()}`}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(8px)',
                            border: '1px solid rgba(148, 163, 184, 0.3)',
                            borderRadius: '12px',
                            padding: '12px',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                          }}
                          formatter={(value) => [
                            `$${Number(value).toFixed(2)}`,
                            "Total",
                          ]}
                          labelFormatter={(label) => `Period: ${label}`}
                        />
                        <Bar 
                          dataKey="total" 
                          fill="url(#colorGradient)" 
                          name="Total Amount"
                          radius={[4, 4, 0, 0]}
                        />
                        <defs>
                          <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.8} />
                            <stop offset="100%" stopColor="#06B6D4" stopOpacity={0.8} />
                          </linearGradient>
                        </defs>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Pie Chart */}
                <div className="bg-gradient-to-r from-purple-50/30 to-pink-50/30 border border-purple-200/30 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                      <PieChart className="w-4 h-4" />
                      Distribution by Period
                    </h4>
                    <Badge className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-200/50">
                      Total: ${totalSum.toFixed(2)}
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
                            const percentage = ((entry.value / totalSum) * 100).toFixed(1);
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
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(8px)',
                            border: '1px solid rgba(148, 163, 184, 0.3)',
                            borderRadius: '12px',
                            padding: '12px',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                          }}
                          formatter={(value) => `$${Number(value).toFixed(2)}`}
                        />
                        <Legend 
                          verticalAlign="bottom" 
                          height={36}
                          formatter={(value) => (
                            <span className="text-xs text-slate-700">{value}</span>
                          )}
                        />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Detailed Table */}
              <div className="bg-gradient-to-r from-slate-50/50 to-white border border-slate-200/50 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Detailed Period Breakdown
                  </h4>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-200/50">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Max: {maxPeriod?.name} (${maxPeriod?.total.toFixed(2)})
                    </Badge>
                    <Badge className="bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 border-amber-200/50">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Min: {minPeriod?.name} (${minPeriod?.total.toFixed(2)})
                    </Badge>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200/50">
                        <th className="text-left py-3 px-4 font-semibold text-slate-700 bg-gradient-to-r from-slate-50 to-slate-100/50 rounded-l-lg">
                          Period
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-700 bg-gradient-to-r from-slate-50 to-slate-100/50">
                          Total Amount
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-700 bg-gradient-to-r from-slate-50 to-slate-100/50">
                          Expense Count
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-700 bg-gradient-to-r from-slate-50 to-slate-100/50 rounded-r-lg">
                          Average/Expense
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
                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                              />
                              <span className="font-medium text-slate-900">{item.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-900">
                              ${item.total.toFixed(2)}
                            </div>
                            <div className="text-xs text-slate-500">
                              {((item.total / totalSum) * 100).toFixed(1)}% of total
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-medium text-slate-900">
                              {item.count}
                            </div>
                            <div className="text-xs text-slate-500">
                              {totalCount > 0 ? ((item.count / totalCount) * 100).toFixed(1) : 0}% of total
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-medium text-slate-900">
                              ${item.average.toFixed(2)}
                            </div>
                            <div className="text-xs text-slate-500">
                              {overallAverage > 0 
                                ? `${((item.average / overallAverage) * 100).toFixed(1)}% of avg`
                                : 'N/A'
                              }
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