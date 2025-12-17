"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/core/components/ui/card";
import { formatCurrency } from "../utils/utils";
import type { InvestmentData } from "../hooks/use-reports-data";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  BarChart3,
  ChevronRight,
  TrendingUp as GrowthIcon,
  Shield,
  Zap,
  Sparkles,
  LineChart,
  AlertCircle,
  Briefcase,
  Coins,
  Gem,
} from "lucide-react";
import { Button } from "@/app/core/components/ui/button";
import { cn } from "@/app/core/lib/utils";

interface InvestmentPortfolioProps {
  data: InvestmentData[] | null | undefined;
  overview?: {
    totalInvested?: number;
    currentValue?: number;
    profitLoss?: number;
    roi?: number;
    annualReturn?: number;
  };
}

export function InvestmentPortfolio({ data, overview }: InvestmentPortfolioProps) {
  // Handle null/undefined or invalid data
  const isValidData = Array.isArray(data);
  const investments = isValidData ? data : [];
  
  const totalInvested = overview?.totalInvested || 0;
  const currentValue = overview?.currentValue || 0;
  const profitLoss = overview?.profitLoss || 0;
  const roi = overview?.roi || (totalInvested > 0 ? ((currentValue - totalInvested) / totalInvested) * 100 : 0);
  const isPositive = profitLoss >= 0;

  // Determine investment type based on name or calculate profit percentage
  const getInvestmentType = (investment: InvestmentData) => {
    const name = investment.name.toLowerCase();
    if (name.includes('stock') || name.includes('etf') || name.includes('mutual')) return 'stocks';
    if (name.includes('bond') || name.includes('treasury')) return 'bonds';
    if (name.includes('crypto') || name.includes('bitcoin') || name.includes('eth')) return 'crypto';
    if (name.includes('real') || name.includes('property')) return 'real-estate';
    return 'other';
  };

  const getInvestmentIcon = (investment: InvestmentData) => {
    const type = getInvestmentType(investment);
    switch (type) {
      case 'stocks': return TrendingUp;
      case 'bonds': return Shield;
      case 'crypto': return Zap;
      case 'real-estate': return Gem;
      default: return Briefcase;
    }
  };

  const getInvestmentColor = (investment: InvestmentData) => {
    const type = getInvestmentType(investment);
    switch (type) {
      case 'stocks': return "from-emerald-400 to-green-500";
      case 'bonds': return "from-blue-400 to-cyan-500";
      case 'crypto': return "from-orange-400 to-amber-500";
      case 'real-estate': return "from-purple-400 to-violet-500";
      default: return "from-slate-400 to-gray-500";
    }
  };

  return (
    <Card className="relative overflow-hidden bg-white/80 backdrop-blur-sm border border-slate-200/50 shadow-xl rounded-2xl group hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300">
      {/* Background gradient accents */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-100/20 rounded-full blur-3xl group-hover:bg-blue-100/30 transition-all duration-500" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-100/20 rounded-full blur-3xl group-hover:bg-emerald-100/30 transition-all duration-500" />

      <CardHeader className="relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <LineChart className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-slate-900">
                Investment Portfolio
              </CardTitle>
              <CardDescription className="text-slate-500">
                Performance & growth of your investments
              </CardDescription>
            </div>
          </div>
          {isValidData && investments.length > 0 && (
            <div className={cn(
              "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium",
              isPositive 
                ? "bg-emerald-50 text-emerald-600" 
                : "bg-red-50 text-red-600"
            )}>
              {isPositive ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>{roi.toFixed(1)}% ROI</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="relative z-10 space-y-6">
        {/* Performance Overview Cards */}
        {isValidData && investments.length > 0 ? (
          <>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50/50 rounded-xl p-5 border border-blue-100/50 hover:border-blue-200 transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Total Invested</p>
                    <p className="text-xl font-bold text-slate-900">
                      {formatCurrency(totalInvested)}
                    </p>
                  </div>
                </div>
                <div className="text-xs text-slate-400">
                  Across {investments.length} assets
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-green-50/50 rounded-xl p-5 border border-emerald-100/50 hover:border-emerald-200 transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Current Value</p>
                    <p className="text-xl font-bold text-slate-900">
                      {formatCurrency(currentValue)}
                    </p>
                  </div>
                </div>
                <div className="text-xs text-emerald-600 font-medium">
                  {formatCurrency(currentValue - totalInvested)}
                </div>
              </div>

              <div className={cn(
                "rounded-xl p-5 border transition-all duration-300",
                isPositive
                  ? "bg-gradient-to-br from-emerald-50 to-green-50/50 border-emerald-100/50 hover:border-emerald-200"
                  : "bg-gradient-to-br from-red-50 to-orange-50/50 border-red-100/50 hover:border-red-200"
              )}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    isPositive
                      ? "bg-gradient-to-br from-emerald-400 to-green-500"
                      : "bg-gradient-to-br from-red-400 to-orange-500"
                  )}>
                    <GrowthIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Profit/Loss</p>
                    <p className={cn(
                      "text-xl font-bold",
                      isPositive ? "text-emerald-600" : "text-red-600"
                    )}>
                      {formatCurrency(profitLoss)}
                    </p>
                  </div>
                </div>
                <div className={cn(
                  "text-xs font-medium",
                  isPositive ? "text-emerald-600" : "text-red-600"
                )}>
                  {isPositive ? '+' : ''}{roi.toFixed(1)}% return
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-violet-50/50 rounded-xl p-5 border border-purple-100/50 hover:border-purple-200 transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-400 to-violet-500 flex items-center justify-center">
                    <PieChart className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Diversification</p>
                    <p className="text-xl font-bold text-slate-900">
                      {investments.length} Assets
                    </p>
                  </div>
                </div>
                <div className="text-xs text-slate-400">
                  {investments.length > 3 ? "Well diversified" : "Consider adding more"}
                </div>
              </div>
            </div>

            {/* Investment List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900">Your Investments</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-full text-xs"
                >
                  Manage Portfolio
                  <ChevronRight className="ml-1 w-3 h-3" />
                </Button>
              </div>

              <div className="space-y-3">
                {investments.map((inv) => {
                  const invProfitLoss = inv.profitLoss || 0;
                  const invIsPositive = invProfitLoss >= 0;
                  const invRoi = inv.investedAmount > 0 
                    ? ((inv.currentValue - inv.investedAmount) / inv.investedAmount) * 100 
                    : 0;
                  const Icon = getInvestmentIcon(inv);
                  const colorClass = getInvestmentColor(inv);
                  const type = getInvestmentType(inv);

                  return (
                    <div
                      key={inv.id}
                      className="bg-gradient-to-br from-white to-blue-50/30 rounded-xl p-4 border border-slate-200/50 hover:border-blue-200 transition-all duration-300 hover:shadow-md group/investment"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center",
                            colorClass
                          )}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900">{inv.name}</h4>
                            <div className="flex items-center gap-2">
                              <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full capitalize">
                                {type.replace('-', ' ')}
                              </span>
                              <span className="text-sm text-slate-500">
                                • {inv.quantity || 0} units
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={cn(
                            "text-lg font-bold",
                            invIsPositive ? "text-emerald-600" : "text-red-600"
                          )}>
                            {formatCurrency(invProfitLoss)}
                          </p>
                          <p className="text-sm font-medium text-slate-500">
                            {invIsPositive ? '+' : ''}{invRoi.toFixed(1)}% ROI
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="bg-white/50 rounded-lg p-3">
                          <p className="text-xs text-slate-500 mb-1">Invested</p>
                          <p className="font-semibold text-slate-900">
                            {formatCurrency(inv.investedAmount || 0)}
                          </p>
                        </div>
                        <div className="bg-white/50 rounded-lg p-3">
                          <p className="text-xs text-slate-500 mb-1">Current</p>
                          <p className="font-semibold text-slate-900">
                            {formatCurrency(inv.currentValue || 0)}
                          </p>
                        </div>
                        <div className="bg-white/50 rounded-lg p-3">
                          <p className="text-xs text-slate-500 mb-1">Weight</p>
                          <p className="font-semibold text-slate-900">
                            {totalInvested > 0 
                              ? `${((inv.investedAmount || 0) / totalInvested * 100).toFixed(1)}%` 
                              : "0%"}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center gap-2">
                        <div className="flex-1 bg-slate-200/50 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={cn(
                              "h-1.5 rounded-full transition-all duration-500",
                              invIsPositive
                                ? "bg-gradient-to-r from-emerald-400 to-green-500"
                                : "bg-gradient-to-r from-red-400 to-orange-500"
                            )}
                            style={{
                              width: `${Math.min(Math.abs(invRoi), 100)}%`,
                            }}
                          />
                        </div>
                        <span className="text-xs text-slate-500">
                          Performance
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Performance Insights */}
            <div className="bg-gradient-to-r from-blue-50/50 to-cyan-50/30 rounded-xl p-4 border border-blue-100/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Portfolio Insight</p>
                    <p className="text-sm text-slate-500">
                      {isPositive
                        ? `Your portfolio is up ${roi.toFixed(1)}% overall. Keep up the good work!`
                        : `Consider rebalancing your portfolio to minimize losses.`}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-full"
                >
                  View Analysis
                  <ChevronRight className="ml-1 w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center mx-auto mb-4">
              {isValidData ? (
                <LineChart className="w-8 h-8 text-blue-400" />
              ) : (
                <AlertCircle className="w-8 h-8 text-blue-400" />
              )}
            </div>
            <p className="text-slate-500">
              {!isValidData ? "Investment data unavailable" : "No investments found"}
            </p>
            <p className="text-sm text-slate-400 mt-1">
              {!isValidData 
                ? "Data is not in the expected format"
                : "Start building your investment portfolio today"
              }
            </p>
            <Button className="mt-4 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 shadow-lg shadow-blue-500/30">
              Start Investing
              <ChevronRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}