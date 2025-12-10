import { ReactNode } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/core/components/ui/select";
import { Tag } from "lucide-react";

interface FormSelectProps {
  label: string;
  icon: ReactNode;
  iconBg: string;
  value: string | undefined;
  onValueChange: (value: string) => void;
  placeholder?: string;
  options: Array<{ value: string; label: string; icon?: ReactNode }>;
  type?: "category" | "currency";
  showNoCategory?: boolean;
}

export function FormSelect({
  label,
  icon,
  iconBg,
  value,
  onValueChange,
  placeholder = "Select an option",
  options,
  type = "category",
  showNoCategory = true,
}: FormSelectProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div
          className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center`}
        >
          {icon}
        </div>
        <label className="text-sm font-semibold text-slate-700">{label}</label>
      </div>

      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="h-14 rounded-xl border-slate-200/50 bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-purple-500/20">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="rounded-xl border-slate-200/50 bg-white/90 backdrop-blur-md shadow-2xl">
          {type === "category" && showNoCategory && (
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
          )}

          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="rounded-lg hover:bg-slate-100/50"
            >
              {type === "currency" ? (
                <div className="flex items-center gap-2">
                  <span className="text-lg">{option.label.split(" ")[0]}</span>
                  {option.label}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {option.icon || (
                    <div className="w-6 h-6 rounded-md bg-blue-100 flex items-center justify-center">
                      <Tag className="w-3 h-3 text-blue-500" />
                    </div>
                  )}
                  {option.label}
                </div>
              )}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
