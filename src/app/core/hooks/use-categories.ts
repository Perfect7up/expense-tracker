export type CategoryType = "EXPENSE" | "INCOME" | "INVESTMENT" | "SUBSCRIPTION";

export interface Category {
  id: string;
  name: string;
  type: CategoryType;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export const DEFAULT_EXPENSE_CATEGORIES = [
  "Rent", "Utilities", "Groceries", "Food & Dining", "Transportation",
  "Gas", "Healthcare", "Insurance", "Entertainment", "Shopping",
  "Education", "Gym & Fitness", "Travel", "Subscriptions", "Phone",
  "Internet", "Clothing", "Personal Care", "Gifts", "Other Expenses",
];

export const DEFAULT_INCOME_CATEGORIES = [
  "Salary", "Freelance", "Business Income", "Investment Returns",
  "Rental Income", "Dividends", "Interest", "Bonus", "Gift",
  "Refund", "Other Income",
];

export const DEFAULT_INVESTMENT_CATEGORIES = [
  "Stocks", "Crypto", "Real Estate", "Gold & Metals", "Mutual Funds",
  "ETFs", "Bonds", "Startup Equity", "Forex", "Collectibles", "Other Assets"
];

// 2. Add Default Subscription Categories
export const DEFAULT_SUBSCRIPTION_CATEGORIES = [
  "Streaming Services",
  "Music Streaming",
  "Cloud Storage",
  "Software/SaaS",
  "Gym/Fitness",
  "News/Media",
  "Learning/Education",
  "Productivity Tools",
  "Food/Meal Kits",
  "Gaming",
  "Dating Apps",
  "Membership Clubs",
  "Beauty/Personal Care",
  "Health/Wellness",
  "Financial Services",
  "E-commerce",
  "Telecom/Mobile",
  "Internet",
  "Utilities",
  "Insurance",
  "Other"
];

/**
 * Helper function to generate category objects
 */
const getStaticCategories = (targetType?: CategoryType): Category[] => {
  let categories: Category[] = [];

  // Generate Expense Categories
  if (!targetType || targetType === "EXPENSE") {
    categories.push(...DEFAULT_EXPENSE_CATEGORIES.map((name, index) => ({
      id: `expense-${index}`,
      name,
      type: "EXPENSE" as CategoryType,
      userId: "system",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    })));
  }

  // Generate Income Categories
  if (!targetType || targetType === "INCOME") {
    categories.push(...DEFAULT_INCOME_CATEGORIES.map((name, index) => ({
      id: `income-${index}`,
      name,
      type: "INCOME" as CategoryType,
      userId: "system",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    })));
  }

  // Generate Investment Categories
  if (!targetType || targetType === "INVESTMENT") {
    categories.push(...DEFAULT_INVESTMENT_CATEGORIES.map((name, index) => ({
      id: `investment-${index}`,
      name,
      type: "INVESTMENT" as CategoryType,
      userId: "system",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    })));
  }

  // 3. Generate Subscription Categories
  if (!targetType || targetType === "SUBSCRIPTION") {
    categories.push(...DEFAULT_SUBSCRIPTION_CATEGORIES.map((name, index) => ({
      id: `subscription-${index}`,
      name,
      type: "SUBSCRIPTION" as CategoryType,
      userId: "system",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    })));
  }

  return categories;
};

export const useCategories = (
  type?: CategoryType,
  includeCounts: boolean = false
) => {
  const data = getStaticCategories(type);
  return {
    data,
    isLoading: false,
    error: null,
  };
};

// Convenience Hooks
export const useExpenseCategories = () => useCategories("EXPENSE");
export const useIncomeCategories = () => useCategories("INCOME");
export const useInvestmentCategories = () => useCategories("INVESTMENT");
// 4. Export new hook
export const useSubscriptionCategories = () => useCategories("SUBSCRIPTION");