"use client";

import { useState, useCallback } from "react";
import { IncomeList } from "./components/income-list";
import { MonthlyIncomes } from "./components/monthly-incomes";
import { IncomeForm } from "./components/income-form";
import { IncomeCalendarView } from "./components/income-calendar-view";
import { useIncomeStats } from "@/app/core/hooks/use-income-stats";
import { Button } from "@/app/core/components/ui/button";
import {
  Plus,
  Target,
  ArrowRight,
  List,
  Calendar,
  PieChart,
  BarChart3,
  TrendingUp,
  ChevronRight,
  Clock,
  Sparkles,
  CheckCircle,
  CalendarDays,
} from "lucide-react";
import { IncomeSummary } from "./components/income-summary";
import { cn } from "@/app/core/lib/utils";

// Import shared components
import {
  BackgroundEffects,
  PageHeader,
  StatsGrid,
  SelectedDateInfo,
} from "@/app/core/components/shared/layout";

export default function IncomePage() {
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<
    Date | undefined
  >(new Date());
  const [dailyIncomes, setDailyIncomes] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("list");
  const [monthlyViewMonth, setMonthlyViewMonth] = useState<Date | undefined>(
    new Date()
  );
  const [timeFilter, setTimeFilter] = useState("month");

  const {
    currentMonthTotal,
    lastMonthTotal,
    currentYearTotal,
    averagePerMonth,
    isLoading: statsLoading,
  } = useIncomeStats();

  const handleDateSelect = useCallback((date: Date | undefined) => {
    setSelectedCalendarDate(date);
  }, []);

  const handleSetDailyIncomes = useCallback((incomes: any[]) => {
    setDailyIncomes(incomes);
  }, []);

  const handleShowMonthlyFromCalendar = useCallback(() => {
    if (selectedCalendarDate) {
      setMonthlyViewMonth(selectedCalendarDate);
      setActiveTab("monthly");
    }
  }, [selectedCalendarDate]);

  const percentageChange =
    lastMonthTotal > 0
      ? (((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100).toFixed(
          1
        )
      : "0";

  const stats = [
    {
      title: "This Month",
      value: currentMonthTotal,
      description: "",
      icon: "calendarDays" as const,
      iconBg: "bg-linear-to-br from-blue-500 to-cyan-400",
      loading: statsLoading,
      percentageChange: percentageChange,
    },
    {
      title: "Last Month",
      value: lastMonthTotal,
      description: "Previous period total",
      icon: "calendar" as const,
      iconBg: "bg-linear-to-br from-slate-600 to-slate-400",
      loading: statsLoading,
    },
    {
      title: "This Year",
      value: currentYearTotal,
      description: "Year-to-date total",
      icon: "trendingUp" as const,
      iconBg: "bg-linear-to-br from-green-500 to-emerald-400",
      loading: statsLoading,
    },
    {
      title: "Monthly Avg",
      value: averagePerMonth,
      description: "Average earnings",
      icon: "barChart" as const,
      iconBg: "bg-linear-to-br from-purple-500 to-pink-400",
      loading: statsLoading,
    },
  ];

  const tabs = [
    {
      value: "list",
      icon: <List className="h-4 w-4" />,
      label: "All Incomes",
      color: "from-blue-500 to-cyan-400",
    },
    {
      value: "daily",
      icon: <Calendar className="h-4 w-4" />,
      label: "Daily View",
      color: "from-emerald-500 to-green-400",
    },
    {
      value: "monthly",
      icon: <PieChart className="h-4 w-4" />,
      label: "Monthly View",
      color: "from-purple-500 to-pink-400",
    },
    {
      value: "analytics",
      icon: <BarChart3 className="h-4 w-4" />,
      label: "Analytics",
      color: "from-orange-500 to-amber-400",
    },
  ];

  const timeFilters = [
    { value: "week", label: "Week" },
    { value: "month", label: "Month" },
    { value: "quarter", label: "Quarter" },
    { value: "year", label: "Year" },
    { value: "all", label: "All Time" },
  ];

  const instructions = [
    { text: "Click any date to see incomes for that day", icon: Calendar },
    { text: "Use arrow buttons to navigate between months", icon: CalendarDays },
    { text: "Click 'Show Month' to view monthly incomes", icon: PieChart },
    { text: "Future dates are disabled for entry", icon: Clock },
  ];

  return (
    <div className="relative min-h-screen px-4 py-8 overflow-hidden">
      <BackgroundEffects />

      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-cyan-50/20" />

      <div className="container mx-auto relative z-10">
        <PageHeader
          title="INCOME TRACKER"
          description="Track, analyze, and optimize your income with AI-powered insights and real-time financial intelligence."
          icon={<Target className="w-4 h-4" />}
          tagline="Smart Income Management"
        >
          <IncomeForm>
            <Button
              size="lg"
              className="rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 h-12 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 group"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Income
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </IncomeForm>
        </PageHeader>

        {/* Stats Cards */}
        <div className="mb-8">
          <StatsGrid stats={stats} />
        </div>

        {/* Enhanced Tabs Container */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-slate-200/50 shadow-lg mb-8">
          {/* Tab Navigation and Time Filter */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.value;
                return (
                  <button
                    key={tab.value}
                    onClick={() => setActiveTab(tab.value)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 group",
                      isActive
                        ? `bg-gradient-to-r ${tab.color} text-white shadow-md`
                        : "text-slate-700 hover:bg-slate-100/50 hover:shadow-sm border border-slate-200/50"
                    )}
                  >
                    <div className={cn(
                      "p-1.5 rounded-lg",
                      isActive
                        ? "bg-white/20"
                        : "bg-gradient-to-br from-blue-50 to-cyan-50"
                    )}>
                      {tab.icon}
                    </div>
                    <span className="font-medium">{tab.label}</span>
                    {isActive && (
                      <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-2">
              {timeFilters.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setTimeFilter(filter.value)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-sm font-medium transition-all flex-shrink-0",
                    timeFilter === filter.value
                      ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md shadow-blue-500/20"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/50 border border-slate-200/50"
                  )}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content Area */}
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  {tabs.find(t => t.value === activeTab)?.label || "Incomes"}
                </h2>
                <p className="text-slate-500 mt-1">
                  {activeTab === "list" && "View and manage all your income sources"}
                  {activeTab === "daily" && "Daily income tracking and calendar view"}
                  {activeTab === "monthly" && "Monthly income analysis and trends"}
                  {activeTab === "analytics" && "Detailed analytics and insights"}
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Calendar className="w-4 h-4" />
                <span>Current period: {timeFilters.find(f => f.value === timeFilter)?.label}</span>
              </div>
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
              {activeTab === "list" && (
                <div className="rounded-xl overflow-hidden">
                  <IncomeList />
                </div>
              )}

              {activeTab === "daily" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Calendar View */}
                  <div className="lg:col-span-2">
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50/50 rounded-2xl p-6 border border-blue-100/50 h-full">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900">Calendar View</h3>
                          <p className="text-sm text-slate-500">Select dates to view income</p>
                        </div>
                      </div>
                      <IncomeCalendarView
                        onDateSelect={handleDateSelect}
                        onShowMonthly={handleShowMonthlyFromCalendar}
                        setDailyIncomes={handleSetDailyIncomes}
                        setSelectedDate={handleDateSelect}
                      />
                    </div>
                  </div>

                  {/* Sidebar with Instructions and Selected Date */}
                  <div className="space-y-6">
                    {/* Quick Tips */}
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50/30 rounded-2xl p-5 border border-purple-100/50">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-400 flex items-center justify-center">
                          <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="font-bold text-slate-900">Quick Tips</h3>
                      </div>
                      <div className="space-y-3">
                        {instructions.map((instruction, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-slate-600">{instruction.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Selected Date Info */}
                    {selectedCalendarDate && (
                      <div className="bg-gradient-to-br from-emerald-50 to-green-50/30 rounded-2xl p-5 border border-emerald-100/50">
                        <SelectedDateInfo
                          date={selectedCalendarDate}
                          dailyItems={dailyIncomes}
                          itemType="income"
                          onShowMonthly={handleShowMonthlyFromCalendar}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "monthly" && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50/50 rounded-2xl p-6 border border-blue-100/50">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                        <PieChart className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900">Monthly Income Analysis</h3>
                        <p className="text-sm text-slate-500">Earnings trends and breakdown</p>
                      </div>
                    </div>
                    <MonthlyIncomes selectedDate={monthlyViewMonth} />
                  </div>
                </div>
              )}

              {activeTab === "analytics" && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50/50 rounded-2xl p-6 border border-blue-100/50">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center">
                        <BarChart3 className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900">Income Analytics</h3>
                        <p className="text-sm text-slate-500">Detailed insights and trends</p>
                      </div>
                    </div>
                    <IncomeSummary />
                  </div>

                  {/* Additional Analytics Insights */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-emerald-50 to-green-50/30 rounded-2xl p-5 border border-emerald-100/50">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center">
                          <TrendingUp className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900">Earnings Trends</h3>
                          <p className="text-sm text-slate-500">Monthly comparisons</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">This Month vs Last</span>
                          <span className={`font-bold ${percentageChange.startsWith('-') ? 'text-red-600' : 'text-emerald-600'}`}>
                            {percentageChange.startsWith('-') ? '' : '+'}{percentageChange}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">Monthly Average</span>
                          <span className="font-bold text-slate-900">{averagePerMonth}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-pink-50/30 rounded-2xl p-5 border border-purple-100/50">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                          <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900">AI Insights</h3>
                          <p className="text-sm text-slate-500">Smart recommendations</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-slate-600">
                          {currentMonthTotal > lastMonthTotal
                            ? "Great job increasing your income this month!"
                            : "Consider exploring additional income sources"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions Footer */}
        <div className="bg-gradient-to-r from-blue-50/50 to-cyan-50/30 rounded-2xl p-6 border border-blue-100/50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-slate-900">Track Your Earnings</p>
                <p className="text-sm text-slate-500">
                  Monitor your income growth and financial progress
                </p>
              </div>
            </div>
            <IncomeForm>
              <Button
                className="rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Income
              </Button>
            </IncomeForm>
          </div>
        </div>
      </div>
    </div>
  );
}