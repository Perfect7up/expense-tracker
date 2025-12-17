import { create } from 'zustand';

interface EditIncomeState {
  isOpen: boolean;
  income: any | null;
  onOpen: (income?: any) => void;
  onClose: () => void;
}

export const useEditIncomeStore = create<EditIncomeState>((set) => ({
  isOpen: false,
  income: null,
  onOpen: (income = null) => set({ isOpen: true, income }),
  onClose: () => set({ isOpen: false, income: null }),
}));