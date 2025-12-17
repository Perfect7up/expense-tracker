import { ReactNode } from "react";
import { Input } from "@/app/core/components/ui/input";
import { Textarea } from "@/app/core/components/ui/textarea";

interface FormInputProps {
  label: string;
  name: string;
  icon: ReactNode;
  iconBg: string;
  type?: "text" | "number" | "datetime-local" | "textarea" | "email" | "tel" | "url" | "password";
  placeholder?: string;
  required?: boolean;
  step?: string;
  min?: string;
  max?: string;
  register: any;
  error?: string;
  prefix?: string;
  suffix?: string;
  rows?: number;
  disabled?: boolean;
  autoComplete?: string;
  pattern?: string;
  className?: string;
  compactOnMobile?: boolean;
  showLabelOnMobile?: boolean;
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
  max,
  register,
  error,
  prefix,
  suffix,
  rows = 3,
  disabled = false,
  autoComplete,
  pattern,
  className = "",
  compactOnMobile = false,
  showLabelOnMobile = true,
}: FormInputProps) {
  const InputComponent = type === "textarea" ? Textarea : Input;

  return (
    <div className={`space-y-1.5 sm:space-y-3 ${compactOnMobile ? "mb-2 sm:mb-0" : ""}`}>
      {/* Label and Icon */}
      <div className={`flex items-center gap-2 ${!showLabelOnMobile ? "hidden sm:flex" : ""}`}>
        <div
          className={`w-6 h-6 sm:w-8 sm:h-8 rounded-md sm:rounded-lg ${iconBg} flex items-center justify-center shrink-0`}
        >
          <div className="w-3.5 h-3.5 sm:w-5 sm:h-5">
            {icon}
          </div>
        </div>
        <label 
          htmlFor={name} 
          className={`text-xs sm:text-sm font-semibold text-slate-700 truncate ${!showLabelOnMobile ? "hidden sm:block" : ""}`}
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      </div>

      {/* Input Field */}
      <div className="relative group">
        {/* Background glow effect */}
        <div
          className={`absolute inset-0 ${
            type === "number" 
              ? "bg-linear-to-r from-blue-500/5 to-cyan-500/5" 
              : "bg-slate-50"
          } rounded-lg sm:rounded-xl blur group-hover:blur-sm transition-all duration-300`}
        />
        
        {/* Input with prefix/suffix */}
        <div className="relative">
          {(prefix || suffix) && (
            <div className="absolute inset-y-0 flex items-center pointer-events-none">
              {prefix && (
                <span className="text-xs sm:text-sm text-slate-400 pl-2 sm:pl-3">
                  {prefix}
                </span>
              )}
              {suffix && (
                <span className="text-xs sm:text-sm text-slate-400 pr-2 sm:pl-3 right-0">
                  {suffix}
                </span>
              )}
            </div>
          )}
          
          <InputComponent
            id={name}
            type={type}
            step={step}
            min={min}
            max={max}
            placeholder={placeholder}
            disabled={disabled}
            autoComplete={autoComplete}
            pattern={pattern}
            className={`
              h-10 sm:h-12
              ${type === "textarea" ? "" : ""}
              ${prefix ? "pl-6 sm:pl-9" : ""}
              ${suffix ? "pr-6 sm:pr-9" : ""}
              rounded-lg sm:rounded-xl
              border border-slate-200
              bg-white
              focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30
              ${type === "number" || type === "datetime-local" ? "text-sm sm:text-base font-medium" : "text-sm"}
              ${error ? "border-red-300 focus:border-red-400 focus:ring-red-500/30" : ""}
              ${disabled ? "opacity-60 cursor-not-allowed bg-slate-50" : ""}
              ${className}
              ${compactOnMobile ? "text-sm" : ""}
              placeholder:text-xs sm:placeholder:text-sm
              placeholder:text-slate-400
              resize-none
            `}
            rows={compactOnMobile ? Math.min(rows, 3) : rows}
            aria-label={!showLabelOnMobile ? label : undefined}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? `${name}-error` : undefined}
            {...register(name)}
          />
        </div>
      </div>

      {/* Error message and mobile helper text */}
      {error ? (
        <div className="flex flex-col sm:flex-row sm:items-center gap-1">
          <p 
            id={`${name}-error`}
            className="text-red-500 text-xs sm:text-sm px-1 flex items-center gap-1"
            role="alert"
          >
            <span className="hidden sm:inline">⚠️</span>
            {error}
          </p>
          {type === "datetime-local" && (
            <span className="text-xs text-slate-500 sm:ml-auto">
              Mobile: Tap calendar icon
            </span>
          )}
        </div>
      ) : (
        // Helper text for certain input types on mobile
        type === "datetime-local" && (
          <p className="text-xs text-slate-500 px-1 hidden sm:block">
            Click to open date/time picker
          </p>
        )
      )}
    </div>
  );
}