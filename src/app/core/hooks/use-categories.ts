import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

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

export interface CreateCategoryData {
  name: string;
  type: CategoryType;
}

export interface UpdateCategoryData {
  name?: string;
  type?: CategoryType;
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

// Fetch categories
const fetchCategories = async (
  type?: CategoryType,
  includeCounts: boolean = false
): Promise<CategoryWithCounts[]> => {
  const params = new URLSearchParams();
  if (type) params.append("type", type);
  if (includeCounts) params.append("includeCounts", "true");

  const { data } = await axios.get(`/api/categories?${params.toString()}`);
  return data;
};

// Create category
const createCategory = async (
  categoryData: CreateCategoryData
): Promise<Category> => {
  const { data } = await axios.post("/api/categories", categoryData);
  return data;
};

// Create multiple categories
const createMultipleCategories = async (
  categories: CreateCategoryData[]
): Promise<Category[]> => {
  const promises = categories.map((category) =>
    axios.post("/api/categories", category)
  );
  const results = await Promise.allSettled(promises);

  return results
    .filter(
      (result): result is PromiseFulfilledResult<any> =>
        result.status === "fulfilled"
    )
    .map((result) => result.value.data);
};

// Update category
const updateCategory = async ({
  id,
  ...updateData
}: { id: string } & UpdateCategoryData): Promise<Category> => {
  const { data } = await axios.put(`/api/categories?id=${id}`, updateData);
  return data;
};

// Delete category
const deleteCategory = async (
  id: string
): Promise<{ success: boolean; message: string }> => {
  const { data } = await axios.delete(`/api/categories?id=${id}`);
  return data;
};

// React Query hooks
export const useCategories = (
  type?: CategoryType,
  includeCounts: boolean = false
) => {
  return useQuery({
    queryKey: ["categories", type, includeCounts],
    queryFn: () => fetchCategories(type, includeCounts),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useExpenseCategories = () => {
  return useCategories("EXPENSE");
};

export const useIncomeCategories = () => {
  return useCategories("INCOME");
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

export const useCreateDefaultCategories = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (type: CategoryType) => {
      const categories =
        type === "EXPENSE"
          ? DEFAULT_EXPENSE_CATEGORIES
          : DEFAULT_INCOME_CATEGORIES;

      const categoryData = categories.map((name) => ({ name, type }));
      return createMultipleCategories(categoryData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCategory,
    onSuccess: (updatedCategory) => {
      queryClient.setQueryData(
        ["categories"],
        (old: CategoryWithCounts[] | undefined) => {
          if (!old) return [updatedCategory];
          return old.map((cat) =>
            cat.id === updatedCategory.id ? updatedCategory : cat
          );
        }
      );
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData(
        ["categories"],
        (old: CategoryWithCounts[] | undefined) => {
          if (!old) return [];
          return old.filter((cat) => cat.id !== deletedId);
        }
      );
    },
  });
};
