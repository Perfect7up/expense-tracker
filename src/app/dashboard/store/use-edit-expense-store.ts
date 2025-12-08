import { create } from "zustand";
import { Expense } from "@/app/core/types/expenses";

interface EditExpenseState {
  isOpen: boolean;
  isDeleteConfirmOpen: boolean;
  selectedExpense: Expense | null;

  // Actions
  onOpen: (expense: Expense) => void;
  onClose: () => void;
  openDeleteConfirm: () => void;
  closeDeleteConfirm: () => void;
}

export const useEditExpenseStore = create<EditExpenseState>((set) => ({
  isOpen: false,
  isDeleteConfirmOpen: false,
  selectedExpense: null,

  onOpen: (expense) => set({ isOpen: true, selectedExpense: expense }),
  onClose: () =>
    set({ isOpen: false, isDeleteConfirmOpen: false, selectedExpense: null }),

  openDeleteConfirm: () => set({ isDeleteConfirmOpen: true }),
  closeDeleteConfirm: () => set({ isDeleteConfirmOpen: false }),
}));
