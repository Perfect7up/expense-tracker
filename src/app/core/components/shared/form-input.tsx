import { ReactNode } from "react";
import { Input } from "@/app/core/components/ui/input";
import { Textarea } from "@/app/core/components/ui/textarea";

interface FormInputProps {
  label: string;
  name: string;
  icon: ReactNode;
  iconBg: string;
  type?: "text" | "number" | "datetime-local" | "textarea";
  placeholder?: string;
  required?: boolean;
  step?: string;
  min?: string;
  register: any;
  error?: string;
  prefix?: string;
  rows?: number;
}

export function FormInput({
  label,
  name,
  icon,
  iconBg,
  type = "text",
  placeholder,
  required,
  step,
  min,
  register,
  error,
  prefix,
  rows = 3,
}: FormInputProps) {
  const InputComponent = type === "textarea" ? Textarea : Input;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div
          className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center`}
        >
          {icon}
        </div>
        <label htmlFor={name} className="text-sm font-semibold text-slate-700">
          {label} {required && "*"}
        </label>
      </div>

      <div className="relative group">
        <div
          className={`absolute inset-0 ${type === "number" ? "bg-linear-to-r from-blue-500/10 to-cyan-500/10" : "bg-slate-100"} rounded-xl blur group-hover:blur-sm transition-all duration-300`}
        />
        <div className="relative">
          {prefix && (
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400">
              {prefix}
            </span>
          )}
          <InputComponent
            id={name}
            type={type}
            step={step}
            min={min}
            placeholder={placeholder}
            className={`${type === "textarea" ? "" : "h-14"} ${prefix ? "pl-10" : ""} rounded-xl border-slate-200/50 bg-white/50 backdrop-blur-sm focus:border-blue-300 focus:ring-2 focus:ring-blue-500/20 ${type === "number" || type === "datetime-local" ? "text-lg font-semibold" : ""}`}
            rows={rows}
            {...register(name)}
          />
        </div>
      </div>

      {error && <p className="text-red-500 text-sm px-1">{error}</p>}
    </div>
  );
}
