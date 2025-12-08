"use client";

import { useEffect } from "react";
import { Button } from "@/app/core/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50/50 to-cyan-50/30 p-6">
          <div className="max-w-md w-full bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-slate-200/50 shadow-xl text-center space-y-6">
            {/* Error Icon */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-10 h-10 text-red-600" />
            </div>

            {/* Error Message */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Critical Error
              </h2>
              <p className="text-slate-600">
                A critical error has occurred. Please refresh the page or try
                again later.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <Button
                onClick={() => window.location.reload()}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg shadow-blue-500/30"
              >
                <RefreshCw className="mr-2 w-4 h-4" />
                Refresh Page
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
