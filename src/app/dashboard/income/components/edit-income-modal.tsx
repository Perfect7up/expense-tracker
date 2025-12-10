"use client";

import { useState } from "react";
import { updateIncomeSchema } from "@/app/core/schema/income";
import { useIncomes } from "@/app/core/hooks/use-income"; // Ensure path is correct
import { useIncomeCategories } from "@/app/core/hooks/use-categories";
import { GenericEditModal } from "@/app/core/components/shared/generic-edit-modal";

interface EditIncomeModalProps {
  income: any;
}

export function EditIncomeModal({ income }: EditIncomeModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  // ✅ FIX: Get the boolean states directly from the hook
  const { updateIncome, deleteIncome, isUpdating, isDeleting } = useIncomes();

  const { data: categories } = useIncomeCategories();

  const handleOpenDeleteConfirm = () => setIsDeleteConfirmOpen(true);
  const handleCloseDeleteConfirm = () => setIsDeleteConfirmOpen(false);
  const handleClose = () => setIsOpen(false);

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-lg hover:bg-slate-100/50 transition-colors"
      >
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
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
      </button>

      <GenericEditModal
        isOpen={isOpen}
        onClose={handleClose}
        selectedItem={income}
        isDeleteConfirmOpen={isDeleteConfirmOpen}
        openDeleteConfirm={handleOpenDeleteConfirm}
        closeDeleteConfirm={handleCloseDeleteConfirm}
        // ✅ FIX: Call updateIncome() directly (it is already mutateAsync)
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
        // ✅ FIX: Call deleteIncome() directly
        deleteItem={async (id) => {
          await deleteIncome(id);
        }}
        categories={categories}
        // ✅ FIX: Pass the booleans from the hook, not properties of the function
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
    </>
  );
}
