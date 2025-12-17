import Link from "next/link";
import { Wifi, ArrowLeftCircleIcon } from "lucide-react";

export default function ResponsiveNav() {
  return (
    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-8 sm:mb-12">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 group">
        <div className="relative">
          <div className="absolute -inset-1 sm:-inset-2 bg-linear-to-r from-blue-500 to-cyan-400 rounded-full blur opacity-30 group-hover:opacity-50 transition-opacity" />
          <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-md sm:shadow-lg">
            <Wifi
              className="h-4 w-4 sm:h-5 sm:w-5 text-white rotate-45"
              strokeWidth={3}
            />
          </div>
        </div>
        <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
          FINANCI
          <span className="bg-linear-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
            AI
          </span>
        </span>
      </Link>

      {/* Navigation Links - Responsive Stack */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
        {/* Back Button - Always visible */}
        <Link
          href="/"
          className="flex items-center text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors w-full sm:w-auto"
        >
          <ArrowLeftCircleIcon className="inline w-4 h-4 sm:w-5 sm:h-5 mr-1" />
          Back to Home
        </Link>

        {/* Create Account Link - Stacked on mobile, inline on desktop */}
        <div className="text-xs sm:text-sm text-slate-600 flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2 w-full sm:w-auto">
          <span className="hidden sm:inline">New user?</span>
          <span className="sm:hidden text-sm">Don't have an account?</span>
          <Link
            href="/account/signup"
            className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            Create account
          </Link>
        </div>
      </div>
    </header>
  );
}