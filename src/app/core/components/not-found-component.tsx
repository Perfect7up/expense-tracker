import Link from "next/link";
import { Button } from "@/app/core/components/ui/button";
import { Search, Home, ArrowLeft } from "lucide-react";

export default function NotFoundComponent({
  resource = "page",
  backLink = "/",
  backText = "Back to Home",
}: {
  resource?: string;
  backLink?: string;
  backText?: string;
}) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
      {/* Error Icon */}
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
          <Search className="w-10 h-10 text-blue-600" />
        </div>
        <div className="absolute -top-2 -right-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
            <span className="text-sm font-bold text-white">404</span>
          </div>
        </div>
      </div>

      {/* Message */}
      <h2 className="text-2xl font-bold text-slate-900 mb-2">
        {resource.charAt(0).toUpperCase() + resource.slice(1)} Not Found
      </h2>
      <p className="text-slate-600 mb-6 max-w-md">
        The {resource} you're looking for doesn't exist or has been moved.
      </p>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <Link href={backLink}>
          <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white">
            <Home className="mr-2 w-4 h-4" />
            {backText}
          </Button>
        </Link>

        <Button
          variant="outline"
          onClick={() => window.history.back()}
          className="border-blue-200 text-blue-600 hover:bg-blue-50"
        >
          <ArrowLeft className="mr-2 w-4 h-4" />
          Go Back
        </Button>
      </div>
    </div>
  );
}
