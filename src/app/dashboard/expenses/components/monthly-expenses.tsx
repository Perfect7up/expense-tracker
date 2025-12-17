"use client";

import { useState, useMemo } from "react";
import { useExpenses } from "../hooks/use-expenses";
import { useExpenseCategories } from "@/app/core/hooks/use-categories";
import { EditExpenseModal } from "./edit-expense-modal";
import { useEditExpenseStore } from "../store/use-edit-expense-store";
import { Button } from "@/app/core/components/ui/button";
import { DollarSign, Plus } from "lucide-react";
import {
  MonthlyDataCard,
  DataItemRenderer,
  EmptyStateRenderer,
} from "@/app/core/components/shared/monthly-data-card";

interface ExpenseWithCategory {
  id: string;
  amount: number;
  note?: string | null;
  occurredAt: string | Date;
  currency: string;
  categoryId?: string | null;
  categoryName?: string | null;
  userId: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

interface MonthlyExpensesProps {
  selectedDate?: Date;
}

export function MonthlyExpenses({ selectedDate }: MonthlyExpensesProps) {
  const { expenses, isLoading, isError, error } = useExpenses();
  const { data: categories } = useExpenseCategories();
  const { onOpen } = useEditExpenseStore();

  // State
  const [currentMonth, setCurrentMonth] = useState<Date>(
    selectedDate || new Date()
  );
  const [lastSelectedDate, setLastSelectedDate] = useState<Date | undefined>(
    selectedDate
  );
  const ITEMS_PER_PAGE = 5;
  const [currentPage, setCurrentPage] = useState(1);

  // Sync with prop changes
  if (selectedDate !== lastSelectedDate) {
    setLastSelectedDate(selectedDate);
    if (selectedDate) {
      setCurrentMonth(selectedDate);
      setCurrentPage(1);
    }
  }

  // Map expenses with category names
  const mappedExpenses: ExpenseWithCategory[] = useMemo(() => {
    return (expenses || []).map((expense) => ({
      ...expense,
      categoryName: categories?.find((c) => c.id === expense.categoryId)?.name,
    }));
  }, [expenses, categories]);

  // Filter expenses for current month
  const filteredExpenses = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    return mappedExpenses.filter((expense) => {
      const expenseDate = new Date(expense.occurredAt);
      return (
        expenseDate.getFullYear() === year && expenseDate.getMonth() === month
      );
    });
  }, [mappedExpenses, currentMonth]);

  // Sort expenses by date
  const sortedExpenses = useMemo(() => {
    return [...filteredExpenses].sort(
      (a, b) =>
        new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime()
    );
  }, [filteredExpenses]);

  // Pagination
  const totalPages = Math.max(
    1,
    Math.ceil(sortedExpenses.length / ITEMS_PER_PAGE)
  );
  const paginatedExpenses = sortedExpenses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Statistics
  const monthlyTotal = useMemo(
    () => filteredExpenses.reduce((total, e) => total + e.amount, 0),
    [filteredExpenses]
  );

  const averageExpense =
    filteredExpenses.length > 0 ? monthlyTotal / filteredExpenses.length : 0;

  const highestExpense =
    filteredExpenses.length > 0
      ? Math.max(...filteredExpenses.map((e) => e.amount))
      : 0;

  const lowestExpense =
    filteredExpenses.length > 0
      ? Math.min(...filteredExpenses.map((e) => e.amount))
      : 0;

  // Export function
  const exportToCSV = () => {
    if (filteredExpenses.length === 0) {
      alert("No expenses to export for this month!");
      return;
    }

    const monthName = currentMonth.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
    const headers = ["Date", "Time", "Amount", "Currency", "Note", "Category"];
    const csvData = filteredExpenses.map((expense) => {
      const date = new Date(expense.occurredAt);
      return [
        date.toLocaleDateString(),
        date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        expense.amount?.toFixed(2) || "0.00",
        expense.currency || "USD",
        `"${(expense.note || "").replace(/"/g, '""')}"`,
        expense.categoryName || "Uncategorized",
      ];
    });

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `expenses-${monthName.toLowerCase().replace(" ", "-")}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  // Render functions
  const renderExpenseItem = (expense: ExpenseWithCategory) => (
    <DataItemRenderer
      key={expense.id}
      item={expense}
      type="expense"
      onEdit={() => onOpen(expense)}
    />
  );

  const renderEmptyState = () => (
    <EmptyStateRenderer
      type="expense"
      isCurrentMonth={
        currentMonth.getFullYear() === new Date().getFullYear() &&
        currentMonth.getMonth() === new Date().getMonth()
      }
    />
  );

  return (
    <>
      <EditExpenseModal />
      <MonthlyDataCard
        data={paginatedExpenses}
        isLoading={isLoading}
        isError={isError}
        error={error}
        title="Monthly Expenses"
        description="Track your monthly spending patterns"
        type="expense"
        icon={<DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-white" />}
        selectedDate={selectedDate}
        currentMonth={currentMonth}
        onMonthChange={setCurrentMonth}
        onCurrentMonthClick={() => {
          setCurrentMonth(new Date());
          setCurrentPage(1);
        }}
        onExport={exportToCSV}
        renderItem={renderExpenseItem}
        renderEmptyState={renderEmptyState}
        totalAmount={monthlyTotal}
        itemCount={filteredExpenses.length}
        averageAmount={averageExpense}
        highestAmount={highestExpense}
        lowestAmount={lowestExpense}
        showPagination={true}
        currentPage={currentPage}
        totalPages={totalPages}
        onPreviousPage={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        onNextPage={() =>
          setCurrentPage((prev) => Math.min(prev + 1, totalPages))
        }
        onPageChange={setCurrentPage}
        addButton={
          <Button className="w-full sm:w-auto rounded-xl bg-white/20 backdrop-blur-sm hover:bg-white/30 border border-white/30 text-white gap-2 px-4 h-10 sm:h-12 transition-all duration-300">
            <Plus className="h-4 w-4" />
            Add Expense
          </Button>
        }
      />
    </>
  );
}