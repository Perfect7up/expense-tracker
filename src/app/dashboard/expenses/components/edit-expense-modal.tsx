"use client";

import { useCallback } from "react";
import { expenseSchema } from "@/app/dashboard/expenses/schema/expense";
import { useExpenses } from "../hooks/use-expenses";
import { useExpenseCategories } from "@/app/core/hooks/use-categories";
import { useSubscription } from "@/app/core/hooks/use-subscription";
import { useEditExpenseStore } from "../store/use-edit-expense-store";
import { GenericEditModal } from "@/app/core/components/shared/generic-edit-modal";

export function EditExpenseModal() {
  const {
    isOpen,
    onClose,
    selectedExpense,
    isDeleteConfirmOpen,
    openDeleteConfirm,
    closeDeleteConfirm,
  } = useEditExpenseStore();

  const { updateExpense, deleteExpense, isUpdating, isDeleting } =
    useExpenses();
  const { data: categories } = useExpenseCategories();
  const { subscriptions } = useSubscription();

  const handleUpdate = useCallback(
    async ({ id, data }: { id: string; data: any }) => {
      await updateExpense({ id, data });
    },
    [updateExpense]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      await deleteExpense(id);
    },
    [deleteExpense]
  );

  if (!isOpen) return null;

  return (
    <GenericEditModal
      isOpen={isOpen}
      onClose={onClose}
      selectedItem={selectedExpense}
      isDeleteConfirmOpen={isDeleteConfirmOpen}
      openDeleteConfirm={openDeleteConfirm}
      closeDeleteConfirm={closeDeleteConfirm}
      updateItem={handleUpdate}
      deleteItem={handleDelete}
      categories={categories}
      subscriptions={subscriptions} // Pass subscriptions
      isUpdating={isUpdating}
      isDeleting={isDeleting}
      title="Edit Expense"
      description="Update your spending details"
      itemType="expense"
      schema={expenseSchema}
      defaultValues={{
        amount: 0,
        currency: "USD",
        note: "",
        categoryId: "none",
        subscriptionId: "none",
        occurredAt: new Date().toISOString().slice(0, 16),
      }}
      dateField={{
        label: "Date & Time",
        fieldName: "occurredAt",
      }}
      formatAmount={(amount) => `$${amount.toFixed(2)}`}
      getItemId={(item) => item.id}
      getItemAmount={(item) => item.amount}
      getItemNote={(item) => item.note || ""}
      getItemCategory={(item) => item.categoryId || null}
      getItemSubscription={(item) => item.subscriptionId || null}
    />
  );
}