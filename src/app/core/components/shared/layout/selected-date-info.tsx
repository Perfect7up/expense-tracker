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
    <div className="bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg w-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-300 flex items-center justify-center shrink-0">
          <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-sm sm:text-base font-semibold text-slate-900 truncate">
            Selected:{" "}
            <span className="hidden xs:inline">
              {date.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span className="xs:hidden">
              {date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </h4>
          <p className="text-xs text-slate-500">Daily {singular} breakdown</p>
        </div>
      </div>

      {/* Items List */}
      {dailyItems.length > 0 ? (
        <div className="space-y-2 sm:space-y-3 max-h-64 sm:max-h-72 overflow-y-auto pr-1 sm:pr-2">
          {dailyItems.map((item) => (
            <div
              key={item.id}
              className="flex flex-col xs:flex-row xs:items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-slate-50/50 to-white rounded-lg sm:rounded-xl border border-slate-200/30 hover:border-blue-200 transition-all duration-300 group gap-2 xs:gap-0"
            >
              <div className="flex items-center gap-2 sm:gap-3 w-full xs:w-auto">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center shrink-0">
                  <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-base sm:text-lg font-bold text-slate-900">
                    ${item.amount.toFixed(2)}
                  </p>
                  {item.note && (
                    <p className="text-xs sm:text-sm text-slate-600 truncate max-w-[180px] sm:max-w-[200px] group-hover:text-slate-800">
                      {item.note}
                    </p>
                  )}
                </div>
              </div>
              <span className="text-xs px-3 py-1.5 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 text-blue-700 rounded-full font-medium border border-blue-200/30 self-start xs:self-center whitespace-nowrap shrink-0">
                {new Date(item.occurredAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 sm:py-8">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400" />
          </div>
          <p className="text-slate-500 font-medium text-sm sm:text-base">
            No {plural} for this date
          </p>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-[280px] mx-auto">
            Add a {singular} to track your{" "}
            {itemType === "expense" ? "spending" : "earnings"}
          </p>
        </div>
      )}

      {/* Button - Improved for mobile */}
      <Button
        onClick={onShowMonthly}
        className="w-full mt-4 sm:mt-6 rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-4 sm:py-6 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 group"
      >
        <div className="flex items-center justify-center gap-2 w-full flex-wrap sm:flex-nowrap">
          <Calendar className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
          <span className="text-xs sm:text-sm whitespace-normal sm:whitespace-nowrap text-center sm:text-left">
            <span className="hidden xs:inline">View All </span>
            {plural.charAt(0).toUpperCase() + plural.slice(1)}
            <span className="hidden sm:inline">
              {" "}for {date.toLocaleDateString("en-US", { month: "long" })}
            </span>
            <span className="sm:hidden">
              {" "}for {date.toLocaleDateString("en-US", { month: "short" })}
            </span>
          </span>
          <Zap className="h-3 w-3 sm:h-4 sm:w-4 shrink-0 ml-auto sm:ml-2 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </Button>
    </div>
  );
}