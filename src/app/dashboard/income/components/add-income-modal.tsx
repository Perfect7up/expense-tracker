"use client";

import { useState } from "react";
import { AddIncomeForm } from "./add-income-form";
import { Button } from "@/app/core/components/ui/button";
import { Plus } from "lucide-react";

// The form handles its own data fetching, so the modal
// doesn't need to accept or pass categories.
export function AddIncomeModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="flex justify-end">
        <Button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
        >
          <Plus className="w-4 h-4" /> Add Income
        </Button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-4 relative max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-lg"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4">Add New Income</h2>

            {/* Removed 'categories={categories}' because AddIncomeForm fetches its own data */}
            <AddIncomeForm onSuccess={() => setIsOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
