// --- Fix: Define types locally since they are missing from Prisma Client ---
export type CategoryType = "EXPENSE" | "INCOME";

export interface Category {
  id: string;
  name: string;
  type: CategoryType;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
// -------------------------------------------------------------------------

// Types
export interface CategoryWithCounts extends Category {
  expenseCount?: number;
  incomeCount?: number;
}

// Default categories
export const DEFAULT_EXPENSE_CATEGORIES = [
  "Rent",
  "Utilities",
  "Groceries",
  "Food & Dining",
  "Transportation",
  "Gas",
  "Healthcare",
  "Insurance",
  "Entertainment",
  "Shopping",
  "Education",
  "Gym & Fitness",
  "Travel",
  "Subscriptions",
  "Phone",
  "Internet",
  "Clothing",
  "Personal Care",
  "Gifts",
  "Other Expenses",
];

export const DEFAULT_INCOME_CATEGORIES = [
  "Salary",
  "Freelance",
  "Business Income",
  "Investment Returns",
  "Rental Income",
  "Dividends",
  "Interest",
  "Bonus",
  "Gift",
  "Refund",
  "Other Income",
];

/**
 * Helper function to generate category objects from the default lists
 */
const getStaticCategories = (targetType?: CategoryType): Category[] => {
  let categories: Category[] = [];

  // Generate Expense Categories
  if (!targetType || targetType === "EXPENSE") {
    const expenses = DEFAULT_EXPENSE_CATEGORIES.map((name, index) => ({
      id: `expense-${index}`, // Consistent ID based on index
      name,
      type: "EXPENSE" as CategoryType,
      userId: "system",
      createdAt: new Date("2024-01-01"), // Static date
      updatedAt: new Date("2024-01-01"),
    }));
    categories = [...categories, ...expenses];
  }

  // Generate Income Categories
  if (!targetType || targetType === "INCOME") {
    const income = DEFAULT_INCOME_CATEGORIES.map((name, index) => ({
      id: `income-${index}`, // Consistent ID based on index
      name,
      type: "INCOME" as CategoryType,
      userId: "system",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    }));
    categories = [...categories, ...income];
  }

  return categories;
};

// Main Hook - Now returns static data only
export const useCategories = (
  type?: CategoryType,
  includeCounts: boolean = false
) => {
  // We get the data directly from our static generator
  const data = getStaticCategories(type);

  return {
    data,
    isLoading: false, // Data is available instantly
    error: null,
  };
};

// Convenience Hooks
export const useExpenseCategories = () => {
  return useCategories("EXPENSE");
};

export const useIncomeCategories = () => {
  return useCategories("INCOME");
};
