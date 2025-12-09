"use client";

import { useState } from "react";
import { useIncomes } from "@/app/core/hooks/use-income";
import { useIncomeCategories } from "@/app/core/hooks/use-categories";
import { Button } from "@/app/core/components/ui/button";
import { Input } from "@/app/core/components/ui/input";
import { Textarea } from "@/app/core/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/core/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface AddIncomeFormProps {
  onSuccess?: () => void;
}

export function AddIncomeForm({ onSuccess }: AddIncomeFormProps) {
  const { createIncome } = useIncomes();
  // New hook returns static data instantly
  const { data: categories } = useIncomeCategories();

  // Format date for datetime-local input
  const formatDateForInput = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const [formData, setFormData] = useState({
    amount: "",
    categoryId: "",
    source: "",
    note: "",
    receivedAt: formatDateForInput(new Date()),
  });

  // Simple Category Handler
  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, categoryId: value }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.amount) {
      toast.error("Amount is required");
      return;
    }

    if (!formData.receivedAt) {
      toast.error("Date and time are required");
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid positive amount");
      return;
    }

    const payload = {
      amount: amount,
      currency: "USD",
      receivedAt: new Date(formData.receivedAt).toISOString(),
      ...(formData.source && { source: formData.source }),
      ...(formData.note && { note: formData.note }),
      // Only send categoryId if it's not "none" or "uncategorized"
      ...(formData.categoryId &&
      formData.categoryId !== "none" &&
      formData.categoryId !== "uncategorized"
        ? { categoryId: formData.categoryId }
        : {}),
    };

    try {
      await createIncome.mutateAsync(payload);

      setFormData({
        amount: "",
        categoryId: "",
        source: "",
        note: "",
        receivedAt: formatDateForInput(new Date()),
      });

      toast.success("Income added successfully!");

      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error("Add Income Error:", error);
      toast.error(error.message || "Failed to add income");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-1">
      {/* Amount */}
      <div>
        <label htmlFor="amount" className="block mb-1 text-sm font-medium">
          Amount *
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            $
          </span>
          <Input
            id="amount"
            name="amount"
            type="number"
            required
            step="0.01"
            min="0.01"
            className="pl-8"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
          />
        </div>
      </div>

      {/* Source */}
      <div>
        <label htmlFor="source" className="block mb-1 text-sm font-medium">
          Source
        </label>
        <Input
          id="source"
          name="source"
          type="text"
          value={formData.source}
          onChange={handleChange}
          placeholder="Salary, business, etc."
        />
      </div>

      {/* Category Section */}
      <div>
        <label htmlFor="categoryId" className="block mb-1 text-sm font-medium">
          Category
        </label>

        <Select
          value={formData.categoryId || ""}
          onValueChange={handleCategoryChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No category</SelectItem>
            <SelectItem value="uncategorized">-- Uncategorized --</SelectItem>

            {categories?.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Note */}
      <div>
        <label htmlFor="note" className="block mb-1 text-sm font-medium">
          Note
        </label>
        <Textarea
          id="note"
          name="note"
          rows={3}
          value={formData.note}
          onChange={handleChange}
          placeholder="Optional note about this income"
        />
      </div>

      {/* Date */}
      <div>
        <label htmlFor="receivedAt" className="block mb-1 text-sm font-medium">
          Received At *
        </label>
        <Input
          id="receivedAt"
          name="receivedAt"
          type="datetime-local"
          required
          value={formData.receivedAt}
          onChange={handleChange}
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={createIncome.isPending}
        className="w-full bg-green-600 hover:bg-green-700 mt-4"
      >
        {createIncome.isPending ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Adding...
          </>
        ) : (
          "Add Income"
        )}
      </Button>
    </form>
  );
}
