"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { expenseSchema, ExpenseFormType } from "@/app/core/schema/expense";
import { useExpenses } from "@/app/core/hooks/use-expenses";
import {
  useExpenseCategories,
  useCreateDefaultCategories,
  DEFAULT_EXPENSE_CATEGORIES,
} from "@/app/core/hooks/use-categories";

import { Input } from "@/app/core/components/ui/input";
import { Button } from "@/app/core/components/ui/button";
import { Textarea } from "@/app/core/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/core/components/ui/select";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";

// 1. Define the props interface
interface ExpenseFormProps {
  children?: React.ReactNode;
}

// 2. Accept children in the component function
export function ExpenseForm({ children }: ExpenseFormProps) {
  const { createExpense, isCreating } = useExpenses();
  const { data: categories, isLoading: isLoadingCategories } =
    useExpenseCategories();
  const createDefaults = useCreateDefaultCategories();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<ExpenseFormType>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      amount: 0,
      currency: "USD",
      note: "",
      categoryId: "",
      occurredAt: new Date().toISOString().slice(0, 16),
    },
  });

  const watchedCategoryId = useWatch({
    control: form.control,
    name: "categoryId",
  });

  const watchedCurrency = useWatch({
    control: form.control,
    name: "currency",
  });

  const handleCategoryChange = async (value: string) => {
    if (value === "none" || value === "uncategorized") {
      form.setValue("categoryId", value);
      return;
    }

    if (categories && categories.length > 0) {
      form.setValue("categoryId", value);
      return;
    }

    try {
      const toastId = toast.loading(`Initializing ${value} category...`);
      const newCategories: any[] = await createDefaults.mutateAsync("EXPENSE");
      const matchingCategory = newCategories?.find((cat) => cat.name === value);

      if (matchingCategory) {
        form.setValue("categoryId", matchingCategory.id);
        toast.success("Categories initialized and selected!", { id: toastId });
      } else {
        form.setValue("categoryId", "none");
        toast.dismiss(toastId);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to initialize categories");
    }
  };

  const onSubmit = async (data: ExpenseFormType) => {
    try {
      const payload = {
        amount: Number(data.amount),
        currency: data.currency || "USD",
        occurredAt: new Date(data.occurredAt).toISOString(),
        note: data.note?.trim() || undefined,
        categoryId: data.categoryId?.trim() || undefined,
      };

      await createExpense(payload);

      form.reset({
        amount: 0,
        currency: "USD",
        note: "",
        categoryId: "",
        occurredAt: new Date().toISOString().slice(0, 16),
      });

      setIsOpen(false);
      toast.success("Expense added successfully!");
    } catch (error: any) {
      console.error("Failed to create expense:", error);
      toast.error(error.message || "Failed to add expense");
    }
  };

  const isCategoryListEmpty = !isLoadingCategories && categories?.length === 0;

  return (
    <>
      {/* 3. Render children as the trigger if they exist, otherwise show default button */}
      {children ? (
        <span
          onClick={() => setIsOpen(true)}
          className="cursor-pointer inline-block"
        >
          {children}
        </span>
      ) : (
        <div className="flex justify-end">
          <Button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Expense
          </Button>
        </div>
      )}

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-4 relative max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-lg"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-4">Add New Expense</h2>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Amount */}
              <div>
                <label
                  htmlFor="amount"
                  className="block mb-1 text-sm font-medium"
                >
                  Amount *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    className="pl-8"
                    {...form.register("amount", {
                      valueAsNumber: true,
                      required: "Amount is required",
                      min: { value: 0.01, message: "Amount must be positive" },
                    })}
                  />
                </div>
                {form.formState.errors.amount && (
                  <p className="text-red-500 text-sm">
                    {form.formState.errors.amount.message}
                  </p>
                )}
              </div>

              {/* Category */}
              <div>
                <label
                  htmlFor="categoryId"
                  className="block mb-1 text-sm font-medium"
                >
                  Category
                </label>

                {isLoadingCategories ? (
                  <div className="flex items-center space-x-2 p-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">
                      Loading categories...
                    </span>
                  </div>
                ) : (
                  <Select
                    value={watchedCategoryId ?? undefined}
                    onValueChange={handleCategoryChange}
                    disabled={createDefaults.isPending}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No category</SelectItem>
                      <SelectItem value="uncategorized">
                        -- Uncategorized --
                      </SelectItem>
                      {!isCategoryListEmpty
                        ? categories!.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))
                        : DEFAULT_EXPENSE_CATEGORIES.map((name) => (
                            <SelectItem key={name} value={name}>
                              {name}
                            </SelectItem>
                          ))}
                    </SelectContent>
                  </Select>
                )}

                {isCategoryListEmpty && (
                  <p className="text-[10px] text-muted-foreground pt-1">
                    * Selecting a category will automatically add it to your
                    settings.
                  </p>
                )}

                {form.formState.errors.categoryId && (
                  <p className="text-red-500 text-sm">
                    {form.formState.errors.categoryId.message}
                  </p>
                )}
              </div>

              {/* Date */}
              <div>
                <label
                  htmlFor="occurredAt"
                  className="block mb-1 text-sm font-medium"
                >
                  Date & Time *
                </label>
                <Input
                  id="occurredAt"
                  type="datetime-local"
                  {...form.register("occurredAt", {
                    required: "Date is required",
                  })}
                />
                {form.formState.errors.occurredAt && (
                  <p className="text-red-500 text-sm">
                    {form.formState.errors.occurredAt.message}
                  </p>
                )}
              </div>

              {/* Currency */}
              <div>
                <label
                  htmlFor="currency"
                  className="block mb-1 text-sm font-medium"
                >
                  Currency
                </label>
                <Select
                  onValueChange={(value) => form.setValue("currency", value)}
                  value={watchedCurrency}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                    <SelectItem value="CAD">CAD ($)</SelectItem>
                    <SelectItem value="AUD">AUD ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Note */}
              <div>
                <label
                  htmlFor="note"
                  className="block mb-1 text-sm font-medium"
                >
                  Note
                </label>
                <Textarea
                  id="note"
                  rows={3}
                  placeholder="Optional note about this expense"
                  {...form.register("note")}
                />
              </div>

              <Button
                type="submit"
                disabled={isCreating || isLoadingCategories}
                className="w-full mt-4"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Expense"
                )}
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
