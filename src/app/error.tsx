// app/error.tsx
"use client";

import { useEffect } from "react";
import { Button } from "@/app/core/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50/50 to-cyan-50/30 p-6">
      <div className="max-w-md w-full bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-slate-200/50 shadow-xl">
        <div className="text-center space-y-6">
          {/* Error Icon */}
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-10 h-10 text-red-600" />
          </div>

          {/* Error Message */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Something went wrong!
            </h2>
            <p className="text-slate-600">
              We apologize for the inconvenience. Please try refreshing the page
              or contact support if the problem persists.
            </p>
          </div>

          {/* Error Details (Only in development) */}
          {process.env.NODE_ENV === "development" && (
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 text-left">
              <p className="text-sm font-medium text-slate-900 mb-1">
                Error details:
              </p>
              <code className="text-xs text-red-600 break-all">
                {error.message}
              </code>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={reset}
              className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg shadow-blue-500/30"
            >
              <RefreshCw className="mr-2 w-4 h-4" />
              Try Again
            </Button>

            <Link href="/" className="flex-1">
              <Button
                variant="outline"
                className="w-full border-blue-200 text-blue-600 hover:bg-blue-50"
              >
                <Home className="mr-2 w-4 h-4" />
                Go Home
              </Button>
            </Link>
          </div>

          {/* Support Link */}
          <div className="pt-4 border-t border-slate-200">
            <p className="text-sm text-slate-600">
              Need help?{" "}
              <Link
                href="/contact"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Contact Support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
