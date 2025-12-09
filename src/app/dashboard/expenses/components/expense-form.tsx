"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { expenseSchema, ExpenseFormType } from "@/app/core/schema/expense";
import { useExpenses } from "@/app/core/hooks/use-expenses";
import { useExpenseCategories } from "@/app/core/hooks/use-categories";

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
import {
  Loader2,
  Plus,
  DollarSign,
  Calendar,
  Tag,
  FileText,
  Globe,
  ArrowRight,
  X,
} from "lucide-react";
import { toast } from "sonner";

interface ExpenseFormProps {
  children?: React.ReactNode;
}

export function ExpenseForm({ children }: ExpenseFormProps) {
  const { createExpense, isCreating } = useExpenses();
  // New hook returns data instantly, no loading state needed really
  const { data: categories } = useExpenseCategories();
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

  const handleCategoryChange = (value: string) => {
    form.setValue("categoryId", value);
  };

  const onSubmit = async (data: ExpenseFormType) => {
    try {
      const payload = {
        amount: Number(data.amount),
        currency: data.currency || "USD",
        occurredAt: new Date(data.occurredAt).toISOString(),
        note: data.note?.trim() || undefined,
        categoryId:
          data.categoryId === "none" || data.categoryId === "uncategorized"
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
    } catch (error: any) {
      console.error("Failed to create expense:", error);
      toast.error(error.message || "Failed to add expense");
    }
  };

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

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          <div className="relative bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-lg mx-auto border border-white/50 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="relative bg-linear-to-r from-blue-500 to-cyan-500 p-6">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 blur-2xl" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12 blur-2xl" />

              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                    <Plus className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Add New Expense
                    </h2>
                    <p className="text-sm text-blue-100/80">
                      Track your spending instantly
                    </p>
                  </div>
                </div>
                <button
                  className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 flex items-center justify-center border border-white/30 transition-all duration-300 group"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-blue-600" />
                    </div>
                    <label
                      htmlFor="amount"
                      className="text-sm font-semibold text-slate-700"
                    >
                      Amount *
                    </label>
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
                        {...form.register("amount", {
                          valueAsNumber: true,
                          required: "Amount is required",
                          min: {
                            value: 0.01,
                            message: "Amount must be positive",
                          },
                        })}
                      />
                    </div>
                  </div>
                  {form.formState.errors.amount && (
                    <p className="text-red-500 text-sm px-1">
                      {form.formState.errors.amount.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-linear-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                        <Tag className="w-4 h-4 text-purple-600" />
                      </div>
                      <label className="text-sm font-semibold text-slate-700">
                        Category
                      </label>
                    </div>

                    <Select
                      value={watchedCategoryId ?? undefined}
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

                        {/* Map through the static categories provided by the hook */}
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

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-linear-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                        <Globe className="w-4 h-4 text-green-600" />
                      </div>
                      <label className="text-sm font-semibold text-slate-700">
                        Currency
                      </label>
                    </div>
                    <Select
                      onValueChange={(value) =>
                        form.setValue("currency", value)
                      }
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

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-linear-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-amber-600" />
                    </div>
                    <label
                      htmlFor="occurredAt"
                      className="text-sm font-semibold text-slate-700"
                    >
                      Date & Time *
                    </label>
                  </div>
                  <Input
                    id="occurredAt"
                    type="datetime-local"
                    className="h-14 rounded-xl border-slate-200/50 bg-white/50 backdrop-blur-sm text-lg focus:border-amber-300 focus:ring-2 focus:ring-amber-500/20"
                    {...form.register("occurredAt", {
                      required: "Date is required",
                    })}
                  />
                  {form.formState.errors.occurredAt && (
                    <p className="text-red-500 text-sm px-1">
                      {form.formState.errors.occurredAt.message}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-linear-to-br from-slate-100 to-gray-100 flex items-center justify-center">
                      <FileText className="w-4 h-4 text-slate-600" />
                    </div>
                    <label
                      htmlFor="note"
                      className="text-sm font-semibold text-slate-700"
                    >
                      Note
                    </label>
                  </div>
                  <Textarea
                    id="note"
                    rows={3}
                    placeholder="Optional note about this expense (e.g., 'Dinner with friends', 'Office supplies')"
                    className="rounded-xl border-slate-200/50 bg-white/50 backdrop-blur-sm focus:border-slate-300 focus:ring-2 focus:ring-slate-500/20 resize-none"
                    {...form.register("note")}
                  />
                </div>

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
            </div>
          </div>
        </div>
      )}
    </>
  );
}
