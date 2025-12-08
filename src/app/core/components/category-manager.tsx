"use client";

import React, { useState } from "react";
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  CategoryWithCounts,
} from "@/app/core/hooks/use-categories";
import { CategoryType } from "@prisma/client";
import { Plus, Edit2, Trash2, X, Check, AlertCircle } from "lucide-react";

interface CategoryManagerProps {
  type: CategoryType;
  onCategorySelect?: (categoryId: string | null) => void;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({
  type,
  onCategorySelect,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Fetch categories with counts
  const { data: categories, isLoading, refetch } = useCategories(type, true);

  // Mutations
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const handleCreate = async () => {
    if (!newCategoryName.trim()) {
      setError("Category name is required");
      return;
    }

    setError(null);
    try {
      await createMutation.mutateAsync({
        name: newCategoryName.trim(),
        type,
      });
      setNewCategoryName("");
      setIsCreating(false);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to create category");
    }
  };

  const handleUpdate = async (id: string, newName: string) => {
    if (!newName.trim()) return;

    try {
      await updateMutation.mutateAsync({
        id,
        name: newName.trim(),
      });
      setEditingId(null);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to update category");
    }
  };

  const handleDelete = async (id: string, category: CategoryWithCounts) => {
    if (category.expenseCount! > 0 || category.incomeCount! > 0) {
      const confirmDelete = window.confirm(
        `This category has ${category.expenseCount} expense(s) and ${category.incomeCount} income(s). Are you sure you want to delete it?`
      );
      if (!confirmDelete) return;
    } else {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this category?"
      );
      if (!confirmDelete) return;
    }

    try {
      await deleteMutation.mutateAsync(id);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to delete category");
    }
  };

  const typeLabel = type.toLowerCase();
  const typeColor = type === "EXPENSE" ? "red" : "green";

  if (isLoading) {
    return (
      <div className="p-4 border rounded-lg bg-gray-50">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-8 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold capitalize">
          {typeLabel} Categories
        </h3>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          <Plus size={16} />
          Add New
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md flex items-center gap-2">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Create Category Form */}
      {isCreating && (
        <div className="mb-4 p-3 bg-blue-50 rounded-md">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder={`Enter ${typeLabel} category name`}
              className="flex-1 p-2 border rounded-md"
              autoFocus
              onKeyPress={(e) => e.key === "Enter" && handleCreate()}
            />
            <button
              onClick={handleCreate}
              disabled={createMutation.isPending}
              className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50"
            >
              <Check size={20} />
            </button>
            <button
              onClick={() => {
                setIsCreating(false);
                setNewCategoryName("");
                setError(null);
              }}
              className="p-2 bg-gray-300 rounded-md hover:bg-gray-400"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Categories List */}
      <div className="space-y-2">
        {categories && categories.length > 0 ? (
          categories.map((category) => (
            <div
              key={category.id}
              className={`flex items-center justify-between p-3 border rounded-md hover:bg-gray-50 ${
                editingId === category.id ? "bg-blue-50" : ""
              }`}
            >
              {editingId === category.id ? (
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="text"
                    defaultValue={category.name}
                    onBlur={(e) => handleUpdate(category.id, e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" &&
                      handleUpdate(category.id, e.currentTarget.value)
                    }
                    className="flex-1 p-1 border rounded"
                    autoFocus
                  />
                  <button
                    onClick={() => setEditingId(null)}
                    className="p-1 text-gray-500 hover:text-gray-700"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 flex-1">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full bg-${typeColor}-100 text-${typeColor}-800`}
                    >
                      {category.type}
                    </span>
                    <span className="font-medium">{category.name}</span>
                    {onCategorySelect && (
                      <button
                        onClick={() => onCategorySelect(category.id)}
                        className="ml-2 text-sm text-blue-500 hover:text-blue-700"
                      >
                        Select
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {category.expenseCount || category.incomeCount ? (
                      <span className="text-sm text-gray-500">
                        {category.expenseCount || 0} expense(s),{" "}
                        {category.incomeCount || 0} income(s)
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">
                        No transactions
                      </span>
                    )}
                    <button
                      onClick={() => setEditingId(category.id)}
                      className="p-1 text-blue-500 hover:text-blue-700"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id, category)}
                      className="p-1 text-red-500 hover:text-red-700"
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-gray-500">
            No {typeLabel} categories yet. Create your first one!
          </div>
        )}
      </div>

      {/* Statistics */}
      {categories && categories.length > 0 && (
        <div className="mt-4 pt-4 border-t text-sm text-gray-500">
          Total: {categories.length} {typeLabel} categories
        </div>
      )}
    </div>
  );
};

export default CategoryManager;
