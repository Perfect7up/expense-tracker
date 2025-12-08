"use client";

import React from "react";
import { useExpenseCategories } from "@/app/core/hooks/use-categories";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/core/components/ui/select";
import { Loader2 } from "lucide-react";

interface CategorySelectProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
}

export function CategorySelect({
  value,
  onChange,
  placeholder = "Select category",
  disabled = false,
  required = false,
}: CategorySelectProps) {
  const { data: categories, isLoading, error } = useExpenseCategories();

  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm text-muted-foreground">
          Loading categories...
        </span>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="text-sm text-red-500">Failed to load categories</div>
    );
  }

  return (
    <Select
      value={value || ""}
      onValueChange={onChange}
      disabled={disabled}
      required={required}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {/* Default "No category" option - use a special value instead of empty string */}
        <SelectItem value="none">No category</SelectItem>

        {/* Uncategorized option */}
        <SelectItem value="uncategorized">-- Uncategorized --</SelectItem>

        {/* Category options */}
        {categories?.map((category) => (
          <SelectItem key={category.id} value={category.id}>
            {category.name}
          </SelectItem>
        ))}

        {/* Empty state */}
        {!isLoading && categories?.length === 0 && (
          <div className="px-2 py-1.5 text-sm text-muted-foreground">
            No categories found. Create one first.
          </div>
        )}
      </SelectContent>
    </Select>
  );
}
