"use client";

import { useState } from "react";
import {
  Download,
  TrendingUp,
  FileText,
  PieChart,
  BarChart3,
  Calendar,
  Filter,
  RefreshCw,
  Sparkles,
  Zap,
  Target,
  ChevronRight,
  Clock,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/app/core/components/ui/button";
import { cn } from "@/app/core/lib/utils";

import {
  BackgroundEffects,
  PageHeader,
  TabsContainer,
  TabContent,
} from "@/app/core/components/shared/layout";

import { useReportsData, useExportReports } from "./hooks/use-reports-data";
import { OverviewStats } from "./components/overveiw-state";
import { CashflowAnalysis } from "./components/cash-flow-analysis";
import { CategoryBreakdown } from "./components/category-breakdown";
import { InvestmentPortfolio } from "./components/investment-portfolio";
import Loading from "@/app/core/components/shared/loading";

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [timeFilter, setTimeFilter] = useState("month");
  const { overview, cashflow, categoryBreakdown, investments, isLoading, refetch } = useReportsData();
  const { handleExportAll, isExporting } = useExportReports();

  const tabs = [
    {
      value: "overview",
      icon: <TrendingUp className="h-4 w-4" />,
      label: "Overview",
      color: "from-blue-500 to-cyan-400",
    },
    {
      value: "cashflow",
      icon: <BarChart3 className="h-4 w-4" />,
      label: "Cash Flow",
      color: "from-emerald-500 to-green-400",
    },
    {
      value: "categories",
      icon: <PieChart className="h-4 w-4" />,
      label: "Categories",
      color: "from-purple-500 to-pink-400",
    },
    {
      value: "investments",
      icon: <FileText className="h-4 w-4" />,
      label: "Investments",
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
    "Export reports in CSV or JSON format",
    "View detailed breakdowns by category",
    "Track investment performance",
    "Monitor cash flow over time",
  ];

  if (isLoading) {
    return <Loading />;
  }

  const isPositiveCashFlow = overview?.netBalance && overview.netBalance >= 0;
  const incomeExpenseRatio = overview?.totalIncome && overview.totalExpense
    ? (overview.totalExpense / overview.totalIncome).toFixed(2)
    : null;

  return (
    <div className="relative min-h-screen px-4 py-8 overflow-hidden">
      <BackgroundEffects />

      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-cyan-50/20" />

      <div className="container mx-auto relative z-10">
        {/* Use PageHeader component */}
        <PageHeader
          title="FINANCIAL REPORTS"
          description="Comprehensive analysis with AI-powered insights and detailed breakdowns."
          icon={<FileText className="w-4 h-4" />}
          tagline="Analytics & Insights"
        >
          <div className="flex gap-2">
            <Button
              onClick={() => refetch()}
              variant="ghost"
              size="icon"
              className="rounded-full bg-white/50 backdrop-blur-sm border border-slate-200/50 hover:bg-white/80 hover:shadow-md"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => handleExportAll('csv')}
              disabled={isExporting}
              className="rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 group"
            >
              <Download className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
              {isExporting ? "Exporting..." : "Export CSV"}
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </PageHeader>

        {/* Time Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {timeFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setTimeFilter(filter.value)}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium transition-all flex-shrink-0",
                timeFilter === filter.value
                  ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md shadow-blue-500/20"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/50 border border-slate-200/50"
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Stats Cards */}
        <div className="mb-8">
          <OverviewStats data={overview || undefined} />
        </div>

        {/* Enhanced Tabs Container */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-slate-200/50 shadow-lg mb-8">
          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 mb-6">
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

          {/* Tab Content Area */}
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  {tabs.find(t => t.value === activeTab)?.label || "Reports"}
                </h2>
                <p className="text-slate-500 mt-1">
                  {activeTab === "overview" && "Complete financial overview and insights"}
                  {activeTab === "cashflow" && "Income, expenses, and net flow analysis"}
                  {activeTab === "categories" && "Spending distribution across categories"}
                  {activeTab === "investments" && "Portfolio performance and growth"}
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Calendar className="w-4 h-4" />
                <span>Last updated: Today</span>
              </div>
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {/* Financial Health & AI Recommendations */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50/50 rounded-2xl p-6 border border-blue-100/50">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center">
                          <Target className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900">Financial Health</h3>
                          <p className="text-sm text-slate-500">Cash Flow Status</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">Status</span>
                          <span className={`font-bold ${isPositiveCashFlow ? 'text-emerald-600' : 'text-red-600'}`}>
                            {isPositiveCashFlow ? "✓ Healthy" : "⚠ Needs Attention"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">Subscriptions</span>
                          <span className="font-bold text-slate-900">{overview?.activeSubscriptions || 0} Active</span>
                        </div>
                        {incomeExpenseRatio && (
                          <div className="flex items-center justify-between">
                            <span className="text-slate-600">Income/Expense Ratio</span>
                            <span className="font-bold text-slate-900">1:{incomeExpenseRatio}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-pink-50/50 rounded-2xl p-6 border border-purple-100/50">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                          <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900">AI Recommendations</h3>
                          <p className="text-sm text-slate-500">Personalized Insights</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-slate-600">
                            {isPositiveCashFlow
                              ? "Your savings rate is excellent. Consider increasing investments."
                              : "Review recurring expenses for potential savings."}
                          </p>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-slate-600">
                            {overview?.activeSubscriptions && overview.activeSubscriptions > 5
                              ? "Consider reviewing your 6+ active subscriptions"
                              : "Subscription count is well-managed"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white/50 rounded-xl p-4 border border-slate-200/50">
                      <p className="text-xs text-slate-500 mb-1">Report Period</p>
                      <p className="font-bold text-slate-900">
                        {timeFilters.find(f => f.value === timeFilter)?.label}
                      </p>
                    </div>
                    <div className="bg-white/50 rounded-xl p-4 border border-slate-200/50">
                      <p className="text-xs text-slate-500 mb-1">Data Points</p>
                      <p className="font-bold text-slate-900">
                        {categoryBreakdown?.length || 0}
                      </p>
                    </div>
                    <div className="bg-white/50 rounded-xl p-4 border border-slate-200/50">
                      <p className="text-xs text-slate-500 mb-1">Export Ready</p>
                      <p className="font-bold text-slate-900">Yes</p>
                    </div>
                    <div className="bg-white/50 rounded-xl p-4 border border-slate-200/50">
                      <p className="text-xs text-slate-500 mb-1">Next Update</p>
                      <p className="font-bold text-slate-900">24h</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "cashflow" && (
                <CashflowAnalysis data={cashflow} />
              )}

              {activeTab === "categories" && (
                <CategoryBreakdown data={categoryBreakdown} />
              )}

              {activeTab === "investments" && (
                <InvestmentPortfolio data={investments} overview={overview} />
              )}
            </div>
          </div>
        </div>

        {/* Footer and Quick Tips */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Quick Tips */}
          <div className="bg-gradient-to-br from-blue-50/50 to-cyan-50/30 rounded-2xl p-6 border border-blue-100/50">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-400 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Quick Tips</h3>
            </div>
            <div className="space-y-4">
              {instructions.map((instruction, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    {index === 0 && <Download className="w-4 h-4 text-white" />}
                    {index === 1 && <PieChart className="w-4 h-4 text-white" />}
                    {index === 2 && <TrendingUp className="w-4 h-4 text-white" />}
                    {index === 3 && <BarChart3 className="w-4 h-4 text-white" />}
                  </div>
                  <p className="text-sm text-slate-600">{instruction}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-blue-100/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">AI Insights</p>
                  <p className="text-xs text-slate-500">Updated just now</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="flex flex-col justify-between bg-white/50 rounded-2xl p-6 border border-slate-200/50">
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Reports Management</h3>
              <p className="text-sm text-slate-600 mb-4">
                Your financial reports are automatically generated and updated daily.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Auto-refresh every 24 hours</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-full"
                >
                  Report an issue
                </Button>
                <Button
                  size="sm"
                  className="rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-4"
                >
                  View All Reports
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}