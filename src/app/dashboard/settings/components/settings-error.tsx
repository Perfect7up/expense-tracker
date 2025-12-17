import { Button } from "@/app/core/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

interface SettingsErrorProps {
  error: Error;
  onRetry: () => void;
}

export default function SettingsError({ error, onRetry }: SettingsErrorProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-linear-to-r from-red-100 to-pink-100 flex items-center justify-center mx-auto">
          <AlertCircle className="w-10 h-10 text-red-500" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">Error Loading Settings</h2>
          <p className="text-slate-600">{error.message}</p>
        </div>
        <Button
          onClick={onRetry}
          className="rounded-full bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg shadow-blue-500/20"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry
        </Button>
      </div>
    </div>
  );
}