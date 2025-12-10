"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useIncomes() {
  const queryClient = useQueryClient();

  const incomesQuery = useQuery({
    queryKey: ["incomes"],
    queryFn: async () => {
      const res = await fetch(`/api/incomes`);
      if (!res.ok) {
        throw new Error("Failed to load incomes");
      }
      return res.json();
    },
  });

  const createIncome = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch(`/api/incomes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.message || errorData.error || "Failed to create"
        );
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incomes"] });
    },
  });

  const updateIncome = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await fetch(`/api/incomes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.message || errorData.error || "Failed to update"
        );
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incomes"] });
    },
  });

  const deleteIncome = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/incomes/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to delete");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incomes"] });
    },
  });

  return {
    // Data
    incomes: incomesQuery.data || [],
    isLoading: incomesQuery.isLoading,
    isError: incomesQuery.isError,
    error: incomesQuery.error,

    // Create
    createIncome: createIncome.mutateAsync,
    isCreating: createIncome.isPending,

    // Update
    updateIncome: updateIncome.mutateAsync, // This returns the FUNCTION
    isUpdating: updateIncome.isPending, // This returns the BOOLEAN

    // Delete
    deleteIncome: deleteIncome.mutateAsync, // This returns the FUNCTION
    isDeleting: deleteIncome.isPending, // This returns the BOOLEAN
  };
}
