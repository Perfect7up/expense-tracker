"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { formatISO } from "date-fns";
import {
  Loader2,
  CreditCard,
  Calendar,
  RotateCw,
  FileText,
  Wallet,
  Tag as TagIcon,
  Globe,
  Plus,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

import { Button } from "@/app/core/components/ui/button";
import { Checkbox } from "@/app/core/components/ui/checkbox";
import { Label } from "@/app/core/components/ui/label";
import { FormModal } from "@/app/core/components/shared/form-modal";
import { FormInput } from "@/app/core/components/shared/form-input";
import { FormSelect } from "@/app/core/components/shared/form-select";
import { handleFormError } from "@/app/core/utils/form-utils";

import {
  subscriptionSchema,
  SUBSCRIPTION_CATEGORIES,
  CYCLE_OPTIONS,
  CURRENCY_OPTIONS,
} from "@/app/dashboard/subscription/schema/subscription";

// Note: We don't import SubscriptionFormValues here to avoid generic conflicts.
// We let Zod infer the type.

interface SubscriptionFormProps {
  children?: React.ReactNode;
  onSuccess?: () => void;
}

export function SubscriptionForm({ children, onSuccess }: SubscriptionFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  // 1. Remove explicit generic <SubscriptionFormValues>
  // Let zodResolver infer the correct Input vs Output types to fix TS errors
  const form = useForm({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      name: "",
      amount: 0,
      currency: "USD",
      cycle: "MONTHLY",
      startDate: formatISO(new Date()).slice(0, 10), // YYYY-MM-DD
      nextBilling: formatISO(new Date()).slice(0, 10), // YYYY-MM-DD
      isActive: true,
      autoExpense: true,
      note: "",
      category: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
    reset,
  } = form;

  const watchedCategory = useWatch({ control, name: "category" });
  const watchedCurrency = useWatch({ control, name: "currency" });
  const watchedCycle = useWatch({ control, name: "cycle" });
  const watchedIsActive = useWatch({ control, name: "isActive" });
  const watchedAutoExpense = useWatch({ control, name: "autoExpense" });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const formattedData = {
        ...data,
        startDate: new Date(data.startDate).toISOString(),
        nextBilling: new Date(data.nextBilling).toISOString(),
        endDate: data.endDate ? new Date(data.endDate).toISOString() : null,
        // Handle empty category select
        category:
          !data.category || data.category === "none"
            ? undefined
            : data.category,
      };
      const res = await axios.post("/api/subscription", formattedData);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Subscription created successfully");
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
      reset();
      setIsOpen(false);
      onSuccess?.();
    },
    onError: (error: any) => {
      handleFormError(error, "Failed to create subscription");
    },
  });

  const onSubmit = (data: any) => {
    createMutation.mutate(data);
  };

  const categoryOptions = SUBSCRIPTION_CATEGORIES.map((cat) => ({
    value: cat,
    label: cat,
  }));

  const cycleOptions = CYCLE_OPTIONS.map((c) => ({
    value: c.value,
    label: c.label,
  }));

  const currencyOptions = CURRENCY_OPTIONS.map((c) => ({
    value: c.value,
    label: c.label,
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
            Add Subscription
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      )}

      <FormModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="New Subscription"
        subtitle="Track recurring payments automatically"
        icon={<RotateCw className="w-6 h-6 text-white" />}
        gradient="bg-linear-to-r from-blue-500 to-cyan-500"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Service Name */}
          <FormInput
            label="Service Name"
            name="name"
            icon={<CreditCard className="w-4 h-4 text-blue-600" />}
            iconBg="bg-linear-to-br from-blue-100 to-cyan-100"
            placeholder="e.g. Netflix, Spotify, AWS"
            register={register}
            error={errors.name?.message}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Amount */}
            <FormInput
              label="Amount"
              name="amount"
              type="number"
              step="0.01"
              min="0"
              icon={<Wallet className="w-4 h-4 text-emerald-600" />}
              iconBg="bg-linear-to-br from-green-100 to-emerald-100"
              placeholder="0.00"
              prefix={
                watchedCurrency === "USD"
                  ? "$"
                  : watchedCurrency === "EUR"
                  ? "€"
                  : watchedCurrency === "GBP"
                  ? "£"
                  : "$"
              }
              register={register}
              error={errors.amount?.message}
              required
            />

            {/* Currency */}
            <FormSelect
              label="Currency"
              icon={<Globe className="w-4 h-4 text-indigo-600" />}
              iconBg="bg-linear-to-br from-indigo-100 to-violet-100"
              value={watchedCurrency}
              onValueChange={(val) => setValue("currency", val)}
              options={currencyOptions}
              type="currency"
              showNoCategory={false}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Billing Cycle */}
            <FormSelect
              label="Billing Cycle"
              icon={<RotateCw className="w-4 h-4 text-orange-600" />}
              iconBg="bg-linear-to-br from-orange-100 to-amber-100"
              value={watchedCycle}
              onValueChange={(val) => setValue("cycle", val as any)}
              options={cycleOptions}
            />

            {/* Category */}
            <FormSelect
              label="Category"
              icon={<TagIcon className="w-4 h-4 text-purple-600" />}
              iconBg="bg-linear-to-br from-purple-100 to-pink-100"
              value={watchedCategory || "none"}
              onValueChange={(val) =>
                setValue("category", val === "none" ? null : val)
              }
              options={categoryOptions}
              type="category"
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Start Date"
              name="startDate"
              // Fix TS Error: casting as any to allow 'date' type in strict component
              type={"date" as any}
              icon={<Calendar className="w-4 h-4 text-pink-600" />}
              iconBg="bg-linear-to-br from-pink-100 to-rose-100"
              register={register}
              error={errors.startDate?.message}
            />

            <FormInput
              label="Next Billing"
              name="nextBilling"
              type={"date" as any}
              icon={<Calendar className="w-4 h-4 text-pink-600" />}
              iconBg="bg-linear-to-br from-pink-100 to-rose-100"
              register={register}
              error={errors.nextBilling?.message}
              required
            />
          </div>

          {/* Toggles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3 p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-100/50 transition-colors">
              <Checkbox
                id="isActive"
                checked={watchedIsActive}
                onCheckedChange={(val) => setValue("isActive", val as boolean)}
                className="mt-1 data-[state=checked]:bg-blue-500 border-slate-300"
              />
              <div className="space-y-0.5">
                <Label
                  htmlFor="isActive"
                  className="text-sm font-semibold text-slate-700 cursor-pointer"
                >
                  Active
                </Label>
                <p className="text-xs text-slate-500">
                  Track in dashboard stats
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-100/50 transition-colors">
              <Checkbox
                id="autoExpense"
                checked={watchedAutoExpense}
                onCheckedChange={(val) =>
                  setValue("autoExpense", val as boolean)
                }
                className="mt-1 data-[state=checked]:bg-blue-500 border-slate-300"
              />
              <div className="space-y-0.5">
                <Label
                  htmlFor="autoExpense"
                  className="text-sm font-semibold text-slate-700 cursor-pointer"
                >
                  Auto-Expense
                </Label>
                <p className="text-xs text-slate-500">
                  Add expense on billing date
                </p>
              </div>
            </div>
          </div>

          {/* Note */}
          <FormInput
            label="Notes"
            name="note"
            type="textarea"
            icon={<FileText className="w-4 h-4 text-slate-600" />}
            iconBg="bg-linear-to-br from-slate-100 to-gray-100"
            placeholder="Additional details..."
            register={register}
            rows={2}
          />

          <div className="pt-4">
            <Button
              type="submit"
              disabled={createMutation.isPending}
              className="w-full h-14 rounded-xl bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white text-lg font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 group"
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 mr-3" />
                  Create Subscription
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