"use client";

import { useState, useEffect, useCallback } from "react";

interface Expense {
  id: number;
  amount: number;
  note: string | null;
  occurredAt: string;
  currency: string;
}

interface Income {
  id: number;
  amount: number;
  source: string | null;
  note: string | null;
  receivedAt: string;
  currency: string;
}

interface KPI {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

interface TransactionsState {
  expenses: Expense[];
  incomes: Income[];
  kpi: KPI;
  loading: boolean;
  error: string | null;
}

export function useTransactions() {
  const [state, setState] = useState<TransactionsState>({
    expenses: [],
    incomes: [],
    kpi: { totalIncome: 0, totalExpense: 0, balance: 0 },
    loading: true,
    error: null,
  });

  const fetchAll = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      // Fetch all data in parallel
      const [expensesRes, incomesRes, kpiRes] = await Promise.all([
        fetch("/api/expenses"),
        fetch("/api/incomes"),
        fetch("/api/kpi"),
      ]);

      if (!expensesRes.ok || !incomesRes.ok || !kpiRes.ok) {
        throw new Error("Failed to fetch data");
      }

      const [expenses, incomes, kpi] = await Promise.all([
        expensesRes.json(),
        incomesRes.json(),
        kpiRes.json(),
      ]);

      setState({
        expenses: Array.isArray(expenses) ? expenses : [],
        incomes: Array.isArray(incomes) ? incomes : [],
        kpi,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "Failed to load data",
      }));
    }
  }, []);

  const addExpense = useCallback(
    async (expense: Omit<Expense, "id">) => {
      try {
        const response = await fetch("/api/expenses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...expense,
            occurredAt: expense.occurredAt || new Date().toISOString(),
            currency: expense.currency || "USD",
          }),
        });

        if (!response.ok) throw new Error("Failed to add expense");

        const newExpense = await response.json();

        // Optimistically update state
        setState((prev) => ({
          ...prev,
          expenses: [newExpense, ...prev.expenses],
          kpi: {
            ...prev.kpi,
            totalExpense: prev.kpi.totalExpense + newExpense.amount,
            balance: prev.kpi.balance - newExpense.amount,
          },
        }));

        // Refresh data in background to ensure consistency
        setTimeout(() => fetchAll(), 500);

        return newExpense;
      } catch (error) {
        console.error("Error adding expense:", error);
        // Re-fetch to ensure data is consistent
        fetchAll();
        throw error;
      }
    },
    [fetchAll]
  );

  const addIncome = useCallback(
    async (income: Omit<Income, "id">) => {
      try {
        const response = await fetch("/api/incomes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...income,
            receivedAt: income.receivedAt || new Date().toISOString(),
            currency: income.currency || "USD",
            source: income.source || "Manual Entry",
          }),
        });

        if (!response.ok) throw new Error("Failed to add income");

        const newIncome = await response.json();

        // Optimistically update state
        setState((prev) => ({
          ...prev,
          incomes: [newIncome, ...prev.incomes],
          kpi: {
            ...prev.kpi,
            totalIncome: prev.kpi.totalIncome + newIncome.amount,
            balance: prev.kpi.balance + newIncome.amount,
          },
        }));

        // Refresh data in background
        setTimeout(() => fetchAll(), 500);

        return newIncome;
      } catch (error) {
        console.error("Error adding income:", error);
        fetchAll();
        throw error;
      }
    },
    [fetchAll]
  );

  // Initial fetch
  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return {
    ...state,
    fetchAll,
    addExpense,
    addIncome,
  };
}
