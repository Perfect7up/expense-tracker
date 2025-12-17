"use client";

import { Button } from "@/app/core/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/app/core/components/ui/card";
import {
  RefreshCw,
  Plus,
  ArrowRight,
  Bell,
} from "lucide-react";

import { BackgroundEffects } from "@/app/core/components/shared/layout";

import { useCurrentUser } from "./hooks/use-current-user";
import { useDashboardRefresh } from "./hooks/use-dashboard-refresh";
import { ExpensePieChart, IncomeExpenseBarChart, KpiCard, MonthlyTrendChart, WelcomeMessage } from "./components";

export default function DashboardPage() {
  const { data: user, isLoading } = useCurrentUser();
  const { refreshDashboard } = useDashboardRefresh();

  return (
    <div className="relative min-h-screen px-3 sm:px-4 py-4 sm:py-6 md:py-8 overflow-x-hidden">
      <BackgroundEffects />
      <div className="absolute inset-0 bg-linear-to-br from-blue-50/30 via-transparent to-cyan-50/20" />
      
      {/* Mobile Header Actions */}
      <div className="block lg:hidden fixed top-4 right-4 z-20">
        <Button
          size="icon"
          variant="outline"
          className="rounded-full bg-white/80 backdrop-blur-sm"
          onClick={refreshDashboard}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      <div className="container mx-auto relative z-10 max-w-7xl">
        {/* Welcome Section */}
        <div className="mb-6 sm:mb-8">
          <WelcomeMessage userName={user?.name} isLoading={isLoading} />
        </div>

        {/* KPI Cards */}
        <div className="mb-6 sm:mb-8">
          <KpiCard />
        </div>

        {/* Main Analytics Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200/50 shadow-lg mb-6 sm:mb-8">
          {/* Header with Title and Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
            <div className="w-full">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Financial Analytics
              </h2>
              <p className="text-sm sm:text-base text-slate-500 mt-1">
                Complete overview of your income, expenses, and trends
              </p>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
              {/* Mobile Add Transaction Button */}
              <Button
                size="icon"
                className="rounded-full bg-linear-to-r from-blue-500 to-cyan-500 text-white sm:hidden"
              >
                <Plus className="h-4 w-4" />
              </Button>

              {/* Desktop Refresh Button */}
              <Button
                onClick={refreshDashboard}
                variant="outline"
                className="hidden sm:flex rounded-full"
                size="sm"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>

              {/* Desktop Add Transaction Button */}
              <Button 
                className="hidden sm:flex rounded-full bg-linear-to-r from-blue-500 to-cyan-500 text-white px-4 sm:px-6 group"
                size="sm"
              >
                <Plus className="mr-2 h-4 w-4" />
                <span className="hidden xs:inline">Add Transaction</span>
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
            {/* Expense Distribution Card - REMOVED THE WRAPPER DIV */}
            <div className="lg:col-span-2">
              <ExpensePieChart />
            </div>

            {/* Income vs Expense Card */}
            <Card className="h-full">
              <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
                <CardTitle className="text-lg sm:text-xl">Income vs Expense</CardTitle>
                <CardDescription className="text-sm sm:text-base">Monthly</CardDescription>
              </CardHeader>
              <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6 h-[calc(100%-80px)]">
                <IncomeExpenseBarChart />
              </CardContent>
            </Card>
          </div>

          {/* Financial Trends Card */}
          <Card>
            <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
              <CardTitle className="text-lg sm:text-xl">Financial Trends</CardTitle>
              <CardDescription className="text-sm sm:text-base">Over time</CardDescription>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6 h-[350px] sm:h-[400px]">
              <MonthlyTrendChart />
            </CardContent>
          </Card>
        </div>

        {/* Notification Banner */}
        <div className="bg-linear-to-r from-blue-50/50 to-cyan-50/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 border">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Bell className="text-blue-500 h-4 w-4 sm:h-5 sm:w-5" />
              <p className="text-xs sm:text-sm text-slate-600">
                Dashboard auto-updates with new data
              </p>
            </div>

            <Button 
              onClick={refreshDashboard} 
              variant="outline" 
              size="sm"
              className="w-full sm:w-auto"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}