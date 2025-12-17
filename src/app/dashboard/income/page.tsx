"use client";

import { useState, useCallback } from "react";
import { IncomeList } from "./components/income-list";
import { MonthlyIncomes } from "./components/monthly-incomes";
import { IncomeForm } from "./components/income-form";
import { IncomeCalendarView } from "./components/income-calendar-view";
import { useIncomeStats } from "@/app/dashboard/income/hooks/use-income-stats";
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
  Clock,
  Sparkles,
  CheckCircle,
  CalendarDays,
} from "lucide-react";
import { IncomeSummary } from "./components/income-summary";
import { cn } from "@/app/core/lib/utils";

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
      iconBg: "bg-gradient-to-br from-blue-500 to-cyan-400",
      loading: statsLoading,
      percentageChange: percentageChange,
    },
    {
      title: "Last Month",
      value: lastMonthTotal,
      description: "Previous period total",
      icon: "calendar" as const,
      iconBg: "bg-gradient-to-br from-slate-600 to-slate-400",
      loading: statsLoading,
    },
    {
      title: "This Year",
      value: currentYearTotal,
      description: "Year-to-date total",
      icon: "trendingUp" as const,
      iconBg: "bg-gradient-to-br from-green-500 to-emerald-400",
      loading: statsLoading,
    },
    {
      title: "Monthly Avg",
      value: averagePerMonth,
      description: "Average earnings",
      icon: "barChart" as const,
      iconBg: "bg-gradient-to-br from-purple-500 to-pink-400",
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
    { text: "Click any date to see incomes", icon: Calendar },
    { text: "Use arrows to navigate months", icon: CalendarDays },
    { text: "Click 'Show Month' for details", icon: PieChart },
    { text: "Future dates are disabled", icon: Clock },
  ];

  return (
    <div className="relative min-h-screen px-2 sm:px-4 py-4 sm:py-6 md:py-8 overflow-x-hidden">
      <BackgroundEffects />

      <div className="absolute inset-0 bg-linear-to-br from-blue-50/30 via-transparent to-cyan-50/20" />

      <div className="container mx-auto relative z-10 px-0 sm:px-4 max-w-7xl">
        <PageHeader
          title="INCOME TRACKER"
          description="Track, analyze, and optimize your income with AI-powered insights and real-time financial intelligence."
          icon={<Target className="w-4 h-4 sm:w-5 sm:h-5" />}
          tagline="Smart Income Management"
        >
          <IncomeForm>
            <Button
              size="lg"
              className="w-full sm:w-auto rounded-full bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 h-10 sm:h-12 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 group text-sm sm:text-base"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Income
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </IncomeForm>
        </PageHeader>

        {/* Stats Cards */}
        <div className="mb-4 sm:mb-6 md:mb-8 px-2 sm:px-0">
          <StatsGrid stats={stats} />
        </div>

        {/* Enhanced Tabs Container */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl p-2 sm:p-4 md:p-6 border border-slate-200/50 shadow-lg mb-6 md:mb-8 mx-2 sm:mx-0">
          {/* Tab Navigation and Time Filter */}
          <div className="flex flex-col gap-4 mb-4 sm:mb-6">
            
            {/* TABS - Single Line Grid on Mobile */}
            <div className="grid grid-cols-4 gap-2 sm:gap-3 px-0 sm:px-6 md:px-8 lg:px-12">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.value;
                // Only show first word on mobile
                const oneWordLabel = tab.label.split(" ")[0]; 
                
                return (
                  <button
                    key={tab.value}
                    onClick={() => setActiveTab(tab.value)}
                    className={cn(
                      "flex flex-col items-center justify-center gap-1.5 sm:gap-3 p-2 sm:p-4",
                      "rounded-xl transition-all duration-300 relative min-w-0",
                      isActive
                        ? `bg-linear-to-r ${tab.color} text-white shadow-lg`
                        : "text-slate-700 hover:bg-slate-100/50 hover:shadow-sm border border-slate-200/50"
                    )}
                  >
                    <div className={cn(
                      "p-1.5 sm:p-2.5 rounded-lg",
                      isActive
                        ? "bg-white/20"
                        : "bg-linear-to-br from-blue-50 to-cyan-50"
                    )}>
                      {/* Control icon size */}
                      <div className="[&>svg]:w-4 [&>svg]:h-4 sm:[&>svg]:w-5 sm:[&>svg]:h-5">
                        {tab.icon}
                      </div>
                    </div>
                    {/* Label handling */}
                    <span className="font-medium text-[10px] sm:text-sm whitespace-nowrap w-full truncate text-center">
                      {oneWordLabel}
                    </span>
                    {/* Active Line */}
                    {isActive && (
                      <div className="absolute bottom-0 left-2 right-2 sm:left-4 sm:right-4 h-0.5 bg-white/50 rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Divider */}
            <div className="h-px bg-linear-to-r from-transparent via-slate-300 to-transparent" />

            {/* Time Filter & Info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1 sm:px-6 md:px-8 lg:px-12">
               <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 pl-1">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Period: {timeFilters.find(f => f.value === timeFilter)?.label}</span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {timeFilters.map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => setTimeFilter(filter.value)}
                    className={cn(
                      "px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs md:text-sm",
                      "font-medium transition-all shrink-0",
                      timeFilter === filter.value
                        ? "bg-linear-to-r from-blue-500 to-cyan-500 text-white shadow-md shadow-blue-500/20"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/50 border border-slate-200/50"
                    )}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tab Content Area */}
          <div className="space-y-4 sm:space-y-6">
            
            {/* Header for Tab Content - Hidden on very small screens to save space if needed, or kept for context */}
            <div className="hidden sm:flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  {tabs.find(t => t.value === activeTab)?.label || "Incomes"}
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  {activeTab === "list" && "View and manage all your income sources"}
                  {activeTab === "daily" && "Daily income tracking and calendar view"}
                  {activeTab === "monthly" && "Monthly income analysis and trends"}
                  {activeTab === "analytics" && "Detailed analytics and insights"}
                </p>
              </div>
            </div>

            {/* Active Content */}
            <div className="space-y-4 sm:space-y-6">
              {activeTab === "list" && (
                <div className="rounded-xl overflow-hidden">
                  <IncomeList />
                </div>
              )}

              {activeTab === "daily" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                  {/* Calendar View */}
                  <div className="lg:col-span-2">
                    <div className="bg-linear-to-br from-blue-50 to-cyan-50/50 rounded-xl sm:rounded-2xl p-3 sm:p-6 border border-blue-100/50 h-full">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-linear-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-sm sm:text-base">Calendar View</h3>
                          <p className="text-xs sm:text-sm text-slate-500">Select dates to view</p>
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

                  {/* Sidebar */}
                  <div className="space-y-4 sm:space-y-6">
                    {/* Quick Tips */}
                    <div className="bg-linear-to-br from-purple-50 to-pink-50/30 rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-purple-100/50">
                      <div className="flex items-center gap-2 mb-3 sm:mb-4">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-linear-to-br from-purple-500 to-pink-400 flex items-center justify-center">
                          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </div>
                        <h3 className="font-bold text-slate-900 text-sm sm:text-base">Quick Tips</h3>
                      </div>
                      <div className="space-y-2 sm:space-y-3">
                        {instructions.map((instruction, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-500 mt-0.5 shrink-0" />
                            <p className="text-xs sm:text-sm text-slate-600">{instruction.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Selected Date Info */}
                    {selectedCalendarDate && (
                      <div className="bg-linear-to-br from-emerald-50 to-green-50/30 rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-emerald-100/50">
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
                <div className="space-y-4 sm:space-y-6">
                  <div className="bg-linear-to-br from-blue-50 to-cyan-50/50 rounded-xl sm:rounded-2xl p-3 sm:p-6 border border-blue-100/50">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-linear-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                        <PieChart className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm sm:text-base">Monthly Analysis</h3>
                        <p className="text-xs sm:text-sm text-slate-500">Earnings trends</p>
                      </div>
                    </div>
                    <MonthlyIncomes selectedDate={monthlyViewMonth} />
                  </div>
                </div>
              )}

              {activeTab === "analytics" && (
                <div className="space-y-4 sm:space-y-6">
                  <div className="bg-linear-to-br from-blue-50 to-cyan-50/50 rounded-xl sm:rounded-2xl p-3 sm:p-6 border border-blue-100/50">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-linear-to-br from-orange-400 to-amber-500 flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm sm:text-base">Income Analytics</h3>
                        <p className="text-xs sm:text-sm text-slate-500">Detailed insights</p>
                      </div>
                    </div>
                    <IncomeSummary />
                  </div>

                  {/* Additional Analytics Insights */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="bg-linear-to-br from-emerald-50 to-green-50/30 rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-emerald-100/50">
                      <div className="flex items-center gap-3 mb-3 sm:mb-4">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-linear-to-br from-emerald-400 to-green-500 flex items-center justify-center">
                          <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-sm sm:text-base">Earnings Trends</h3>
                          <p className="text-xs sm:text-sm text-slate-500">Vs Last Month</p>
                        </div>
                      </div>
                      <div className="space-y-2 sm:space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs sm:text-sm text-slate-600">Comparison</span>
                          <span className={`font-bold text-xs sm:text-sm ${percentageChange.startsWith('-') ? 'text-red-600' : 'text-emerald-600'}`}>
                            {percentageChange.startsWith('-') ? '' : '+'}{percentageChange}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs sm:text-sm text-slate-600">Monthly Avg</span>
                          <span className="font-bold text-xs sm:text-sm text-slate-900">{averagePerMonth}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-linear-to-br from-purple-50 to-pink-50/30 rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-purple-100/50">
                      <div className="flex items-center gap-3 mb-3 sm:mb-4">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-linear-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-sm sm:text-base">AI Insights</h3>
                          <p className="text-xs sm:text-sm text-slate-500">Recommendations</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs sm:text-sm text-slate-600">
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

        <div className="bg-linear-to-r from-blue-50/50 to-cyan-50/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-blue-100/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-linear-to-br from-blue-400 to-cyan-500 flex items-center justify-center">
                <Target className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-slate-900 text-sm sm:text-base">Track Your Earnings</p>
                <p className="text-xs sm:text-sm text-slate-500">
                  Monitor income growth
                </p>
              </div>
            </div>
            <IncomeForm>
              <Button
                className="w-full sm:w-auto rounded-full bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-4 sm:px-6 h-10 sm:h-auto text-sm sm:text-base"
              >
                <Plus className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                Add Income
              </Button>
            </IncomeForm>
          </div>
        </div>
      </div>
    </div>
  );
}