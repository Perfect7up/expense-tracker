"use client";

import { useIncomeStats } from "@/app/core/hooks/use-income-stats";
import {
  DollarSign,
  CalendarDays,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

export function IncomeStats() {
  const {
    currentMonthTotal,
    lastMonthTotal,
    currentYearTotal,
    averagePerMonth,
    isLoading,
  } = useIncomeStats();

  // Calculate month-over-month change
  const monthOverMonthChange =
    lastMonthTotal > 0
      ? ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100
      : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Current Month Card */}
      <div className="p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <CalendarDays className="h-4 w-4" />
              This Month
            </p>
            <p className="text-2xl font-bold mt-2">
              {isLoading ? "..." : `$${currentMonthTotal.toFixed(2)}`}
            </p>
          </div>
          <div className="p-2 bg-blue-50 rounded-lg">
            <DollarSign className="h-6 w-6 text-blue-600" />
          </div>
        </div>
        {!isLoading && monthOverMonthChange !== 0 && (
          <div className="mt-3 flex items-center gap-1 text-sm">
            {monthOverMonthChange > 0 ? (
              <>
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-green-500 font-medium">
                  +{Math.abs(monthOverMonthChange).toFixed(1)}%
                </span>
                <span className="text-gray-500">from last month</span>
              </>
            ) : (
              <>
                <TrendingDown className="h-4 w-4 text-red-500" />
                <span className="text-red-500 font-medium">
                  {Math.abs(monthOverMonthChange).toFixed(1)}%
                </span>
                <span className="text-gray-500">from last month</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Last Month Card */}
      <div className="p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Last Month</p>
            <p className="text-2xl font-bold mt-2">
              {isLoading ? "..." : `$${lastMonthTotal.toFixed(2)}`}
            </p>
          </div>
          <div className="p-2 bg-gray-50 rounded-lg">
            <CalendarDays className="h-6 w-6 text-gray-600" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-xs text-gray-500">
            {lastMonthTotal > 0
              ? `Previous month's total income`
              : "No income last month"}
          </p>
        </div>
      </div>

      {/* This Year Card */}
      <div className="p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">This Year</p>
            <p className="text-2xl font-bold mt-2">
              {isLoading ? "..." : `$${currentYearTotal.toFixed(2)}`}
            </p>
          </div>
          <div className="p-2 bg-green-50 rounded-lg">
            <TrendingUp className="h-6 w-6 text-green-600" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-xs text-gray-500">
            {currentYearTotal > 0
              ? `Year-to-date total income`
              : "No income this year"}
          </p>
        </div>
      </div>

      {/* Average per Month Card */}
      <div className="p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Avg/Month</p>
            <p className="text-2xl font-bold mt-2">
              {isLoading ? "..." : `$${averagePerMonth.toFixed(2)}`}
            </p>
          </div>
          <div className="p-2 bg-purple-50 rounded-lg">
            <TrendingUp className="h-6 w-6 text-purple-600" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-xs text-gray-500">
            {averagePerMonth > 0 ? `Average monthly income` : "Not enough data"}
          </p>
        </div>
      </div>
    </div>
  );
}
