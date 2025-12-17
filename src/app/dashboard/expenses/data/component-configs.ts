import { Calendar, TrendingUp, BarChart3, Sparkles, Target, PieChart } from "lucide-react";


export const STATS_CARDS_CONFIG = {
  iconSize: "w-4 h-4",
  stats: [
    {
      title: "This Month",
      description: "Current month total",
      icon: "calendarDays" as const,
      iconBg: "bg-linear-to-br from-blue-500 to-cyan-400",
    },
    {
      title: "Last Month",
      description: "Previous period total",
      icon: "calendar" as const,
      iconBg: "bg-linear-to-br from-slate-600 to-slate-400",
    },
    {
      title: "This Year",
      description: "Year-to-date total",
      icon: "trendingUp" as const,
      iconBg: "bg-linear-to-br from-green-500 to-emerald-400",
    },
    {
      title: "Monthly Avg",
      description: "Average spending",
      icon: "barChart" as const,
      iconBg: "bg-linear-to-br from-purple-500 to-pink-400",
    },
  ],
} as const;


export const CALENDAR_VIEW_CONFIG = {
  icon: Calendar,
  title: "Calendar View",
  description: "Select dates to view expenses",
  gradient: "from-blue-50 to-cyan-50/50",
  border: "border-blue-100/50",
  iconGradient: "from-blue-500 to-cyan-400",
} as const;

export const MONTHLY_VIEW_CONFIG = {
  icon: PieChart,
  title: "Monthly Expenses Analysis",
  description: "Spending trends and breakdown",
  gradient: "from-blue-50 to-cyan-50/50",
  border: "border-blue-100/50",
  iconGradient: "from-purple-400 to-pink-500",
} as const;

export const ANALYTICS_CONFIG = {
  icon: BarChart3,
  title: "Expense Analytics",
  description: "Detailed insights and trends",
  gradient: "from-blue-50 to-cyan-50/50",
  border: "border-blue-100/50",
  iconGradient: "from-orange-400 to-amber-500",
} as const;

export const SPENDING_TRENDS_CONFIG = {
  icon: TrendingUp,
  title: "Spending Trends",
  description: "Monthly comparisons",
  gradient: "from-emerald-50 to-green-50/30",
  border: "border-emerald-100/50",
  iconGradient: "from-emerald-400 to-green-500",
} as const;

export const AI_INSIGHTS_CONFIG = {
  icon: Sparkles,
  title: "AI Insights",
  description: "Smart recommendations",
  gradient: "from-purple-50 to-pink-50/30",
  border: "border-purple-100/50",
  iconGradient: "from-purple-400 to-pink-500",
} as const;

export const QUICK_ACTIONS_CONFIG = {
  icon: Target,
  title: "Track Your Progress",
  description: "Stay on top of your financial goals with regular tracking",
  gradient: "from-blue-50/50 to-cyan-50/30",
  border: "border-blue-100/50",
  iconGradient: "from-blue-400 to-cyan-500",
} as const;