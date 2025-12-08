"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { expenseSchema, ExpenseFormType } from "@/app/core/schema/expense";
import { useExpenses } from "@/app/core/hooks/use-expenses";
import {
  useExpenseCategories,
  useCreateDefaultCategories,
  DEFAULT_EXPENSE_CATEGORIES,
} from "@/app/core/hooks/use-categories";
import { useEditExpenseStore } from "../../store/use-edit-expense-store";

import { Input } from "@/app/core/components/ui/input";
import { Button } from "@/app/core/components/ui/button";
import { Textarea } from "@/app/core/components/ui/textarea";
import { Label } from "@/app/core/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/app/core/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/core/components/ui/select";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function EditExpenseModal() {
  // 1. Store & Hooks
  const {
    isOpen,
    onClose,
    selectedExpense,
    isDeleteConfirmOpen,
    openDeleteConfirm,
    closeDeleteConfirm,
  } = useEditExpenseStore();

  const { updateExpense, deleteExpense, isUpdating, isDeleting } =
    useExpenses();
  const { data: categories, isLoading: isLoadingCategories } =
    useExpenseCategories();
  const createDefaults = useCreateDefaultCategories();

  // 2. Form Setup
  const form = useForm<ExpenseFormType>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      amount: 0,
      currency: "USD",
      note: "",
      categoryId: "none",
      occurredAt: new Date().toISOString().slice(0, 16),
    },
  });

  // 3. Watchers (Fixes React Compiler Errors)
  const watchedCategoryId = useWatch({
    control: form.control,
    name: "categoryId",
  });

  const watchedCurrency = useWatch({
    control: form.control,
    name: "currency",
  });

  // 4. Sync Form with Store Data
  useEffect(() => {
    if (selectedExpense) {
      form.reset({
        amount: selectedExpense.amount,
        currency: selectedExpense.currency || "USD",
        note: selectedExpense.note || "",
        categoryId: selectedExpense.categoryId ?? "none",
        occurredAt: new Date(selectedExpense.occurredAt)
          .toISOString()
          .slice(0, 16),
      });
    }
  }, [selectedExpense, form]);

  // 5. Intelligent Category Selection Handler
  const handleCategoryChange = async (value: string) => {
    if (value === "none" || value === "uncategorized") {
      form.setValue("categoryId", value);
      return;
    }

    if (categories && categories.length > 0) {
      form.setValue("categoryId", value);
      return;
    }

    // Handle "Virtual" category selection (auto-create defaults)
    try {
      const toastId = toast.loading(`Initializing ${value} category...`);
      const newCategories: any[] = await createDefaults.mutateAsync("EXPENSE");
      const matchingCategory = newCategories?.find((cat) => cat.name === value);

      if (matchingCategory) {
        form.setValue("categoryId", matchingCategory.id);
        toast.success("Categories created and selected!", { id: toastId });
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
    if (!selectedExpense) return;

    const normalizedCategoryId =
      data.categoryId === "none" || data.categoryId === "uncategorized"
        ? null
        : data.categoryId;

    try {
      await updateExpense({
        id: selectedExpense.id,
        data: {
          ...data,
          categoryId: normalizedCategoryId,
        } as any,
      });

      toast.success("Expense updated!");
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update expense");
    }
  };

  const handleDelete = async () => {
    if (!selectedExpense) return;
    try {
      await deleteExpense(selectedExpense.id);
      onClose();
      toast.success("Expense deleted!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete expense");
    }
  };

  if (!isOpen) return null;

  const isCategoryListEmpty = !isLoadingCategories && categories?.length === 0;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Expense</DialogTitle>
          </DialogHeader>

          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
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
                  {...form.register("amount", { valueAsNumber: true })}
                />
              </div>
              {form.formState.errors.amount && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.amount.message}
                </p>
              )}
            </div>

            {/* Category Section */}
            <div className="space-y-2">
              <Label htmlFor="categoryId">Category</Label>
              {isLoadingCategories ? (
                <div className="flex items-center space-x-2 p-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">
                    Loading...
                  </span>
                </div>
              ) : (
                <Select
                  value={watchedCategoryId || "none"}
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
            </div>

            {/* Currency */}
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select
                onValueChange={(value) => form.setValue("currency", value)}
                value={watchedCurrency} // <--- UPDATED HERE
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

            {/* Date & Time */}
            <div className="space-y-2">
              <Label htmlFor="occurredAt">Date & Time</Label>
              <Input
                id="occurredAt"
                type="datetime-local"
                {...form.register("occurredAt")}
              />
              {form.formState.errors.occurredAt && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.occurredAt.message}
                </p>
              )}
            </div>

            {/* Note */}
            <div className="space-y-2">
              <Label htmlFor="note">Note (Optional)</Label>
              <Textarea
                id="note"
                rows={3}
                placeholder="Add a note..."
                {...form.register("note")}
              />
            </div>

            {/* Footer */}
            <DialogFooter className="flex justify-between pt-4 gap-2">
              <Button
                type="button"
                variant="destructive"
                onClick={openDeleteConfirm}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  Save Changes
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteConfirmOpen}
        onOpenChange={(open) => !open && closeDeleteConfirm()}
      >
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Expense</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-700">
              Are you sure you want to delete this expense of{" "}
              <span className="font-semibold">
                ${selectedExpense?.amount.toFixed(2)}
              </span>
              ?
            </p>
            <p className="text-sm text-gray-500 mt-2">
              This action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={closeDeleteConfirm}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Expense"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
