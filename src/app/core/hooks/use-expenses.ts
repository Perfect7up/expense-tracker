"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Expense, CreateExpenseInput } from "../types/expenses";

export function useExpenses() {
  const queryClient = useQueryClient();

  const expensesQuery = useQuery<Expense[]>({
    queryKey: ["expenses"],
    queryFn: async () => {
      const res = await fetch("/api/expenses");
      if (!res.ok) {
        let errorMessage = "Failed to load expenses";
        try {
          const errorData = await res.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          errorMessage = res.statusText;
        }
        throw new Error(errorMessage);
      }
      return res.json();
    },
  });

  // Inside useExpenses hook...

  const createExpenseMutation = useMutation<Expense, Error, CreateExpenseInput>(
    {
      mutationFn: async (data: CreateExpenseInput) => {
        const res = await fetch("/api/expenses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (!res.ok) {
          let errorMessage = "Failed to create expense";
          try {
            const errorData = await res.json();
            // If validation details exist, log them to console for debugging
            if (errorData.details) {
              console.error("Validation Errors:", errorData.details);
              errorMessage = `Validation Error: ${JSON.stringify(errorData.details)}`;
            } else {
              errorMessage = errorData.error || errorMessage;
            }
          } catch {
            errorMessage = res.statusText;
          }
          throw new Error(errorMessage);
        }
        return res.json();
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["expenses"] });
      },
    }
  );

  // Add update mutation
  const updateExpenseMutation = useMutation<
    Expense,
    Error,
    { id: string; data: Partial<CreateExpenseInput> }
  >({
    mutationFn: async ({ id, data }) => {
      const res = await fetch(`/api/expenses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        let errorMessage = "Failed to update expense";
        try {
          const errorData = await res.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          errorMessage = res.statusText;
        }
        throw new Error(errorMessage);
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });

  // Add delete mutation
  const deleteExpenseMutation = useMutation<void, Error, string>({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/expenses/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        let errorMessage = "Failed to delete expense";
        try {
          const errorData = await res.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          errorMessage = res.statusText;
        }
        throw new Error(errorMessage);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });

  return {
    expenses: expensesQuery.data || [],
    isLoading: expensesQuery.isLoading,
    isError: expensesQuery.isError,
    error: expensesQuery.error,

    // Create
    createExpense: createExpenseMutation.mutateAsync,
    isCreating: createExpenseMutation.isPending,

    // Update
    updateExpense: updateExpenseMutation.mutateAsync,
    isUpdating: updateExpenseMutation.isPending,

    // Delete
    deleteExpense: deleteExpenseMutation.mutateAsync,
    isDeleting: deleteExpenseMutation.isPending,
  };
}
