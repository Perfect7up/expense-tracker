"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useDashboardStore } from "./store/dashboard-store";
import { Button } from "@/app/core/components/ui/button";
import { Badge } from "@/app/core/components/ui/badge";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/app/core/components/ui/card";
import { Tabs, TabsContent } from "@/app/core/components/ui/tabs";
import { RefreshCw, Plus, Bell, Settings } from "lucide-react";

import { KpiCard } from "./components/kpi-card";
import { ExpensePieChart } from "./components/expense-pie-chart";
import IncomeExpenseBarChart from "./components/income-expense-bar-chart";
import MonthlyTrendChart from "./components/monthly-trend-chart";

export default function DashboardPage() {
  const queryClient = useQueryClient();
  const { activeTab, setActiveTab } = useDashboardStore();

  const handleRefresh = () => {
    ["kpi", "transactions", "expenses", "incomes"].forEach((key) =>
      queryClient.invalidateQueries({ queryKey: [key] })
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
              Dashboard
            </h1>
            <Badge
              variant="outline"
              className="border-green-200 text-green-700 bg-green-50"
            >
              <div className="w-2 h-2 rounded-full bg-green-500 mr-1.5"></div>
              Live Updates
            </Badge>
          </div>
          <p className="text-slate-600">
            Track your finances in real-time with AI-powered insights
          </p>
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto">
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 flex-1 lg:flex-none"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          <Button
            className="flex items-center gap-2 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg shadow-blue-500/30 flex-1 lg:flex-none"
            size="sm"
          >
            <Plus className="w-4 h-4" />
            Add Transaction
          </Button>
          <Button variant="ghost" size="icon" className="hidden lg:flex">
            <Bell className="w-5 h-5 text-slate-600" />
          </Button>
          <Button variant="ghost" size="icon" className="hidden lg:flex">
            <Settings className="w-5 h-5 text-slate-600" />
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <KpiCard />

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 border-slate-200/50 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-slate-900">
                  Expense Distribution
                </CardTitle>
                <CardDescription className="text-slate-500">
                  Breakdown by category this month
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ExpensePieChart />
              </CardContent>
            </Card>

            <Card className="border-slate-200/50 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-slate-900">
                  Income vs Expense
                </CardTitle>
                <CardDescription className="text-slate-500">
                  Monthly comparison
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <IncomeExpenseBarChart />
              </CardContent>
            </Card>
          </div>

          <Card className="border-slate-200/50 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-slate-900">
                Financial Trends
              </CardTitle>
              <CardDescription className="text-slate-500">
                Income, Expense & Balance trends over time
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[350px]">
              <MonthlyTrendChart />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Analytics</CardTitle>
              <CardDescription>
                Detailed financial analytics coming soon
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center text-slate-500">
                Analytics features are under development
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Category Management</CardTitle>
              <CardDescription>
                Manage your expense and income categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center text-slate-500">
                Category management coming soon
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
