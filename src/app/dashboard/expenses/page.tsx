"use client";

import { useState } from "react";
import { ExpenseForm } from "./components/expense-form";
import { CalendarView } from "./components/calendar-view";
import { ExpenseList } from "./components/expense-list";
import { MonthlyExpenses } from "./components/monthly-expenses";
import { PeriodSummary } from "./components/period-summary";
import { useExpenseStats } from "@/app/core/hooks/use-expense-stats";
import { Button } from "@/app/core/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/core/components/ui/tabs";
import {
  Calendar,
  List,
  PieChart,
  BarChart3,
  Plus,
  TrendingUp,
  DollarSign,
  CalendarDays,
  ArrowRight,
  Sparkles,
  Target,
  Zap,
  ChevronRight,
} from "lucide-react";

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

  const handleShowMonthlyFromCalendar = () => {
    if (selectedCalendarDate) {
      setMonthlyViewMonth(selectedCalendarDate);
      setActiveTab("monthly");
    }
  };

  const percentageChange =
    lastMonthTotal > 0
      ? (((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100).toFixed(
          1
        )
      : "0";

  return (
    <div className="relative min-h-screen px-4 py-8 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-100/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-100/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto">
        <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-6 mb-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-sm font-medium">
              <Target className="w-4 h-4" />
              <span>Smart Expense Tracking</span>
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold leading-[1.1] tracking-tight block bg-linear-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
                EXPENSE
              </h1>
              <p className="text-lg text-slate-600 mt-4 max-w-xl leading-relaxed">
                Track, analyze, and optimize your spending with AI-powered
                insights and real-time financial intelligence.
              </p>
            </div>
          </div>
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 flex items-center gap-2 font-medium">
                  <CalendarDays className="h-4 w-4" /> This Month
                </p>
                <p className="text-3xl font-bold mt-3 text-slate-900">
                  {statsLoading ? "..." : `$${currentMonthTotal.toFixed(2)}`}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <TrendingUp
                    className={`h-4 w-4 ${parseFloat(percentageChange) >= 0 ? "text-green-500" : "text-red-500"}`}
                  />
                  <span
                    className={`text-sm font-medium ${parseFloat(percentageChange) >= 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {percentageChange}% from last month
                  </span>
                </div>
              </div>
              <div className="p-3 bg-linear-to-br from-blue-500 to-cyan-400 rounded-xl shadow-lg">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          {/* Last Month */}
          <div className="bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Last Month</p>
                <p className="text-3xl font-bold mt-3 text-slate-900">
                  {statsLoading ? "..." : `$${lastMonthTotal.toFixed(2)}`}
                </p>
                <p className="text-sm text-slate-500 mt-2">
                  Previous period total
                </p>
              </div>
              <div className="p-3 bg-linear-to-br from-slate-600 to-slate-400 rounded-xl shadow-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          {/* This Year */}
          <div className="bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">This Year</p>
                <p className="text-3xl font-bold mt-3 text-slate-900">
                  {statsLoading ? "..." : `$${currentYearTotal.toFixed(2)}`}
                </p>
                <p className="text-sm text-slate-500 mt-2">
                  Year-to-date total
                </p>
              </div>
              <div className="p-3 bg-linear-to-br from-green-500 to-emerald-400 rounded-xl shadow-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          {/* Monthly Avg */}
          <div className="bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">
                  Monthly Avg
                </p>
                <p className="text-3xl font-bold mt-3 text-slate-900">
                  {statsLoading ? "..." : `$${averagePerMonth.toFixed(2)}`}
                </p>
                <p className="text-sm text-slate-500 mt-2">Average spending</p>
              </div>
              <div className="p-3 bg-linear-to-br from-purple-500 to-pink-400 rounded-xl shadow-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-white/80 backdrop-blur-sm border rounded-2xl shadow-xl overflow-hidden">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="px-6 pt-6">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-4 bg-transparent">
                <TabsTrigger
                  value="list"
                  className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg py-3 transition-all duration-300"
                >
                  <List className="h-4 w-4" />
                  <span>All Expenses</span>
                  <ChevronRight className="h-4 w-4 ml-auto opacity-50" />
                </TabsTrigger>
                <TabsTrigger
                  value="daily"
                  className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg py-3 transition-all duration-300"
                >
                  <Calendar className="h-4 w-4" />
                  <span>Daily View</span>
                  <ChevronRight className="h-4 w-4 ml-auto opacity-50" />
                </TabsTrigger>
                <TabsTrigger
                  value="monthly"
                  className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg py-3 transition-all duration-300"
                >
                  <PieChart className="h-4 w-4" />
                  <span>Monthly View</span>
                  <ChevronRight className="h-4 w-4 ml-auto opacity-50" />
                </TabsTrigger>
                <TabsTrigger
                  value="analytics"
                  className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg py-3 transition-all duration-300"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>Analytics</span>
                  <ChevronRight className="h-4 w-4 ml-auto opacity-50" />
                </TabsTrigger>
              </TabsList>
            </div>

            {/* All Expenses Tab */}
            <TabsContent value="list" className="mt-6 px-6 pb-6">
              <div className="rounded-xl overflow-hidden">
                <ExpenseList />
              </div>
            </TabsContent>

            {/* Daily Expenses Tab */}
            <TabsContent value="daily" className="mt-6 px-6 pb-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white/50 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-6 shadow-lg">
                  <CalendarView
                    onDateSelect={setSelectedCalendarDate}
                    onShowMonthly={handleShowMonthlyFromCalendar}
                    setDailyExpenses={setDailyExpenses}
                    setSelectedDate={setSelectedCalendarDate}
                  />
                </div>

                {/* Instructions + Selected Date Info */}
                <div className="space-y-6">
                  <div className="bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-400 to-cyan-300 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        How to use:
                      </h3>
                    </div>
                    <ul className="space-y-3 text-sm text-slate-600">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5" />
                        <span>Click any date to see expenses for that day</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5" />
                        <span>
                          Use arrow buttons to navigate between months
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5" />
                        <span>
                          Click &ldquo;Show Month&rdquo; to view all expenses
                          for the selected month
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5" />
                        <span>Future dates are disabled for entry</span>
                      </li>
                    </ul>
                  </div>

                  {selectedCalendarDate && (
                    <div className="bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-6 shadow-lg">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-400 to-pink-300 flex items-center justify-center">
                          <Zap className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-slate-900">
                            Selected:{" "}
                            {selectedCalendarDate.toLocaleDateString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </h4>
                          <p className="text-xs text-slate-500">
                            Daily expense breakdown
                          </p>
                        </div>
                      </div>

                      {dailyExpenses.length > 0 ? (
                        <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
                          {dailyExpenses.map((expense) => (
                            <div
                              key={expense.id}
                              className="flex items-center justify-between p-4 bg-linear-to-r from-slate-50/50 to-white rounded-xl border border-slate-200/30 hover:border-blue-200 transition-all duration-300 group"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                                  <DollarSign className="w-4 h-4 text-blue-600" />
                                </div>
                                <div>
                                  <p className="text-lg font-bold text-slate-900">
                                    ${expense.amount.toFixed(2)}
                                  </p>
                                  {expense.note && (
                                    <p className="text-sm text-slate-600 truncate max-w-[200px] group-hover:text-slate-800">
                                      {expense.note}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <span className="text-xs px-3 py-1.5 bg-linear-to-r from-blue-500/10 to-cyan-500/10 text-blue-700 rounded-full font-medium border border-blue-200/30">
                                {new Date(
                                  expense.occurredAt
                                ).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <div className="w-16 h-16 rounded-full bg-linear-to-br from-slate-100 to-slate-200 flex items-center justify-center mx-auto mb-4">
                            <Calendar className="w-8 h-8 text-slate-400" />
                          </div>
                          <p className="text-slate-500 font-medium">
                            No expenses for this date
                          </p>
                          <p className="text-sm text-slate-400 mt-1">
                            Add an expense to track your spending
                          </p>
                        </div>
                      )}

                      <Button
                        onClick={handleShowMonthlyFromCalendar}
                        className="w-full mt-6 rounded-xl bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-6 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 group"
                      >
                        <Calendar className="mr-2 h-5 w-5" />
                        View All Expenses for{" "}
                        {selectedCalendarDate.toLocaleDateString("en-US", {
                          month: "long",
                        })}
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="monthly" className="mt-6 px-6 pb-6">
              <MonthlyExpenses selectedDate={monthlyViewMonth} />
            </TabsContent>

            <TabsContent value="analytics" className="mt-6 px-6 pb-6">
              <PeriodSummary />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
