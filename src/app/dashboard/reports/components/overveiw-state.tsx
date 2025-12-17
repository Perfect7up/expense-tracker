import { StatsGrid } from '@/app/core/components/shared/layout';
import { formatCurrency } from '../utils/utils';

interface OverviewStatsProps {
  data: {
    totalIncome: number;
    totalExpense: number;
    netBalance: number;
    activeSubscriptions: number;
  } | null;
  loading?: boolean;
}

export function OverviewStats({ data, loading = false }: OverviewStatsProps) {
  const calculatePercentageChange = (current: number, previous?: number) => {
    if (!previous || previous === 0) return '0';
    return (((current - previous) / previous) * 100).toFixed(1);
  };

  const previousMonthIncome = data?.totalIncome ? data.totalIncome * 0.9 : 0;
  const previousMonthExpense = data?.totalExpense ? data.totalExpense * 0.95 : 0;
  const previousMonthNet = data?.netBalance ? data.netBalance * 0.85 : 0;

  const stats = [
    {
      title: "Total Income",
      value: formatCurrency(data?.totalIncome || 0),
      description: "Monthly income total",
      icon: "trendingUp" as const,
      iconBg: "bg-linear-to-br from-green-500 to-emerald-400",
      loading: loading,
      percentageChange: calculatePercentageChange(data?.totalIncome || 0, previousMonthIncome),
    },
    {
      title: "Total Expenses",
      value: formatCurrency(data?.totalExpense || 0),
      description: "Monthly expense total",
      icon: "trendingDown" as const,
      iconBg: "bg-linear-to-br from-red-500 to-rose-400",
      loading: loading,
      percentageChange: calculatePercentageChange(data?.totalExpense || 0, previousMonthExpense),
    },
    {
      title: "Net Balance",
      value: formatCurrency(data?.netBalance || 0),
      description: "Net financial position",
      icon: "dollar" as const,
      iconBg: "bg-linear-to-br from-blue-500 to-cyan-400",
      loading: loading,
      percentageChange: calculatePercentageChange(data?.netBalance || 0, previousMonthNet),
    },
    {
      title: "Active Subscriptions",
      value: data?.activeSubscriptions || 0,
      description: "Recurring subscriptions",
      icon: "package" as const,
      iconBg: "bg-linear-to-br from-purple-500 to-pink-400",
      loading: loading,
    },
  ];


  return <StatsGrid stats={stats} />;
}