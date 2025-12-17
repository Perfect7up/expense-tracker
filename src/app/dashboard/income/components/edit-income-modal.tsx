"use client";

import { useState, useEffect } from "react";
import { updateIncomeSchema } from "@/app/core/schema/income";
import { useIncomes } from "@/app/core/hooks/use-income";
import { useIncomeCategories } from "@/app/core/hooks/use-categories";
import { GenericEditModal } from "@/app/core/components/shared/generic-edit-modal";
import { useEditIncomeStore } from "../store/use-edit-income-store";

interface EditIncomeModalProps {
  income?: any; // Make income optional for backward compatibility
}

export function EditIncomeModal({ income: propIncome }: EditIncomeModalProps) {
  // Use store state
  const { isOpen, income: storeIncome, onClose } = useEditIncomeStore();
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  // Use prop if provided, otherwise use store income
  const income = propIncome || storeIncome;
  const shouldShow = isOpen || propIncome;

  const { updateIncome, deleteIncome, isUpdating, isDeleting } = useIncomes();
  const { data: categories } = useIncomeCategories();

  const handleOpenDeleteConfirm = () => setIsDeleteConfirmOpen(true);
  const handleCloseDeleteConfirm = () => setIsDeleteConfirmOpen(false);
  
  // Handle close for both prop and store patterns
  const handleClose = () => {
    if (propIncome) {
      // If using prop pattern, you might want to add state management here
      // For now, we'll just close the modal
      onClose();
    } else {
      onClose();
    }
    setIsDeleteConfirmOpen(false);
  };

  // If no income is provided (neither prop nor store), don't render anything
  if (!income) return null;

  return (
    <GenericEditModal
      isOpen={shouldShow}
      onClose={handleClose}
      selectedItem={income}
      isDeleteConfirmOpen={isDeleteConfirmOpen}
      openDeleteConfirm={handleOpenDeleteConfirm}
      closeDeleteConfirm={handleCloseDeleteConfirm}
      updateItem={async ({ id, data }) => {
        try {
          const payload = {
            ...data,
            amount: Number(data.amount),
            categoryId: data.categoryId === "none" ? null : data.categoryId,
            source: data.source === "" ? null : data.source,
            note: data.note === "" ? null : data.note,
            receivedAt: new Date(data.receivedAt).toISOString(),
          };
          await updateIncome({ id, data: payload });
        } catch (error: any) {
          console.error("Update error:", error);
          throw error;
        }
      }}
      deleteItem={async (id) => {
        await deleteIncome(id);
      }}
      categories={categories}
      isUpdating={isUpdating}
      isDeleting={isDeleting}
      title="Edit Income"
      description="Update your income details"
      itemType="income"
      schema={updateIncomeSchema}
      defaultValues={{
        amount: Number(income.amount),
        source: income.source ?? "",
        note: income.note ?? "",
        categoryId: income.categoryId ?? "none",
        receivedAt: new Date(income.receivedAt).toISOString().slice(0, 16),
        currency: income.currency ?? "USD",
      }}
      dateField={{
        label: "Received At",
        fieldName: "receivedAt",
      }}
      extraFields={[
        {
          name: "source",
          label: "Source",
          type: "text",
          placeholder: "Salary, business, etc.",
          icon: (
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          ),
        },
      ]}
      formatAmount={(amount) => `$${amount.toFixed(2)}`}
      getItemId={(item) => item.id}
      getItemAmount={(item) => item.amount}
      getItemNote={(item) => item.note || ""}
    />
  );
}