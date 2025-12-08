import { Trash2 } from "lucide-react";

interface ExpenseItemProps {
  expense: {
    id: string;
    amount: number;
    note?: string | null;
    occurredAt: string;
    categoryName?: string | null;
  };
  onDelete: (id: string) => void;
}

export function ExpenseItem({ expense, onDelete }: ExpenseItemProps) {
  const categoryName =
    expense.categoryName &&
    !["none", "uncategorized"].includes(expense.categoryName.toLowerCase())
      ? expense.categoryName
      : "Uncategorized";

  return (
    <div className="flex justify-between items-center p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm border">
      <div>
        <p className="font-semibold">{categoryName}</p>

        {expense.note && (
          <p className="text-sm text-gray-500 dark:text-gray-300">
            {expense.note}
          </p>
        )}

        <p className="text-xs text-gray-400 mt-1">
          {new Date(expense.occurredAt).toLocaleString()}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <p className="font-bold">${expense.amount}</p>

        <button
          onClick={() => onDelete(expense.id)}
          className="text-red-500 hover:text-red-700"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}
