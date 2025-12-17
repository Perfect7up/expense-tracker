"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/app/core/components/ui/button";
import { Badge } from "@/app/core/components/ui/badge";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/app/core/components/ui/card";
import { RefreshCw, Plus, Settings, TrendingUp, ArrowRight, Sparkles, Target, Bell } from "lucide-react";

import { KpiCard } from "./components/kpi-card";
import { ExpensePieChart } from "./components/expense-pie-chart";
import IncomeExpenseBarChart from "./components/income-expense-bar-chart";
import MonthlyTrendChart from "./components/monthly-trend-chart";
import { BackgroundEffects } from "@/app/core/components/shared/layout";
import { WelcomeMessage } from "./components/welcome-message";

type User = {
  id: string;
  name: string | null;
  email: string;
};

export default function DashboardPage() {
  const queryClient = useQueryClient();

  // Fetch current user
  const { data: user, isLoading: isUserLoading } = useQuery<User>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const res = await fetch("/api/user/me");
      if (!res.ok) throw new Error("Failed to fetch user");
      return res.json() as Promise<User>;
    },
  });

  const handleRefresh = () => {
    ["kpi", "transactions", "expenses", "incomes"].forEach((key) =>
      queryClient.invalidateQueries({ queryKey: [key] })
    );
  };

  return (
    <div className="relative min-h-screen px-4 py-8 overflow-hidden">
      <BackgroundEffects />
      
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-cyan-50/20" />
      
      <div className="container mx-auto relative z-10">
        {/* Replace PageHeader with WelcomeMessage */}
        <div className="mb-8">
          <WelcomeMessage 
            userName={user?.name} 
            isLoading={isUserLoading} 
          />
        </div>

        {/* KPI Cards */}
        <div className="mb-8">
          <KpiCard />
        </div>

        {/* Main Content Area */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 shadow-lg mb-8">
          {/* Content Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Financial Analytics
              </h2>
              <p className="text-slate-500 mt-1">
                Complete overview of your income, expenses, and financial trends
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={handleRefresh}
                variant="outline"
                className="rounded-full border-blue-200/50 text-blue-600 hover:bg-blue-50/80 hover:border-blue-300"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Button
                className="rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 group"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Transaction
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 bg-gradient-to-br from-blue-50/50 to-cyan-50/30 border border-blue-100/50 shadow-md">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-400 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold text-slate-900">
                        Expense Distribution
                      </CardTitle>
                      <CardDescription className="text-slate-500">
                        Breakdown by category this month
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ExpensePieChart />
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-emerald-50/50 to-green-50/30 border border-emerald-100/50 shadow-md">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-400 flex items-center justify-center">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold text-slate-900">
                        Income vs Expense
                      </CardTitle>
                      <CardDescription className="text-slate-500">
                        Monthly comparison
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <IncomeExpenseBarChart />
                </CardContent>
              </Card>
            </div>

            {/* Trends Chart */}
            <Card className="bg-gradient-to-br from-blue-50/50 to-cyan-50/30 border border-blue-100/50 shadow-md">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold text-slate-900">
                      Financial Trends
                    </CardTitle>
                    <CardDescription className="text-slate-500">
                      Income, Expense & Balance trends over time
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="h-[350px]">
                <MonthlyTrendChart />
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/50 rounded-xl p-4 border border-slate-200/50">
                <p className="text-xs text-slate-500 mb-1">Data Refresh</p>
                <p className="font-bold text-slate-900">Every 5 min</p>
              </div>
              <div className="bg-white/50 rounded-xl p-4 border border-slate-200/50">
                <p className="text-xs text-slate-500 mb-1">Last Updated</p>
                <p className="font-bold text-slate-900">Just now</p>
              </div>
              <div className="bg-white/50 rounded-xl p-4 border border-slate-200/50">
                <p className="text-xs text-slate-500 mb-1">AI Insights</p>
                <p className="font-bold text-slate-900">Active</p>
              </div>
              <div className="bg-white/50 rounded-xl p-4 border border-slate-200/50">
                <p className="text-xs text-slate-500 mb-1">Data Points</p>
                <p className="font-bold text-slate-900">1,200+</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Footer */}
        <div className="bg-gradient-to-r from-blue-50/50 to-cyan-50/30 rounded-2xl p-6 border border-blue-100/50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-slate-900">Stay Updated</p>
                <p className="text-sm text-slate-500">
                  Your dashboard updates automatically with new transactions
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleRefresh}
                variant="outline"
                className="rounded-full border-blue-200/50 text-blue-600 hover:bg-blue-50/80 hover:border-blue-300"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Now
              </Button>
              <Button
                className="rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6"
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}