"use client";

import { useState, useCallback } from "react";
import { ExpenseForm } from "./components/expense-form";
import { ExpenseList } from "./components/expense-list";
import { MonthlyExpenses } from "./components/monthly-expenses";
import { useExpenseStats } from "@/app/core/hooks/use-expense-stats";
import { Button } from "@/app/core/components/ui/button";
import {
  Plus,
  Target,
  ArrowRight,
  List,
  Calendar,
  PieChart,
  BarChart3,
} from "lucide-react";
import { ExpenseCalendarView } from "./components/expense-calendar-view";
import { ExpenseSummary } from "./components/expense-summary";

// Import shared components
import {
  BackgroundEffects,
  PageHeader,
  StatsGrid,
  TabsContainer,
  TabContent,
  SelectedDateInfo,
  HowToUse,
} from "@/app/core/components/shared/layout";

export default function ExpensesPage() {
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<
    Date | undefined
  >(new Date());
  const [dailyExpenses, setDailyExpenses] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("list");
  const [monthlyViewMonth, setMonthlyViewMonth] = useState<Date | undefined>(
    new Date()
  );

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
      description: "Average spending",
      icon: "barChart" as const,
      iconBg: "bg-linear-to-br from-purple-500 to-pink-400",
      loading: statsLoading,
    },
  ];

  const tabs = [
    {
      value: "list",
      icon: <List className="h-4 w-4" />,
      label: "All Expenses",
    },
    {
      value: "daily",
      icon: <Calendar className="h-4 w-4" />,
      label: "Daily View",
    },
    {
      value: "monthly",
      icon: <PieChart className="h-4 w-4" />,
      label: "Monthly View",
    },
    {
      value: "analytics",
      icon: <BarChart3 className="h-4 w-4" />,
      label: "Analytics",
    },
  ];

  const instructions = [
    "Click any date to see expenses for that day",
    "Use arrow buttons to navigate between months",
    'Click "Show Month" to view all expenses for the selected month',
    "Future dates are disabled for entry",
  ];

  return (
    <div className="relative min-h-screen px-4 py-8 overflow-hidden">
      <BackgroundEffects />

      <div className="container mx-auto">
        <PageHeader
          title="EXPENSE"
          description="Track, analyze, and optimize your spending with AI-powered insights and real-time financial intelligence."
          icon={<Target className="w-4 h-4" />}
          tagline="Smart Expense Tracking"
        >
          <ExpenseForm>
            <Button
              size="lg"
              className="rounded-full bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 h-12 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 group"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Expense
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </ExpenseForm>
        </PageHeader>

        <StatsGrid stats={stats} />

        <TabsContainer
          value={activeTab}
          onValueChange={setActiveTab}
          tabs={tabs}
        >
          <TabContent value="list">
            <div className="rounded-xl overflow-hidden">
              <ExpenseList />
            </div>
          </TabContent>

          <TabContent value="daily">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white/50 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-6 shadow-lg">
                <ExpenseCalendarView
                  onDateSelect={handleDateSelect}
                  onShowMonthly={handleShowMonthlyFromCalendar}
                  setDailyExpenses={handleSetDailyExpenses}
                  setSelectedDate={handleDateSelect}
                />
              </div>

              <div className="space-y-6">
                <HowToUse instructions={instructions} />

                {selectedCalendarDate && (
                  <SelectedDateInfo
                    date={selectedCalendarDate}
                    dailyItems={dailyExpenses}
                    itemType="expense"
                    onShowMonthly={handleShowMonthlyFromCalendar}
                  />
                )}
              </div>
            </div>
          </TabContent>

          <TabContent value="monthly">
            <MonthlyExpenses selectedDate={monthlyViewMonth} />
          </TabContent>

          <TabContent value="analytics">
            <ExpenseSummary />
          </TabContent>
        </TabsContainer>
      </div>
    </div>
  );
}
