"use client";

import { useState, useCallback, useMemo } from "react";
import { ExpenseForm } from "./components/expense-form";
import { ExpenseList } from "./components/expense-list";
import { MonthlyExpenses } from "./components/monthly-expenses";
import { useExpenseStats } from "@/app/dashboard/expenses/hooks/use-expense-stats";
import { Button } from "@/app/core/components/ui/button";
import {
  CalendarDays,
  CheckCircle,
  Plus,
} from "lucide-react";
import { ExpenseCalendarView } from "./components/expense-calendar-view";
import { ExpenseSummary } from "./components/expense-summary";
import { cn } from "@/app/core/lib/utils";

import {
  BackgroundEffects,
  PageHeader,
  StatsGrid,
  SelectedDateInfo,
} from "@/app/core/components/shared/layout";
import {
  TAB_CONFIGS,
  TIME_FILTERS,
  INSTRUCTIONS,
  QUICK_TIPS_CONFIG,
  ADD_EXPENSE_BUTTON_CONFIG,
  PAGE_HEADER_CONFIG,
} from "./data/constants";
import {
  STATS_CARDS_CONFIG,
  CALENDAR_VIEW_CONFIG,
  MONTHLY_VIEW_CONFIG,
  ANALYTICS_CONFIG,
  SPENDING_TRENDS_CONFIG,
  AI_INSIGHTS_CONFIG,
  QUICK_ACTIONS_CONFIG,
} from "./data/component-configs";

