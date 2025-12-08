"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface Expense {
  id: number;
  amount: number;
  note: string | null;
  occurredAt: Date;
  currency: string;
}

interface Income {
  id: number;
  amount: number;
  source: string;
  note: string | null;
  receivedAt: Date;
  currency: string;
}

interface TransactionsContextType {
  expenses: Expense[];
  incomes: Income[];
  totalExpenses: number;
  totalIncome: number;
  balance: number;
  addExpense: (expense: Expense) => void;
  addIncome: (income: Income) => void;
  refreshTransactions: () => Promise<void>;
}

const TransactionsContext = createContext<TransactionsContextType | undefined>(
  undefined
);

export function TransactionsProvider({ children }: { children: ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);

  const refreshTransactions = async () => {
    try {
      // Fetch latest expenses and incomes
      const [expensesRes, incomesRes] = await Promise.all([
        fetch("/api/expenses"),
        fetch("/api/incomes"),
      ]);

      if (expensesRes.ok && incomesRes.ok) {
        const expensesData = await expensesRes.json();
        const incomesData = await incomesRes.json();

        setExpenses(expensesData.expenses || []);
        setIncomes(incomesData.incomes || []);
      }
    } catch (error) {
      console.error("Failed to refresh transactions:", error);
    }
  };

  const addExpense = (expense: Expense) => {
    setExpenses((prev) => [expense, ...prev]);
  };

  const addIncome = (income: Income) => {
    setIncomes((prev) => [income, ...prev]);
  };

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalIncome = incomes.reduce((sum, inc) => sum + inc.amount, 0);
  const balance = totalIncome - totalExpenses;

  return (
    <TransactionsContext.Provider
      value={{
        expenses,
        incomes,
        totalExpenses,
        totalIncome,
        balance,
        addExpense,
        addIncome,
        refreshTransactions,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionsContext);
  if (!context) {
    throw new Error("useTransactions must be used within TransactionsProvider");
  }
  return context;
}
