"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { expenseSchema, ExpenseFormType } from "@/app/core/schema/expense";
import { useExpenses } from "@/app/core/hooks/use-expenses";
import { useExpenseCategories } from "@/app/core/hooks/use-categories";
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
  DialogDescription,
} from "@/app/core/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/core/components/ui/select";
import {
  Trash2,
  Loader2,
  DollarSign,
  Tag,
  Calendar,
  FileText,
  Globe,
  Edit3,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
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

  // New hook returns static data instantly
  const { data: categories } = useExpenseCategories();

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

  // 3. Watchers
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

  // 5. Simple Handler
  const handleCategoryChange = (value: string) => {
    form.setValue("categoryId", value);
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

      toast.success("Expense updated successfully!");
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
      toast.success("Expense deleted successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete expense");
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Edit Expense Modal */}
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-lg p-0 border-0 overflow-hidden bg-transparent">
          <div className="relative bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/50">
            {/* linear header */}
            <div className="relative bg-linear-to-r from-blue-500 to-cyan-500 p-6">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 blur-2xl" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12 blur-2xl" />

              <DialogHeader className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                    <Edit3 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <DialogTitle className="text-2xl font-bold text-white">
                      Edit Expense
                    </DialogTitle>
                    <DialogDescription className="text-blue-100/80">
                      Update your spending details
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>
            </div>

            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="p-6 space-y-6"
            >
              {/* Amount */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-blue-600" />
                  </div>
                  <Label
                    htmlFor="amount"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Amount *
                  </Label>
                </div>
                <div className="relative group">
                  <div className="absolute inset-0 bg-linear-to-r from-blue-500/10 to-cyan-500/10 rounded-xl blur group-hover:blur-sm transition-all duration-300" />
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400">
                      $
                    </span>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      min="0.01"
                      className="pl-10 h-14 text-lg font-semibold rounded-xl border-slate-200/50 bg-white/50 backdrop-blur-sm focus:border-blue-300 focus:ring-2 focus:ring-blue-500/20"
                      {...form.register("amount", { valueAsNumber: true })}
                    />
                  </div>
                </div>
                {form.formState.errors.amount && (
                  <p className="text-red-500 text-sm px-1">
                    {form.formState.errors.amount.message}
                  </p>
                )}
              </div>

              {/* Category & Currency Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Category */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-linear-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                      <Tag className="w-4 h-4 text-purple-600" />
                    </div>
                    <Label className="text-sm font-semibold text-slate-700">
                      Category
                    </Label>
                  </div>

                  <Select
                    value={watchedCategoryId || "none"}
                    onValueChange={handleCategoryChange}
                  >
                    <SelectTrigger className="h-14 rounded-xl border-slate-200/50 bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-purple-500/20">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-200/50 bg-white/90 backdrop-blur-md shadow-2xl h-60">
                      <SelectItem
                        value="none"
                        className="rounded-lg hover:bg-slate-100/50"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center">
                            <Tag className="w-3 h-3 text-slate-500" />
                          </div>
                          No category
                        </div>
                      </SelectItem>

                      {categories?.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id}
                          className="rounded-lg hover:bg-slate-100/50"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-md bg-blue-100 flex items-center justify-center">
                              <Tag className="w-3 h-3 text-blue-500" />
                            </div>
                            {category.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Currency */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-linear-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                      <Globe className="w-4 h-4 text-green-600" />
                    </div>
                    <Label className="text-sm font-semibold text-slate-700">
                      Currency
                    </Label>
                  </div>
                  <Select
                    onValueChange={(value) => form.setValue("currency", value)}
                    value={watchedCurrency}
                  >
                    <SelectTrigger className="h-14 rounded-xl border-slate-200/50 bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-green-500/20">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-200/50 bg-white/90 backdrop-blur-md shadow-2xl">
                      <SelectItem
                        value="USD"
                        className="rounded-lg hover:bg-slate-100/50"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">$</span>
                          USD (United States Dollar)
                        </div>
                      </SelectItem>
                      <SelectItem
                        value="EUR"
                        className="rounded-lg hover:bg-slate-100/50"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">€</span>
                          EUR (Euro)
                        </div>
                      </SelectItem>
                      <SelectItem
                        value="GBP"
                        className="rounded-lg hover:bg-slate-100/50"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">£</span>
                          GBP (British Pound)
                        </div>
                      </SelectItem>
                      <SelectItem
                        value="CAD"
                        className="rounded-lg hover:bg-slate-100/50"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">$</span>
                          CAD (Canadian Dollar)
                        </div>
                      </SelectItem>
                      <SelectItem
                        value="AUD"
                        className="rounded-lg hover:bg-slate-100/50"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">$</span>
                          AUD (Australian Dollar)
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Date & Time */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-linear-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-amber-600" />
                  </div>
                  <Label
                    htmlFor="occurredAt"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Date & Time *
                  </Label>
                </div>
                <Input
                  id="occurredAt"
                  type="datetime-local"
                  className="h-14 rounded-xl border-slate-200/50 bg-white/50 backdrop-blur-sm text-lg focus:border-amber-300 focus:ring-2 focus:ring-amber-500/20"
                  {...form.register("occurredAt")}
                />
                {form.formState.errors.occurredAt && (
                  <p className="text-red-500 text-sm px-1">
                    {form.formState.errors.occurredAt.message}
                  </p>
                )}
              </div>

              {/* Note */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-linear-to-br from-slate-100 to-gray-100 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-slate-600" />
                  </div>
                  <Label
                    htmlFor="note"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Note (Optional)
                  </Label>
                </div>
                <Textarea
                  id="note"
                  rows={3}
                  placeholder="Update your note about this expense..."
                  className="rounded-xl border-slate-200/50 bg-white/50 backdrop-blur-sm focus:border-slate-300 focus:ring-2 focus:ring-slate-500/20 resize-none"
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
                  className="rounded-xl h-12 px-4 bg-linear-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-lg shadow-red-500/20 hover:shadow-xl hover:shadow-red-500/30 transition-all duration-300"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Expense
                </Button>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="rounded-xl h-12 px-6 border-slate-300/50 hover:bg-slate-100/50"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isUpdating}
                    className="rounded-xl h-12 px-6 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 group"
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        Save Changes
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </div>
              </DialogFooter>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={isDeleteConfirmOpen}
        onOpenChange={(open) => !open && closeDeleteConfirm()}
      >
        <DialogContent className="sm:max-w-[400px] p-0 border-0 overflow-hidden bg-transparent">
          <div className="relative bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/50">
            {/* Red linear header */}
            <div className="relative bg-linear-to-r from-red-500 to-pink-500 p-6">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 blur-2xl" />

              <DialogHeader className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                    <AlertTriangle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <DialogTitle className="text-2xl font-bold text-white">
                      Delete Expense
                    </DialogTitle>
                    <DialogDescription className="text-red-100/80">
                      This action cannot be undone
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-linear-to-r from-red-50/50 to-pink-50/50 border border-red-100/30">
                <div className="w-12 h-12 rounded-lg bg-linear-to-br from-red-100 to-pink-100 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-gray-700 font-medium">
                    Are you sure you want to delete this expense?
                  </p>
                  <p className="text-2xl font-bold text-red-600 mt-1">
                    ${selectedExpense?.amount.toFixed(2)}
                  </p>
                  {selectedExpense?.note && (
                    <p className="text-sm text-gray-500 mt-1 italic">
                      &ldquo;{selectedExpense.note}&rdquo;
                    </p>
                  )}
                </div>
              </div>

              <p className="text-sm text-gray-500 px-2">
                This expense will be permanently removed from your records and
                cannot be recovered.
              </p>

              <DialogFooter className="flex gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeDeleteConfirm}
                  className="rounded-xl h-12 px-6 border-slate-300/50 hover:bg-slate-100/50 flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="rounded-xl h-12 px-6 bg-linear-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-lg shadow-red-500/20 hover:shadow-xl hover:shadow-red-500/30 transition-all duration-300 flex-1"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Expense
                    </>
                  )}
                </Button>
              </DialogFooter>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