export default function ExpensesPage() {
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<
    Date | undefined
  >(new Date());
  const [dailyExpenses, setDailyExpenses] = useState<any[]>([]);
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
  } = useExpenseStats();

  const handleDateSelect = useCallback((date: Date | undefined) => {
    setSelectedCalendarDate(date);
  }, []);

  const handleSetDailyExpenses = useCallback((expenses: any[]) => {
    setDailyExpenses(expenses);
  }, []);

  const handleShowMonthlyFromCalendar = useCallback(() => {
    if (selectedCalendarDate) {
      setMonthlyViewMonth(selectedCalendarDate);
      setActiveTab("monthly");
    }
  }, [selectedCalendarDate]);

  const percentageChange = useMemo(() => {
    return lastMonthTotal > 0
      ? (((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100).toFixed(
          1
        )
      : "0";
  }, [currentMonthTotal, lastMonthTotal]);

  const stats = useMemo(() => {
    return STATS_CARDS_CONFIG.stats.map((stat, index) => {
      const values = [
        currentMonthTotal,
        lastMonthTotal,
        currentYearTotal,
        averagePerMonth,
      ];
      return {
        ...stat,
        value: values[index],
        loading: statsLoading,
        percentageChange: index === 0 ? percentageChange : undefined,
      };
    });
  }, [
    currentMonthTotal,
    lastMonthTotal,
    currentYearTotal,
    averagePerMonth,
    statsLoading,
    percentageChange,
  ]);

  const timeFilterConfig = useMemo(() => {
    return TIME_FILTERS.find((filter) => filter.value === timeFilter);
  }, [timeFilter]);

  return (
    <div className="relative min-h-screen px-2 sm:px-4 py-4 sm:py-6 md:py-8 overflow-x-hidden">
      <BackgroundEffects />

      <div className="absolute inset-0 bg-linear-to-br from-blue-50/30 via-transparent to-cyan-50/20" />

      <div className="container mx-auto relative z-10 px-0 sm:px-4 max-w-7xl">
        <PageHeader
          title={PAGE_HEADER_CONFIG.title}
          description={PAGE_HEADER_CONFIG.description}
          icon={<PAGE_HEADER_CONFIG.icon className="w-4 h-4 sm:w-5 sm:h-5" />}
          tagline={PAGE_HEADER_CONFIG.tagline}
        >
          <ExpenseForm>
            <Button
              size="lg"
              className={cn(
                "rounded-full bg-linear-to-r",
                ADD_EXPENSE_BUTTON_CONFIG.gradient,
                "hover:" + ADD_EXPENSE_BUTTON_CONFIG.hoverGradient,
                "text-white px-4 sm:px-6 h-10 sm:h-12",
                "shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30",
                "transition-all duration-300 group w-full sm:w-auto text-sm sm:text-base"
              )}
            >
              <ADD_EXPENSE_BUTTON_CONFIG.icon className="mr-2 h-4 w-4" />
              {ADD_EXPENSE_BUTTON_CONFIG.text}
              <ADD_EXPENSE_BUTTON_CONFIG.arrowIcon className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </ExpenseForm>
        </PageHeader>

        {/* Stats Cards */}
        <div className="mb-4 sm:mb-6 md:mb-8 px-2 sm:px-0">
          <StatsGrid stats={stats} />
        </div>

        {/* Enhanced Tabs Container */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl p-2 sm:p-4 md:p-6 border border-slate-200/50 shadow-lg mb-6 md:mb-8 mx-2 sm:mx-0">
          {/* Tab Navigation and Time Filter */}
          <div className="flex flex-col gap-4 mb-4 sm:mb-6">
            
            {/* TABS SECTION - MODIFIED FOR SINGLE LINE MOBILE */}
            {/* Used grid-cols-4 on all screens to ensure single line */}
            <div className="grid grid-cols-4 gap-2 sm:gap-3 px-0 sm:px-6 md:px-8 lg:px-12">
              {TAB_CONFIGS.map((tab) => {
                const isActive = activeTab === tab.value;
                // We split the label to ensure only the first word is shown if desired, or just rely on CSS
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
                    <div
                      className={cn(
                        "p-1.5 sm:p-2.5 rounded-lg",
                        isActive
                          ? "bg-white/20"
                          : "bg-linear-to-br from-blue-50 to-cyan-50"
                      )}
                    >
                      {/* Wrapper to control icon size explicitly across breakpoints */}
                      <div className="[&>svg]:w-4 [&>svg]:h-4 sm:[&>svg]:w-5 sm:[&>svg]:h-5">
                         {tab.icon}
                      </div>
                    </div>
                    <span className="font-medium text-[10px] sm:text-sm whitespace-nowrap w-full truncate text-center">
                      {oneWordLabel}
                    </span>
                    {/* Active indicator line */}
                    {isActive && (
                      <div className="absolute bottom-0 left-2 right-2 sm:left-4 sm:right-4 h-0.5 bg-white/50 rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Divider Line */}
            <div className="h-px bg-linear-to-r from-transparent via-slate-300 to-transparent" />

            {/* Time Filter */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1 sm:px-6 md:px-8 lg:px-12">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 pl-1">
                <CalendarDays className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Period: {timeFilterConfig?.label}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {TIME_FILTERS.map((filter) => (
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

          {/* Tab Content */}
          <div className="space-y-4 sm:space-y-6">
            {activeTab === "list" && (
              <div className="rounded-xl overflow-hidden">
                <ExpenseList />
              </div>
            )}

            {activeTab === "daily" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Calendar View */}
                <div className="lg:col-span-2">
                  <div
                    className={cn(
                      "bg-linear-to-br rounded-xl sm:rounded-2xl p-3 sm:p-6 border h-full",
                      CALENDAR_VIEW_CONFIG.gradient,
                      CALENDAR_VIEW_CONFIG.border
                    )}
                  >
                    <ExpenseCalendarView
                      onDateSelect={handleDateSelect}
                      onShowMonthly={handleShowMonthlyFromCalendar}
                      setDailyExpenses={handleSetDailyExpenses}
                      setSelectedDate={handleDateSelect}
                    />
                  </div>
                </div>

                {/* Sidebar with Instructions and Selected Date */}
                <div className="space-y-4 sm:space-y-6">
                  {/* Quick Tips */}
                  <div
                    className={cn(
                      "bg-linear-to-br rounded-xl sm:rounded-2xl p-3 sm:p-5 border",
                      QUICK_TIPS_CONFIG.gradient,
                      QUICK_TIPS_CONFIG.border
                    )}
                  >
                    <div className="flex items-center gap-2 mb-3 sm:mb-4">
                      <div
                        className={cn(
                          "w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl",
                          "bg-linear-to-br flex items-center justify-center",
                          QUICK_TIPS_CONFIG.iconGradient
                        )}
                      >
                        <QUICK_TIPS_CONFIG.icon className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                        {QUICK_TIPS_CONFIG.title}
                      </h3>
                    </div>
                    <div className="space-y-2 sm:space-y-3">
                      {INSTRUCTIONS.map((instruction, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-500 mt-0.5 shrink-0" />
                          <p className="text-xs sm:text-sm text-slate-600">
                            {instruction.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Selected Date Info */}
                  {selectedCalendarDate && (
                    <div className="bg-linear-to-br from-emerald-50 to-green-50/30 rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-emerald-100/50">
                      <SelectedDateInfo
                        date={selectedCalendarDate}
                        dailyItems={dailyExpenses}
                        itemType="expense"
                        onShowMonthly={handleShowMonthlyFromCalendar}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "monthly" && (
              <div className="space-y-4 sm:space-y-6">
                <div
                  className={cn(
                    "bg-linear-to-br rounded-xl sm:rounded-2xl p-3 sm:p-6 border",
                    MONTHLY_VIEW_CONFIG.gradient,
                    MONTHLY_VIEW_CONFIG.border
                  )}
                >
                  <MonthlyExpenses selectedDate={monthlyViewMonth} />
                </div>
              </div>
            )}

            {activeTab === "analytics" && (
              <div className="space-y-4 sm:space-y-6">
                <div
                  className={cn(
                    "bg-linear-to-br rounded-xl sm:rounded-2xl p-3 sm:p-6 border",
                    ANALYTICS_CONFIG.gradient,
                    ANALYTICS_CONFIG.border
                  )}
                >
                  <ExpenseSummary />
                </div>

                {/* Additional Analytics Insights */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div
                    className={cn(
                      "bg-linear-to-br rounded-xl sm:rounded-2xl p-3 sm:p-5 border",
                      SPENDING_TRENDS_CONFIG.gradient,
                      SPENDING_TRENDS_CONFIG.border
                    )}
                  >
                    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <div
                        className={cn(
                          "w-8 h-8 sm:w-10 sm:h-10 rounded-lg",
                          "bg-linear-to-br flex items-center justify-center",
                          SPENDING_TRENDS_CONFIG.iconGradient
                        )}
                      >
                        <SPENDING_TRENDS_CONFIG.icon className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                          {SPENDING_TRENDS_CONFIG.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-500">
                          {SPENDING_TRENDS_CONFIG.description}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm text-slate-600">
                          This Month vs Last
                        </span>
                        <span
                          className={`font-bold text-xs sm:text-sm ${
                            percentageChange.startsWith("-")
                              ? "text-red-600"
                              : "text-emerald-600"
                          }`}
                        >
                          {percentageChange.startsWith("-") ? "" : "+"}
                          {percentageChange}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm text-slate-600">
                          Monthly Average
                        </span>
                        <span className="font-bold text-xs sm:text-sm text-slate-900">
                          {averagePerMonth}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div
                    className={cn(
                      "bg-linear-to-br rounded-xl sm:rounded-2xl p-3 sm:p-5 border",
                      AI_INSIGHTS_CONFIG.gradient,
                      AI_INSIGHTS_CONFIG.border
                    )}
                  >
                    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <div
                        className={cn(
                          "w-8 h-8 sm:w-10 sm:h-10 rounded-lg",
                          "bg-linear-to-br flex items-center justify-center",
                          AI_INSIGHTS_CONFIG.iconGradient
                        )}
                      >
                        <AI_INSIGHTS_CONFIG.icon className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                          {AI_INSIGHTS_CONFIG.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-500">
                          {AI_INSIGHTS_CONFIG.description}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs sm:text-sm text-slate-600">
                        {currentMonthTotal > lastMonthTotal
                          ? "Consider reviewing your increased spending this month"
                          : "Great job reducing your expenses this month!"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions Footer */}
        <div
          className={cn(
            "bg-linear-to-r rounded-xl sm:rounded-2xl p-4 sm:p-6 border",
            QUICK_ACTIONS_CONFIG.gradient,
            QUICK_ACTIONS_CONFIG.border
          )}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div
                className={cn(
                  "w-8 h-8 sm:w-10 sm:h-10 rounded-lg",
                  "bg-linear-to-br flex items-center justify-center",
                  QUICK_ACTIONS_CONFIG.iconGradient
                )}
              >
                <QUICK_ACTIONS_CONFIG.icon className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-slate-900 text-sm sm:text-base">
                  {QUICK_ACTIONS_CONFIG.title}
                </p>
                <p className="text-xs sm:text-sm text-slate-500">
                  {QUICK_ACTIONS_CONFIG.description}
                </p>
              </div>
            </div>
            <ExpenseForm>
              <Button
                className={cn(
                  "rounded-full bg-linear-to-r",
                  "from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600",
                  "text-white px-4 sm:px-6 py-2 h-10 sm:h-auto",
                  "w-full sm:w-auto text-sm sm:text-base"
                )}
              >
                <Plus className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                Add Expense
              </Button>
            </ExpenseForm>
          </div>
        </div>
      </div>
    </div>
  );
}