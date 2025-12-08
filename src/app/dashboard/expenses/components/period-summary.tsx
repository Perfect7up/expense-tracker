"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/core/components/ui/card";
import { Button } from "@/app/core/components/ui/button";
import { BarChart3, Calendar, PieChart, TrendingUp } from "lucide-react";
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
} from "recharts";

export function PeriodSummary() {
  const [periodType, setPeriodType] = useState<"month" | "year">("month");
  const { data: summaryData, isLoading } = useExpenseSummary({
    period: periodType,
    limit: periodType === "month" ? 12 : 5,
  });

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82CA9D",
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

  // Calculate total for pie chart
  const pieChartData = chartData.map((item) => ({
    name: item.name,
    value: item.total,
  }));

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Expense Trends
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant={periodType === "month" ? "default" : "outline"}
              size="sm"
              onClick={() => setPeriodType("month")}
              className="flex items-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              Monthly
            </Button>
            <Button
              variant={periodType === "year" ? "default" : "outline"}
              size="sm"
              onClick={() => setPeriodType("year")}
              className="flex items-center gap-2"
            >
              <TrendingUp className="h-4 w-4" />
              Yearly
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Loading chart data...</div>
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">
              No data available for this period
            </div>
          </div>
        ) : (
          <>
            {/* Bar Chart */}
            <div className="mb-8">
              <h4 className="text-sm font-medium mb-4">
                Total Expenses by Period
              </h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      height={60}
                      fontSize={12}
                    />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => [
                        `$${Number(value).toFixed(2)}`,
                        "Total",
                      ]}
                      labelFormatter={(label) => `Period: ${label}`}
                    />
                    <Bar dataKey="total" fill="#8884d8" name="Total Amount" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pie Chart */}
            <div>
              <h4 className="text-sm font-medium mb-4 flex items-center gap-2">
                <PieChart className="h-4 w-4" />
                Distribution by Period
              </h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) =>
                        `${entry.name}: $${entry.value.toFixed(2)}`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => `$${Number(value).toFixed(2)}`}
                    />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Summary Table */}
            <div className="mt-8 overflow-x-auto">
              <h4 className="text-sm font-medium mb-4">Detailed Breakdown</h4>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-medium">Period</th>
                    <th className="text-left py-2 font-medium">Total Amount</th>
                    <th className="text-left py-2 font-medium">
                      Expense Count
                    </th>
                    <th className="text-left py-2 font-medium">
                      Average/Expense
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {chartData.map((item) => (
                    <tr key={item.name} className="border-b hover:bg-gray-50">
                      <td className="py-2">{item.name}</td>
                      <td className="py-2 font-medium">
                        ${item.total.toFixed(2)}
                      </td>
                      <td className="py-2">{item.count}</td>
                      <td className="py-2">${item.average.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
