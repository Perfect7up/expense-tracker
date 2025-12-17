"use client";

import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import { 
  TrendingUp, 
  Plus,
  ArrowRight
} from "lucide-react";

import { BackgroundEffects, PageHeader, StatsGrid } from "@/app/core/components/shared/layout";
import { Button } from "@/app/core/components/ui/button";

import { InvestmentModal } from "./components/investment-modal";
import { InvestmentList } from "./components/investment-list";

import { Investment } from "@/app/dashboard/investment/types/investments";
import { InvestmentFormValues } from "@/app/dashboard/investment/schema/investments";

export default function InvestmentsPage() {
  const [data, setData] = useState<Investment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInvestment, setEditingInvestment] = useState<Investment | null>(null);

  const fetchInvestments = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/investments");
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      setData(json);
    } catch (error) {
      toast.error("Failed to load investments");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvestments();
  }, []);

  const handleOpenCreate = () => {
    setEditingInvestment(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (inv: Investment) => {
    setEditingInvestment(inv);
    setIsModalOpen(true);
  };

  const handleCreateOrUpdate = async (values: InvestmentFormValues) => {
    try {
      const method = editingInvestment ? "PUT" : "POST";
      const url = editingInvestment
        ? `/api/investments/${editingInvestment.id}`
        : "/api/investments";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error("Operation failed");

      toast.success(editingInvestment ? "Investment updated" : "Investment added");
      setIsModalOpen(false);
      setEditingInvestment(null);
      fetchInvestments(); // Refresh list
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/investments/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");

      toast.success("Investment deleted");
      fetchInvestments();
    } catch (error) {
      toast.error("Failed to delete investment");
    }
  };

  // --- Stats Calculation ---
  const stats = useMemo(() => {
    const totalInvested = data.reduce((acc, curr) => acc + (curr.quantity * curr.averageBuyPrice), 0);
    
    const currentValue = data.reduce((acc, curr) => {
      const price = curr.currentPrice ?? curr.averageBuyPrice;
      return acc + (curr.quantity * price);
    }, 0);

    const totalReturn = currentValue - totalInvested;
    const returnPercentage = totalInvested > 0 ? (totalReturn / totalInvested) * 100 : 0;

    // Find top performer (simple logic: highest % gain)
    let topPerformer = "N/A";
    let highestReturn = -Infinity;

    data.forEach(inv => {
      if (inv.currentPrice && inv.averageBuyPrice > 0) {
        const gain = ((inv.currentPrice - inv.averageBuyPrice) / inv.averageBuyPrice) * 100;
        if (gain > highestReturn) {
          highestReturn = gain;
          topPerformer = inv.symbol || inv.name;
        }
      }
    });

    return {
      totalInvested,
      currentValue,
      totalReturn,
      returnPercentage,
      topPerformer: highestReturn > -Infinity ? topPerformer : "None"
    };
  }, [data]);

  const pageStats = [
    {
      title: "Portfolio Value",
      value: stats.currentValue.toFixed(2),
      description: "Total current assets",
      icon: "trendingUp" as const,
      // Emerald Gradient
      iconBg: "bg-linear-to-br from-emerald-500 to-teal-400",
      loading: isLoading,
      prefix: "$"
    },
    {
      title: "Total Invested",
      value: stats.totalInvested.toFixed(2),
      description: "Cost basis",
      icon: "wallet" as const,
      // Blue Gradient
      iconBg: "bg-linear-to-br from-blue-500 to-cyan-400",
      loading: isLoading,
      prefix: "$"
    },
    {
      title: "Total Return",
      value: stats.totalReturn.toFixed(2),
      description: `${stats.returnPercentage.toFixed(1)}% all time`,
      icon: "pieChart" as const, // Maps to Lucide PieChart via StatsGrid logic
      // Purple Gradient
      iconBg: "bg-linear-to-br from-violet-500 to-purple-400",
      loading: isLoading,
      prefix: stats.totalReturn > 0 ? "+$" : "$"
    },
    {
      title: "Top Performer",
      value: stats.topPerformer,
      description: "Highest % gain",
      icon: "activity" as const,
      // Amber/Orange Gradient
      iconBg: "bg-linear-to-br from-amber-500 to-orange-400",
      loading: isLoading,
      // No prefix for text value
    },
  ];

  return (
    <div className="relative min-h-screen px-4 py-8 overflow-hidden">
      <BackgroundEffects />

      <div className="container mx-auto space-y-8">
        <PageHeader
          title="INVESTMENTS"
          description="Track your portfolio performance, analyze returns, and manage your assets."
          icon={<TrendingUp className="w-4 h-4" />}
          tagline="Portfolio & Assets"
        >
          <div className="flex justify-end">
            <Button
              onClick={handleOpenCreate}
              className="flex items-center gap-2 rounded-full bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 h-12 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 group"
            >
              <Plus className="w-4 h-4" />
              Add Asset
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </PageHeader>
        <StatsGrid stats={pageStats} />
        <InvestmentList 
          data={data}
          isLoading={isLoading}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
        />

        <InvestmentModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          investment={editingInvestment}
          onSubmit={handleCreateOrUpdate}
        />
      </div>
    </div>
  );
}