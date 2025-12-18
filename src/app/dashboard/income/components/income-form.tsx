"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { incomeSchema, IncomeFormType } from "@/app/dashboard/income/schema/income";
import { useIncomes } from "@/app/dashboard/income/hooks/use-income";
import { useIncomeCategories } from "@/app/core/hooks/use-categories";

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
  Briefcase,
  CreditCard,
} from "lucide-react";
import { toast } from "sonner";
import { CURRENCY_OPTIONS, handleFormError } from "@/app/core/utils/form-utils";

interface IncomeFormProps {
  children?: React.ReactNode;
  onSuccess?: () => void;
}

export function IncomeForm({ children, onSuccess }: IncomeFormProps) {
  const { createIncome, isCreating } = useIncomes();
  const { data: categories = [] } = useIncomeCategories();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(incomeSchema),
    defaultValues: {
      amount: 0,
      currency: "USD",
      source: "",
      note: "",
      categoryId: "",
      receivedAt: new Date().toISOString().slice(0, 16),
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

  const onSubmit = async (data: IncomeFormType) => {
    try {
      const payload = {
        // data.amount is already a number here due to z.coerce in schema
        amount: data.amount,
        currency: data.currency || "USD",
        receivedAt: new Date(data.receivedAt).toISOString(),
        source: data.source?.trim() || undefined,
        note: data.note?.trim() || undefined,
        categoryId:
          data.categoryId === "none" || data.categoryId === "uncategorized"
            ? undefined
            : data.categoryId,
      };

      await createIncome(payload);

      form.reset({
        amount: 0,
        currency: "USD",
        source: "",
        note: "",
        categoryId: "",
        receivedAt: new Date().toISOString().slice(0, 16),
      });

      setIsOpen(false);
      toast.success("Income added successfully!");

      if (onSuccess) onSuccess();
    } catch (error: any) {
      if (typeof handleFormError === "function") {
        handleFormError(error, "Failed to add income");
      } else {
        console.error("Failed to create income:", error);
        toast.error(error.message || "Failed to add income");
      }
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
            Add Income
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      )}

      <FormModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Add New Income"
        subtitle="Track your earnings instantly"
        icon={<CreditCard className="w-6 h-6 text-white" />}
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

          <FormInput
            label="Source"
            name="source"
            icon={<Briefcase className="w-4 h-4 text-blue-600" />}
            iconBg="bg-linear-to-br from-blue-100 to-cyan-100"
            placeholder="e.g., Salary, Freelance"
            register={form.register}
            error={form.formState.errors.source?.message}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormSelect
              label="Category"
              icon={<Tag className="w-4 h-4 text-purple-600" />}
              iconBg="bg-linear-to-br from-purple-100 to-pink-100"
              value={watchedCategoryId}
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
            label="Received At"
            name="receivedAt"
            icon={<Calendar className="w-4 h-4 text-amber-600" />}
            iconBg="bg-linear-to-br from-amber-100 to-orange-100"
            type="datetime-local"
            required
            register={form.register}
            error={form.formState.errors.receivedAt?.message}
          />

          <FormInput
            label="Note"
            name="note"
            icon={<FileText className="w-4 h-4 text-slate-600" />}
            iconBg="bg-linear-to-br from-slate-100 to-gray-100"
            type="textarea"
            placeholder="Optional note about this income"
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
                  Adding Income...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5 mr-3" />
                  Add Income
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
