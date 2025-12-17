"use client";

import { useState, useMemo } from "react";
import { useIncomes } from "@/app/dashboard/income/hooks/use-income";
import { useIncomeCategories } from "@/app/core/hooks/use-categories";
import { Button } from "@/app/core/components/ui/button";
import { Wallet, Plus } from "lucide-react";
import {
  MonthlyDataCard,
  DataItemRenderer,
  EmptyStateRenderer,
} from "@/app/core/components/shared/monthly-data-card";
import { EditIncomeModal } from "./edit-income-modal";
import { IncomeForm } from "./income-form";

interface IncomeWithCategory {
  id: string;
  amount: number;
  note?: string | null;
  receivedAt: string | Date;
  currency: string;
  source?: string;
  categoryId?: string | null;
  categoryName?: string | null;
  userId: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

interface MonthlyIncomesProps {
  selectedDate?: Date;
}

export function MonthlyIncomes({ selectedDate }: MonthlyIncomesProps) {
  const { incomes: rawIncomes, isLoading, isError, error } = useIncomes();
  const { data: categories } = useIncomeCategories();

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

  // Map data with category names
  const mappedIncomes: IncomeWithCategory[] = useMemo(() => {
    return (rawIncomes || []).map((income: any) => ({
      ...income,
      categoryName:
        income.category?.name ||
        categories?.find((c) => c.id === income.categoryId)?.name ||
        "Uncategorized",
    }));
  }, [rawIncomes, categories]);

  // Filter incomes for current month
  const filteredIncomes = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    return mappedIncomes.filter((income) => {
      const incomeDate = new Date(income.receivedAt);
      return (
        incomeDate.getFullYear() === year && incomeDate.getMonth() === month
      );
    });
  }, [mappedIncomes, currentMonth]);

  // Sort incomes by date
  const sortedIncomes = useMemo(() => {
    return [...filteredIncomes].sort(
      (a, b) =>
        new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime()
    );
  }, [filteredIncomes]);

  // Pagination
  const totalPages = Math.max(
    1,
    Math.ceil(sortedIncomes.length / ITEMS_PER_PAGE)
  );
  const paginatedIncomes = sortedIncomes.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Statistics
  const monthlyTotal = useMemo(
    () => filteredIncomes.reduce((total, e) => total + Number(e.amount), 0),
    [filteredIncomes]
  );

  const averageIncome =
    filteredIncomes.length > 0 ? monthlyTotal / filteredIncomes.length : 0;

  const highestIncome =
    filteredIncomes.length > 0
      ? Math.max(...filteredIncomes.map((e) => Number(e.amount)))
      : 0;

  const lowestIncome =
    filteredIncomes.length > 0
      ? Math.min(...filteredIncomes.map((e) => Number(e.amount)))
      : 0;

  // Export function
  const exportToCSV = () => {
    if (filteredIncomes.length === 0) {
      alert("No incomes to export for this month!");
      return;
    }

    const monthName = currentMonth.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
    const headers = [
      "Date",
      "Time",
      "Amount",
      "Currency",
      "Source",
      "Note",
      "Category",
    ];
    const csvData = filteredIncomes.map((income) => {
      const date = new Date(income.receivedAt);
      return [
        date.toLocaleDateString(),
        date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        Number(income.amount).toFixed(2),
        income.currency || "USD",
        income.source || "",
        `"${(income.note || "").replace(/"/g, '""')}"`,
        income.categoryName || "Uncategorized",
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
      `incomes-${monthName.toLowerCase().replace(" ", "-")}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const renderIncomeItem = (income: IncomeWithCategory) => (
    <DataItemRenderer
      key={income.id}
      item={income}
      type="income"
      action={<EditIncomeModal income={income} />}
    />
  );

  const renderEmptyState = () => (
    <EmptyStateRenderer
      type="income"
      isCurrentMonth={
        currentMonth.getFullYear() === new Date().getFullYear() &&
        currentMonth.getMonth() === new Date().getMonth()
      }
    />
  );

  return (
    <MonthlyDataCard
      data={paginatedIncomes}
      isLoading={isLoading}
      isError={isError}
      error={error as Error | undefined}
      title="Monthly Incomes"
      description="Track your monthly income patterns"
      type="income"
      icon={<Wallet className="w-5 h-5 sm:w-6 sm:h-6 text-white" />}
      selectedDate={selectedDate}
      currentMonth={currentMonth}
      onMonthChange={setCurrentMonth}
      onCurrentMonthClick={() => {
        setCurrentMonth(new Date());
        setCurrentPage(1);
      }}
      onExport={exportToCSV}
      renderItem={renderIncomeItem}
      renderEmptyState={renderEmptyState}
      totalAmount={monthlyTotal}
      itemCount={filteredIncomes.length}
      averageAmount={averageIncome}
      highestAmount={highestIncome}
      lowestAmount={lowestIncome}
      showPagination={true}
      currentPage={currentPage}
      totalPages={totalPages}
      onPreviousPage={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
      onNextPage={() =>
        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
      }
      onPageChange={setCurrentPage}
      // Added justify-center to the Button to fix alignment
      addButton={
        <Button className="w-full sm:w-auto rounded-xl bg-white/20 backdrop-blur-sm hover:bg-white/30 border border-white/30 text-white gap-2 px-4 h-10 sm:h-12 transition-all duration-300">
          <Plus className="h-4 w-4" />
          Add Income
        </Button>
      }
    />
  );
}