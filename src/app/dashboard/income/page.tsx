import { IncomeList } from "./components/income-list";
import { AddIncomeModal } from "./components/add-income-modal";
import { CalendarView } from "./components/calendar-view";
import { MonthlyIncomes } from "./components/monthly-incomes";
import { IncomeStats } from "./components/income-stats";
import prisma from "@/app/core/lib/prisma";
import { getAuthenticatedUser } from "@/app/core/lib/supabase/server";
import { redirect } from "next/navigation";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/core/components/ui/tabs";
import { Calendar, DollarSign, List, TrendingUp } from "lucide-react";

export default async function IncomePage() {
  const authUser = await getAuthenticatedUser();

  if (!authUser) {
    redirect("/auth/signin");
  }

  const dbUser = await prisma.user.upsert({
    where: { supabaseId: authUser.id },
    create: { email: authUser.email!, supabaseId: authUser.id },
    update: {},
  });

  // We still fetch categories server-side for components that might need them (like MonthlyIncomes)
  // or to pre-hydrate the cache if we were using a hydration boundary.
  const categories = await prisma.category.findMany({
    where: { userId: dbUser.id, type: "INCOME" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-4">
        <div>
          <h1 className="text-3xl font-bold">Income Tracker</h1>
          <p className="text-gray-600 mt-2">
            Track and manage your income with monthly/yearly insights
          </p>
        </div>

        {/* 
           FIX 1: Removed categories={categories} 
           The modal/form now fetches its own categories via hooks.
        */}
        <AddIncomeModal />
      </div>

      {/* Stats Cards */}
      <IncomeStats />

      {/* Main Content Tabs */}
      <Tabs defaultValue="calendar" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Calendar View</span>
            <span className="sm:hidden">Calendar</span>
          </TabsTrigger>
          <TabsTrigger value="monthly" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Monthly View</span>
            <span className="sm:hidden">Monthly</span>
          </TabsTrigger>
          <TabsTrigger value="list" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            <span className="hidden sm:inline">All Incomes</span>
            <span className="sm:hidden">All</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Analytics</span>
            <span className="sm:hidden">Analytics</span>
          </TabsTrigger>
        </TabsList>

        {/* Calendar View Tab */}
        <TabsContent value="calendar" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CalendarView />
            <div className="space-y-6">
              {/* MonthlyIncomes still requires categories prop */}
              <MonthlyIncomes categories={categories} />
              <div className="p-4 border rounded-lg bg-blue-50">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Calendar Tips
                </h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Click any date to view incomes for that day</li>
                  <li>• Navigate between months using arrow buttons</li>
                  <li>
                    • Future months are disabled - incomes can&apos;t be added
                    ahead of time
                  </li>
                  <li>• Export monthly data for offline analysis</li>
                </ul>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Monthly View Tab */}
        <TabsContent value="monthly" className="mt-6">
          <div className="space-y-6">
            {/* MonthlyIncomes still requires categories prop */}
            <MonthlyIncomes categories={categories} />
            <div className="p-4 border rounded-lg bg-green-50">
              <h3 className="font-semibold mb-2">Monthly Insights</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Track your income patterns month over month</li>
                <li>• Identify your highest earning months</li>
                <li>• Plan your budget based on monthly income trends</li>
                <li>• Compare income sources across different months</li>
              </ul>
            </div>
          </div>
        </TabsContent>

        {/* All Incomes Tab */}
        <TabsContent value="list" className="mt-6">
          <div className="space-y-6">
            <div className="p-4 bg-linear-to-r from-green-50 to-emerald-50 rounded-lg">
              <h2 className="text-lg font-semibold mb-2">All Incomes</h2>
              <p className="text-sm text-gray-600">
                View and manage all your income transactions. Use filters to
                find specific entries.
              </p>
            </div>

            {/* 
               FIX 2: Removed categories={categories} 
               IncomeList now fetches its own categories via hooks.
            */}
            <IncomeList />
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="mt-6">
          <div className="p-6 border rounded-lg bg-white">
            <h2 className="text-xl font-semibold mb-4">Income Analytics</h2>
            <p className="text-gray-600 mb-6">
              Analyze your income patterns and trends over time. Use these
              insights for better financial planning.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Yearly Overview</h3>
                <p className="text-sm text-gray-600">
                  Track your income growth year over year. Identify seasonal
                  patterns and plan for the future.
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Source Analysis</h3>
                <p className="text-sm text-gray-600">
                  See which income sources contribute the most to your total
                  earnings. Focus on growing your top performers.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Tips */}
      <div className="mt-8 p-4 border rounded-lg bg-yellow-50">
        <h3 className="font-semibold mb-2">Income Tracking Tips</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Record all income sources for accurate financial tracking</li>
          <li>• Categorize your income to understand where it comes from</li>
          <li>• Use the calendar view to see income patterns by date</li>
          <li>• Export data for tax preparation and financial planning</li>
          <li>• Set monthly income goals based on historical data</li>
        </ul>
      </div>
    </div>
  );
}
