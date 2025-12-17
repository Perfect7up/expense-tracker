'use client'
import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import { Input } from "@/app/core/components/ui/input";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/app/core/components/ui/form";

interface PasswordFieldProps {
  field: any;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  showStrength?: boolean;
  onPasswordChange?: (password: string) => void;
}

export default function PasswordField({
  field,
  label,
  placeholder = "••••••••",
  disabled = false,
  showStrength = false,
  onPasswordChange,
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    field.onChange(e);
    if (onPasswordChange) {
      onPasswordChange(e.target.value);
    }
  };

  return (
    <FormItem>
      <FormLabel className="text-slate-700 text-sm sm:text-base">{label}</FormLabel>
      <FormControl>
        <div className="space-y-2">
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
            <Input
              {...field}
              value={field.value}
              onChange={handleChange}
              placeholder={placeholder}
              type={showPassword ? "text" : "password"}
              className="pl-9 sm:pl-10 pr-9 sm:pr-10 h-10 sm:h-11 bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 text-sm sm:text-base"
              disabled={disabled}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              disabled={disabled}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>
          </div>
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}