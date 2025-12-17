"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

export type Subscription = {
  id: string;
  name: string;
  amount: number;
  currency: string;
  cycle: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY" | "QUARTERLY" | "BIANNUALLY";
  nextBilling: string;
  isActive: boolean;
  category: string;
  startDate: string;
  endDate: string | null;
  note: string | null;
  autoExpense: boolean;
};

type SubscriptionFormData = Omit<Subscription, "id">;

export function useSubscription() {
  const queryClient = useQueryClient();

  // Fetch all subscriptions
  const {
    data: subscriptions = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Subscription[]>({
    queryKey: ["subscription"],
    queryFn: async () => {
      const res = await axios.get("/api/subscription");
      return res.data;
    },
  });

  // Create subscription
  const createMutation = useMutation({
    mutationFn: async (data: SubscriptionFormData) => {
      const res = await axios.post("/api/subscription", data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Subscription created successfully");
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create subscription");
    },
  });

  // Update subscription
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<SubscriptionFormData> }) => {
      const res = await axios.put(`/api/subscription/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Subscription updated successfully");
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update subscription");
    },
  });

  // Delete subscription
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/subscription/${id}`);
    },
    onSuccess: () => {
      toast.success("Subscription deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
    },
    onError: () => {
      toast.error("Failed to delete subscription");
    },
  });

  // Calculate stats
  const calculateStats = () => {
    const activeSubs = subscriptions.filter((s) => s.isActive);
    
    const totalMonthlyCost = activeSubs.reduce((acc, curr) => {
      let multiplier = 1;
      if (curr.cycle === "YEARLY") multiplier = 1 / 12;
      if (curr.cycle === "QUARTERLY") multiplier = 1 / 3;
      if (curr.cycle === "BIANNUALLY") multiplier = 1 / 6;
      if (curr.cycle === "WEEKLY") multiplier = 4.33;
      if (curr.cycle === "DAILY") multiplier = 30.44;
      return acc + curr.amount * multiplier;
    }, 0);

    return {
      activeCount: activeSubs.length,
      monthlyCost: totalMonthlyCost,
      yearlyCost: totalMonthlyCost * 12,
      allSubscriptions: subscriptions,
    };
  };

  // Format cycle
  const formatCycle = (cycle: string) => {
    const cycleMap: Record<string, string> = {
      "DAILY": "Daily",
      "WEEKLY": "Weekly", 
      "MONTHLY": "Monthly",
      "QUARTERLY": "Quarterly",
      "BIANNUALLY": "Every 6 Months",
      "YEARLY": "Yearly"
    };
    return cycleMap[cycle] || cycle.toLowerCase();
  };

  return {
    // Data
    subscriptions,
    isLoading,
    isError,
    error,
    stats: calculateStats(),
    
    // Actions
    refetch,
    createSubscription: createMutation.mutateAsync,
    updateSubscription: updateMutation.mutateAsync,
    deleteSubscription: deleteMutation.mutateAsync,
    
    // Status
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    
    // Utilities
    formatCycle,
  };
}