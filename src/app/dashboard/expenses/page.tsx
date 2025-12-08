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

  // Expense stats
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

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Expenses</h1>
          <p className="text-gray-600 mt-2">Track and manage your expenses</p>
        </div>
        <ExpenseForm>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Expense
          </Button>
        </ExpenseForm>
      </div>

      {/* Quick Overview - Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {/* This Month */}
        <div className="bg-white border rounded-lg p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <CalendarDays className="h-4 w-4" /> This Month
            </p>
            <p className="text-2xl font-bold mt-2">
              {statsLoading ? "..." : `$${currentMonthTotal.toFixed(2)}`}
            </p>
          </div>
          <div className="p-2 bg-blue-50 rounded-lg">
            <DollarSign className="h-6 w-6 text-blue-600" />
          </div>
        </div>

        {/* Last Month */}
        <div className="bg-white border rounded-lg p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Last Month</p>
            <p className="text-2xl font-bold mt-2">
              {statsLoading ? "..." : `$${lastMonthTotal.toFixed(2)}`}
            </p>
          </div>
          <div className="p-2 bg-gray-50 rounded-lg">
            <Calendar className="h-6 w-6 text-gray-600" />
          </div>
        </div>

        {/* This Year */}
        <div className="bg-white border rounded-lg p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">This Year</p>
            <p className="text-2xl font-bold mt-2">
              {statsLoading ? "..." : `$${currentYearTotal.toFixed(2)}`}
            </p>
          </div>
          <div className="p-2 bg-green-50 rounded-lg">
            <TrendingUp className="h-6 w-6 text-green-600" />
          </div>
        </div>

        {/* Monthly Avg */}
        <div className="bg-white border rounded-lg p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Monthly Avg</p>
            <p className="text-2xl font-bold mt-2">
              {statsLoading ? "..." : `$${averagePerMonth.toFixed(2)}`}
            </p>
          </div>
          <div className="p-2 bg-purple-50 rounded-lg">
            <BarChart3 className="h-6 w-6 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="list" className="flex items-center gap-2">
            <List className="h-4 w-4" /> All Expenses
          </TabsTrigger>
          <TabsTrigger value="daily" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" /> Daily Expenses
          </TabsTrigger>
          <TabsTrigger value="monthly" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" /> Monthly View
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" /> Analytics
          </TabsTrigger>
        </TabsList>

        {/* All Expenses Tab */}
        <TabsContent value="list" className="mt-6">
          <ExpenseList />
        </TabsContent>

        {/* Daily Expenses Tab */}
        <TabsContent value="daily" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CalendarView
              onDateSelect={setSelectedCalendarDate}
              onShowMonthly={handleShowMonthlyFromCalendar}
              setDailyExpenses={setDailyExpenses}
              setSelectedDate={setSelectedCalendarDate}
            />

            {/* Instructions + Selected Date Info */}
            <div className="p-4 border rounded-lg bg-white space-y-4">
              <h3 className="text-lg font-semibold">How to use:</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Click any date to see expenses for that day</li>
                <li>• Use arrow buttons to navigate between months</li>
                <li>
                  • Click &ldquo;Show Month&rdquo; to view all expenses for the
                  selected month
                </li>
                <li>• Future dates are disabled</li>
              </ul>

              {selectedCalendarDate && (
                <div className="pt-4 border-t space-y-2">
                  <h4 className="text-sm font-semibold">
                    Based on your selected date (
                    {selectedCalendarDate.toLocaleDateString()}), here are the
                    expenses:
                  </h4>

                  {dailyExpenses.length > 0 ? (
                    <div className="space-y-2 max-h-56 overflow-y-auto">
                      {dailyExpenses.map((expense) => (
                        <div
                          key={expense.id}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded"
                        >
                          <div>
                            <p className="text-sm font-medium">
                              ${expense.amount.toFixed(2)}
                            </p>
                            {expense.note && (
                              <p className="text-xs text-gray-600 truncate max-w-[180px]">
                                {expense.note}
                              </p>
                            )}
                          </div>
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                            {new Date(expense.occurredAt).toLocaleTimeString(
                              [],
                              { hour: "2-digit", minute: "2-digit" }
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No expenses for this date.
                    </p>
                  )}

                  <Button
                    onClick={handleShowMonthlyFromCalendar}
                    className="w-full mt-2"
                  >
                    View All Expenses for{" "}
                    {selectedCalendarDate.toLocaleDateString("en-US", {
                      month: "long",
                    })}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Monthly View */}
        <TabsContent value="monthly" className="mt-6">
          <MonthlyExpenses selectedDate={monthlyViewMonth} />
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics" className="mt-6">
          <PeriodSummary />
        </TabsContent>
      </Tabs>
    </div>
  );
}
