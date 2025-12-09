"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateIncomeSchema } from "@/app/core/schema/income";
import { useIncomes } from "@/app/core/hooks/use-income";
import { useIncomeCategories } from "@/app/core/hooks/use-categories";

import { Input } from "@/app/core/components/ui/input";
import { Button } from "@/app/core/components/ui/button";
import { Textarea } from "@/app/core/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/app/core/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/core/components/ui/select";
import { Label } from "@/app/core/components/ui/label";
import { Pencil, Trash2, Save, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface EditIncomeModalProps {
  income: any;
}

export function EditIncomeModal({ income }: EditIncomeModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { updateIncome, deleteIncome } = useIncomes();

  // New hook returns static data instantly
  const { data: categories } = useIncomeCategories();

  const form = useForm({
    resolver: zodResolver(updateIncomeSchema),
    defaultValues: {
      amount: Number(income.amount),
      source: income.source ?? "",
      note: income.note ?? "",
      // Ensure null becomes "none" for the UI state
      categoryId: income.categoryId ?? "none",
      receivedAt: new Date(income.receivedAt).toISOString().slice(0, 16),
      currency: income.currency ?? "USD",
    },
  });

  // Setup Watcher
  const watchedCategoryId = useWatch({
    control: form.control,
    name: "categoryId",
  });

  // Simple Handler
  const handleCategoryChange = (value: string) => {
    form.setValue("categoryId", value);
  };

  const handleSubmit = async (data: any) => {
    try {
      const payload = {
        ...data,
        amount: Number(data.amount),
        // Handle special "none" value - treat it as null for the backend
        categoryId:
          data.categoryId === "" ||
          data.categoryId === "none" ||
          data.categoryId === "uncategorized"
            ? null
            : data.categoryId,
        source: data.source === "" ? null : data.source,
        note: data.note === "" ? null : data.note,
        receivedAt: new Date(data.receivedAt).toISOString(),
      };

      await updateIncome.mutateAsync({ id: income.id, data: payload });
      setIsOpen(false);
      toast.success("Income updated successfully");
    } catch (error: any) {
      console.error("Update error:", error);
      toast.error(error.message || "Failed to update income");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteIncome.mutateAsync(income.id);
      setIsOpen(false);
      setIsDeleteDialogOpen(false);
      toast.success("Income deleted successfully");
    } catch (error: any) {
      console.error("Delete error:", error);
      toast.error(error.message || "Failed to delete income");
    }
  };

  return (
    <>
      {/* Edit Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon">
            <Pencil className="h-4 w-4" />
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Income</DialogTitle>
          </DialogHeader>

          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            {/* Amount */}
            <div className="space-y-1">
              <Label htmlFor="amount">Amount *</Label>
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

            {/* Source */}
            <div className="space-y-1">
              <Label htmlFor="source">Source</Label>
              <Input
                id="source"
                type="text"
                placeholder="Salary, business, etc."
                {...form.register("source")}
              />
            </div>

            {/* Note */}
            <div className="space-y-1">
              <Label htmlFor="note">Note</Label>
              <Textarea
                id="note"
                rows={3}
                placeholder="Optional note about this income"
                {...form.register("note")}
              />
            </div>

            {/* Category */}
            <div className="space-y-1">
              <Label htmlFor="categoryId">Category</Label>

              <Select
                value={watchedCategoryId || "none"}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No category</SelectItem>
                  <SelectItem value="uncategorized">
                    -- Uncategorized --
                  </SelectItem>

                  {categories?.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date */}
            <div className="space-y-1">
              <Label htmlFor="receivedAt">Received At *</Label>
              <Input
                id="receivedAt"
                type="datetime-local"
                {...form.register("receivedAt")}
              />
            </div>

            <DialogFooter className="flex justify-between items-center pt-4">
              <div>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => setIsDeleteDialogOpen(true)}
                  disabled={deleteIncome.isPending}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  {deleteIncome.isPending ? "Deleting..." : "Delete"}
                </Button>
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={updateIncome.isPending}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {updateIncome.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Delete Income
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-red-50 rounded-full">
                <Trash2 className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  Are you sure you want to delete this income?
                </p>
                <div className="mt-2 space-y-1 text-sm text-gray-600">
                  <p>
                    <span className="font-medium">Amount:</span> $
                    {income.amount.toFixed(2)}
                  </p>
                  {income.source && (
                    <p>
                      <span className="font-medium">Source:</span>{" "}
                      {income.source}
                    </p>
                  )}
                  <p>
                    <span className="font-medium">Date:</span>{" "}
                    {new Date(income.receivedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-500">
              This action cannot be undone. All data associated with this income
              will be permanently removed.
            </p>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteIncome.isPending}
              className="w-full sm:w-auto flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              {deleteIncome.isPending ? "Deleting..." : "Delete Income"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
