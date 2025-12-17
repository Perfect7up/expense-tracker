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
  subscriptionId?: string | null;
  subscription?: {
    id: string;
    name: string;
    amount: number | null;
    currency: string;
    cycle: string; // "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY"
    nextBilling: string | Date;
    isActive: boolean;
    startDate: string | Date;
    endDate?: string | Date | null;
    note?: string | null;
    autoExpense: boolean;
  } | null;
  categoryName?: string | null;
  subscriptionName?: string | null;
}

// Your subscription type from the hook might need updating:
export interface Subscription {
  id: string;
  name: string;
  amount: number;
  currency: string;
  cycle: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY"; // Make sure this matches your Prisma enum
  nextBilling: string | Date;
  isActive: boolean;
  startDate: string | Date;
  endDate?: string | Date | null;
  note?: string | null;
  autoExpense: boolean;
  category?: string; // Note: This is string in your hook, but should be categoryId in DB
  // Add missing fields from your hook
  categoryId?: string | null;
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
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
