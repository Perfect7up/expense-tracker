"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useIncomes() {
  const queryClient = useQueryClient();

  // GET incomes
  const incomesQuery = useQuery({
    queryKey: ["incomes"],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/incomes`);
        if (!res.ok) {
          const errorText = await res.text();
          console.error("GET incomes error:", errorText);
          throw new Error(`Failed to load incomes: ${res.status} ${errorText}`);
        }
        return res.json();
      } catch (error) {
        console.error("GET incomes fetch error:", error);
        throw error;
      }
    },
  });

  // CREATE income
  const createIncome = useMutation({
    mutationFn: async (data: any) => {
      try {
        const res = await fetch(`/api/incomes`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Failed to create income: ${errorText}`);
        }
        return res.json();
      } catch (error) {
        console.error("Create income error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incomes"] });
    },
  });

  // UPDATE income
  const updateIncome = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      try {
        const res = await fetch(`/api/incomes/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Failed to update income: ${errorText}`);
        }
        return res.json();
      } catch (error) {
        console.error("Update income error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incomes"] });
    },
  });

  // DELETE income - ADDED onSuccess and onError handlers
  const deleteIncome = useMutation({
    mutationFn: async (id: string) => {
      try {
        console.log("Attempting to delete income ID:", id);
        const res = await fetch(`/api/incomes/${id}`, {
          method: "DELETE",
        });

        console.log("Delete response status:", res.status);
        const responseText = await res.text();
        console.log("Delete response text:", responseText);

        if (!res.ok) {
          throw new Error(
            `Failed to delete income (${res.status}): ${responseText}`
          );
        }

        return responseText ? JSON.parse(responseText) : {};
      } catch (error) {
        console.error("Delete income fetch error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      console.log("Delete successful, invalidating queries");
      queryClient.invalidateQueries({ queryKey: ["incomes"] });
    },
    onError: (error: any) => {
      console.error("Delete mutation error:", error);
      alert(`Failed to delete income: ${error.message}`);
    },
  });

  return {
    incomesQuery,
    createIncome,
    updateIncome,
    deleteIncome,

    // Expose loading states
    isCreating: createIncome.isPending,
    isUpdating: updateIncome.isPending,
    isDeleting: deleteIncome.isPending,
  };
}
