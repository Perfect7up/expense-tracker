"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { expenseSchema, ExpenseFormType } from "@/app/dashboard/expenses/schema/expense";
import { useExpenses } from "../hooks/use-expenses";
import { useExpenseCategories } from "@/app/core/hooks/use-categories";

import { Button } from "@/app/core/components/ui/button";
import { FormModal } from "@/app/core/components/shared/form-modal";
import { FormInput } from "@/app/core/components/shared/form-input";
import { FormSelect } from "@/app/core/components/shared/form-select";
import {
  Loader2,
  Plus,
  DollarSign,
  Calendar,
  Tag,
  FileText,
  Globe,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { CURRENCY_OPTIONS, handleFormError } from "@/app/core/utils/form-utils";

interface ExpenseFormProps {
  children?: React.ReactNode;
  onSuccess?: () => void;
}

export function ExpenseForm({ children, onSuccess }: ExpenseFormProps) {
  const { createExpense, isCreating } = useExpenses();
  const { data: categories = [] } = useExpenseCategories();
  const [isOpen, setIsOpen] = useState(false);

  // REMOVE the explicit generic <ExpenseFormType> here.
  // Let zodResolver infer the correct Input/Output types to fix the TS errors.
  const form = useForm({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      amount: 0, // Initial value as number is fine, user input becomes string
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

  const handleCategoryChange = (value: string) => {
    form.setValue("categoryId", value);
  };

  const onSubmit = async (data: ExpenseFormType) => {
    try {
      // data.amount is ALREADY a number here due to z.coerce in the schema

      const payload = {
        amount: data.amount,
        currency: data.currency || "USD",
        occurredAt: new Date(data.occurredAt).toISOString(),
        note: data.note?.trim() || undefined,
        categoryId:
          !data.categoryId ||
          data.categoryId === "none" ||
          data.categoryId === "uncategorized"
            ? undefined
            : data.categoryId,
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

      if (onSuccess) onSuccess();
    } catch (error: any) {
      handleFormError(error, "Failed to add expense");
    }
  };

  const categoryOptions = categories.map((cat) => ({
    value: cat.id,
    label: cat.name,
  }));

  const currencyOptions = CURRENCY_OPTIONS.map((curr) => ({
    value: curr.value,
    label: curr.label,
  }));

  return (
    <>
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
            className="flex items-center gap-2 rounded-full bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 h-12 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 group"
          >
            <Plus className="w-4 h-4" />
            Add Expense
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      )}

      <FormModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Add New Expense"
        subtitle="Track your spending instantly"
        icon={<Plus className="w-6 h-6 text-white" />}
        gradient="bg-linear-to-r from-blue-500 to-cyan-500"
      >
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormInput
            label="Amount"
            name="amount"
            icon={<DollarSign className="w-4 h-4 text-blue-600" />}
            iconBg="bg-linear-to-br from-blue-100 to-cyan-100"
            type="number"
            step="0.01"
            min="0.01"
            prefix="$"
            required
            register={form.register}
            error={form.formState.errors.amount?.message}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormSelect
              label="Category"
              icon={<Tag className="w-4 h-4 text-purple-600" />}
              iconBg="bg-linear-to-br from-purple-100 to-pink-100"
              value={watchedCategoryId || ""}
              onValueChange={handleCategoryChange}
              options={categoryOptions}
              type="category"
            />

            <FormSelect
              label="Currency"
              icon={<Globe className="w-4 h-4 text-green-600" />}
              iconBg="bg-linear-to-br from-green-100 to-emerald-100"
              value={watchedCurrency}
              onValueChange={(value) => form.setValue("currency", value)}
              options={currencyOptions}
              type="currency"
              showNoCategory={false}
            />
          </div>

          <FormInput
            label="Date & Time"
            name="occurredAt"
            icon={<Calendar className="w-4 h-4 text-amber-600" />}
            iconBg="bg-linear-to-br from-amber-100 to-orange-100"
            type="datetime-local"
            required
            register={form.register}
            error={form.formState.errors.occurredAt?.message}
          />

          <FormInput
            label="Note"
            name="note"
            icon={<FileText className="w-4 h-4 text-slate-600" />}
            iconBg="bg-linear-to-br from-slate-100 to-gray-100"
            type="textarea"
            placeholder="Optional note about this expense (e.g., 'Dinner with friends', 'Office supplies')"
            register={form.register}
          />

          <div className="pt-4">
            <Button
              type="submit"
              disabled={isCreating}
              className="w-full h-14 rounded-xl bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white text-lg font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 group"
            >
              {isCreating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                  Adding Expense...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5 mr-3" />
                  Add Expense
                  <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </div>
        </form>
      </FormModal>
    </>
  );
}
