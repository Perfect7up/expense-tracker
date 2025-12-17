import { Shield } from "lucide-react";

export default function SecurityTip() {
  return (
    <div className="flex items-start gap-3 bg-linear-to-r from-blue-50/50 to-cyan-50/50 rounded-lg p-3 sm:p-4">
      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-linear-to-br from-green-100 to-emerald-100 flex items-center justify-center shrink-0">
        <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-900">Security Tip</p>
        <p className="text-xs text-slate-600 mt-0.5">
          Use a strong password with at least 6 characters, including letters and numbers.
        </p>
      </div>
    </div>
  );
}