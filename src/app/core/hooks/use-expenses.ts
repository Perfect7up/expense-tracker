"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Expense, CreateExpenseInput } from "../types/expenses";

export function useExpenses() {
  const queryClient = useQueryClient();
  const expensesQuery = useQuery<Expense[]>({
    queryKey: ["expenses"],
    queryFn: async () => {
      console.log("🔄 Fetching expenses...");
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
      
      const data = await res.json();
      
      // Enhanced debugging
      console.group("📊 EXPENSES API RESPONSE");
      console.log("Total expenses:", data.length);
      
      // Check subscription data
      const expensesWithSubscriptions = data.filter((e: any) => e.subscriptionId || e.subscription);
      console.log("Expenses with subscriptions:", expensesWithSubscriptions.length);
      
      if (expensesWithSubscriptions.length > 0) {
        console.log("Sample expense with subscription:", expensesWithSubscriptions[0]);
      } else {
        console.log("No expenses have subscriptionId in the database!");
      }
      
      data.forEach((expense: any, index: number) => {
        if (expense.subscriptionId || expense.subscription) {
          console.log(`💰 Expense ${index + 1} has subscription:`, {
            id: expense.id,
            subscriptionId: expense.subscriptionId,
            subscriptionName: expense.subscriptionName,
            subscriptionObject: expense.subscription,
            amount: expense.amount
          });
        }
      });
      console.groupEnd();
      
      return data;
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
