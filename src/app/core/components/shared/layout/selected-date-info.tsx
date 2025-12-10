import { Button } from "@/app/core/components/ui/button";
import { Zap, Calendar, DollarSign } from "lucide-react";

interface DailyItem {
  id: string;
  amount: number;
  note?: string;
  occurredAt: string;
}

interface SelectedDateInfoProps {
  date: Date;
  dailyItems: DailyItem[];
  itemType: "expense" | "income";
  onShowMonthly: () => void;
}

export function SelectedDateInfo({
  date,
  dailyItems,
  itemType,
  onShowMonthly,
}: SelectedDateInfoProps) {
  const singular = itemType === "expense" ? "expense" : "income";
  const plural = itemType === "expense" ? "expenses" : "incomes";

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-6 shadow-lg">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-400 to-pink-300 flex items-center justify-center">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-900">
            Selected:{" "}
            {date.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </h4>
          <p className="text-xs text-slate-500">Daily {singular} breakdown</p>
        </div>
      </div>

      {dailyItems.length > 0 ? (
        <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
          {dailyItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 bg-linear-to-r from-slate-50/50 to-white rounded-xl border border-slate-200/30 hover:border-blue-200 transition-all duration-300 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-900">
                    ${item.amount.toFixed(2)}
                  </p>
                  {item.note && (
                    <p className="text-sm text-slate-600 truncate max-w-[200px] group-hover:text-slate-800">
                      {item.note}
                    </p>
                  )}
                </div>
              </div>
              <span className="text-xs px-3 py-1.5 bg-linear-to-r from-blue-500/10 to-cyan-500/10 text-blue-700 rounded-full font-medium border border-blue-200/30">
                {new Date(item.occurredAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-full bg-linear-to-br from-slate-100 to-slate-200 flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-slate-500 font-medium">
            No {plural} for this date
          </p>
          <p className="text-sm text-slate-400 mt-1">
            Add a {singular} to track your{" "}
            {itemType === "expense" ? "spending" : "earnings"}
          </p>
        </div>
      )}

      <Button
        onClick={onShowMonthly}
        className="w-full mt-6 rounded-xl bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-6 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 group"
      >
        <Calendar className="mr-2 h-5 w-5" />
        View All {plural.charAt(0).toUpperCase() + plural.slice(1)} for{" "}
        {date.toLocaleDateString("en-US", { month: "long" })}
        <Zap className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </Button>
    </div>
  );
}
