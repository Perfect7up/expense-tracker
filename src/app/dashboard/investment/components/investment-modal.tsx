"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  TrendingUp, 
  Hash, 
  Coins, 
  Tag as TagIcon, 
  Activity, 
  CheckCircle2, 
  ArrowRight,
  Loader2,
  ArrowLeftRight,
  DollarSign
} from "lucide-react";

import { Button } from "@/app/core/components/ui/button";
import { FormModal } from "@/app/core/components/shared/form-modal";
import { FormInput } from "@/app/core/components/shared/form-input";
import { FormSelect } from "@/app/core/components/shared/form-select";

import { investmentFormSchema, InvestmentFormValues } from "@/app/dashboard/investment/schema/investments";
import { Investment } from "@/app/dashboard/investment/types/investments";

const INVESTMENT_TYPES = [
  { value: "buy", label: "Buy (Long)" },
  { value: "sell", label: "Sell (Short)" },
];

const INVESTMENT_CATEGORIES = [
  { value: "stocks", label: "Stocks" },
  { value: "crypto", label: "Crypto" },
  { value: "etf", label: "ETF" },
  { value: "bonds", label: "Bonds" },
  { value: "real_estate", label: "Real Estate" },
  { value: "gold", label: "Gold / Commodities" },
  { value: "cash", label: "Cash / Savings" },
];

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: InvestmentFormValues) => void;
  investment?: Investment | null;
}

export function InvestmentModal({
  open,
  onClose,
  onSubmit,
  investment,
}: Props) {
  
  const form = useForm({
    resolver: zodResolver(investmentFormSchema),
    defaultValues: {
      name: "",
      symbol: "",
      quantity: 0,
      averageBuyPrice: 0,
      currentPrice: 0,
      categoryId: "none",
      type: "buy", // Default value matching the "buy" | "sell" type
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    control,
    reset,
  } = form;

  const watchedCategory = useWatch({ control, name: "categoryId" });
  const watchedType = useWatch({ control, name: "type" });

  useEffect(() => {
    if (investment) {
      reset({
        name: investment.name,
        symbol: investment.symbol ?? "",
        quantity: investment.quantity,
        averageBuyPrice: investment.averageBuyPrice,
        currentPrice: investment.currentPrice ?? 0,
        categoryId: investment.categoryId ?? "none",
        // @ts-ignore - Safely handle if 'type' doesn't exist on old Investment objects yet
        type: investment.type ?? "buy", 
      });
    } else {
      reset({
        name: "",
        symbol: "",
        quantity: 0,
        averageBuyPrice: 0,
        currentPrice: 0,
        categoryId: "none",
        type: "buy",
      });
    }
  }, [investment, open, reset]);

  return (
    <FormModal
      isOpen={open}
      onClose={onClose}
      title={investment ? "Edit Asset" : "New Asset"}
      subtitle="Track your portfolio performance"
      icon={<TrendingUp className="w-6 h-6 text-white" />}
      // THEME: Blue/Cyan gradient matching Subscription form
      gradient="bg-linear-to-r from-blue-500 to-cyan-500"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* Row 1: Name */}
        <FormInput
          label="Asset Name"
          name="name"
          icon={<Activity className="w-4 h-4 text-blue-600" />}
          iconBg="bg-linear-to-br from-blue-100 to-cyan-100"
          placeholder="e.g. Apple Inc, Bitcoin"
          register={register}
          error={errors.name?.message as string}
          required
        />

        {/* Row 2: Type & Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {/* Investment Type (Buy/Sell) */}
           <FormSelect
            label="Type"
            icon={<ArrowLeftRight className="w-4 h-4 text-indigo-600" />}
            iconBg="bg-linear-to-br from-indigo-100 to-violet-100"
            value={watchedType}
            // FIX: Cast 'val' to the specific union type required by your schema
            onValueChange={(val) => setValue("type", val as "buy" | "sell")}
            options={INVESTMENT_TYPES}
            type="category"
            showNoCategory={false}
          />

          {/* Category */}
          <FormSelect
            label="Category"
            icon={<TagIcon className="w-4 h-4 text-purple-600" />}
            iconBg="bg-linear-to-br from-purple-100 to-pink-100"
            value={watchedCategory}
            onValueChange={(val) => setValue("categoryId", val)}
            options={INVESTMENT_CATEGORIES}
            type="category"
          />
        </div>

        {/* Row 3: Symbol & Quantity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="Symbol / Ticker"
            name="symbol"
            icon={<TagIcon className="w-4 h-4 text-orange-600" />}
            iconBg="bg-linear-to-br from-orange-100 to-amber-100"
            placeholder="e.g. AAPL"
            register={register}
            error={errors.symbol?.message as string}
          />

          <FormInput
            label="Quantity"
            name="quantity"
            type="number"
            step="any"
            min="0"
            icon={<Hash className="w-4 h-4 text-cyan-600" />}
            iconBg="bg-linear-to-br from-cyan-100 to-sky-100"
            placeholder="0.00"
            register={register}
            error={errors.quantity?.message as string}
            required
          />
        </div>

        {/* Row 4: Prices */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="Avg. Buy Price"
            name="averageBuyPrice"
            type="number"
            step="any"
            min="0"
            icon={<DollarSign className="w-4 h-4 text-emerald-600" />}
            iconBg="bg-linear-to-br from-emerald-100 to-green-100"
            placeholder="0.00"
            prefix="$"
            register={register}
            error={errors.averageBuyPrice?.message as string}
            required
          />

          <FormInput
            label="Current Price"
            name="currentPrice"
            type="number"
            step="any"
            min="0"
            icon={<Coins className="w-4 h-4 text-yellow-600" />}
            iconBg="bg-linear-to-br from-yellow-100 to-amber-100"
            placeholder="0.00"
            prefix="$"
            register={register}
            error={errors.currentPrice?.message as string}
          />
        </div>

        {/* Submit Button - THEME: Blue/Cyan */}
        <div className="pt-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-14 rounded-xl bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white text-lg font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 group"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5 mr-3" />
                {investment ? "Update Asset" : "Add Asset"}
                <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </Button>
        </div>
      </form>
    </FormModal>
  );
}