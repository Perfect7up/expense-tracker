"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/core/components/ui/card";
import { format } from "date-fns";
import { DollarSign } from "lucide-react";

interface DailyIncomesListProps {
  incomes: any[];
  selectedDate: Date;
}

export function DailyIncomesList({
  incomes,
  selectedDate,
}: DailyIncomesListProps) {
  if (!incomes || incomes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            No incomes recorded for {format(selectedDate, "MMMM d")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-sm">
            Add income for this date using the form above.
          </p>
        </CardContent>
      </Card>
    );
  }

  const totalAmount = incomes.reduce(
    (sum, income) => sum + (income.amount || 0),
    0
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <span>Incomes for {format(selectedDate, "MMMM d")}</span>
          <span className="text-emerald-600 font-bold">
            ${totalAmount.toFixed(2)}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {incomes.map((income) => (
            <div
              key={income.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div>
                <p className="font-medium">{income.description || "Income"}</p>
                <p className="text-sm text-gray-500">
                  {income.category?.name || "Uncategorized"}
                  {income.source && ` • ${income.source}`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-emerald-600" />
                <span className="font-bold text-emerald-800">
                  ${income.amount.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
