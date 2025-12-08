export interface Expense {
  id: string;
  amount: number;
  note?: string | null;
  occurredAt: string | Date;
  currency: string;
  categoryId?: string | null;
  userId: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  categoryName?: string | null;
}

export interface CreateExpenseInput {
  amount: number;
  note?: string;
  occurredAt: string;
  currency?: string;
  categoryId?: string;
}

export interface UpdateExpenseInput {
  amount?: number;
  note?: string | null;
  occurredAt?: string;
  currency?: string;
  categoryId?: string | null; // ⭐ fixed
}

export interface ExpenseFilters {
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  categoryId?: string;
  search?: string;
}

export interface ExpenseStats {
  total: number;
  count: number;
  average: number;
  thisMonth: number;
  lastMonth: number;
  byCategory: Array<{
    categoryId: string | null;
    amount: number;
    count: number;
  }>;
}
