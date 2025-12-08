"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/app/core/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function LayoutErrorHandler({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const pathname = usePathname();

  useEffect(() => {
    console.error("Layout error on", pathname, ":", error);
  }, [error, pathname]);

  return (
    <div className="p-6 border border-red-200 bg-red-50 rounded-xl">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="font-semibold text-red-900 mb-1">Layout Error</h3>
          <p className="text-red-700 text-sm mb-3">
            There was an error loading this section of the page.
          </p>
          <Button
            onClick={reset}
            size="sm"
            variant="outline"
            className="border-red-200 text-red-700 hover:bg-red-100"
          >
            <RefreshCw className="mr-2 w-3 h-3" />
            Retry
          </Button>
        </div>
      </div>
    </div>
  );
}
