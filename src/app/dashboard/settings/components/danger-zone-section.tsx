"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/app/core/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/core/components/ui/card";
import { Input } from "@/app/core/components/ui/input";
import { Alert, AlertDescription } from "@/app/core/components/ui/alert";
import { AlertTriangle, Trash2, Check, X } from "lucide-react";
import { deleteUser } from "../lib/api";
import { cn } from "@/app/core/lib/utils";

export default function DangerZoneSection() {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      toast.success("Account deleted successfully");
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    },
    onError: (error: Error) => {
      toast.error(error.message);
      setShowConfirmation(false);
      setConfirmText("");
    },
  });

  const handleDelete = () => {
    if (confirmText === "DELETE") {
      deleteMutation.mutate();
    }
  };

  return (
    <Card className={cn(
      "border-red-200/50 bg-linear-to-r from-red-50/50 to-pink-50/50",
      "shadow-sm hover:shadow-md transition-shadow",
      "rounded-xl md:rounded-2xl text-center"
    )}>
      <CardHeader className="px-4 py-6 sm:py-8">
        <CardTitle className="text-red-600 text-lg sm:text-xl md:text-2xl font-bold">
          ⚠️ Danger Zone
        </CardTitle>
        <CardDescription className="text-red-600/70 text-sm sm:text-base mx-auto max-w-2xl">
          Irreversible actions. Proceed with extreme caution.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 pb-6 sm:px-8 sm:pb-8">
        <Alert variant="destructive" className="border-red-200 bg-white rounded-xl md:rounded-2xl text-center">
          <AlertDescription className="space-y-4 sm:space-y-6">
            <div className="space-y-2">
              <p className="font-bold text-red-900 text-lg sm:text-xl">
                Delete Account
              </p>
              <p className="text-red-700 text-sm sm:text-base">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
            </div>

            {/* Warning Box */}
            <div className="bg-red-50/50 rounded-lg sm:rounded-xl p-4 border border-red-100">
              <p className="font-semibold text-red-900 text-sm sm:text-base mb-3">
                What will be permanently deleted:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
                <p className="text-red-700 text-xs sm:text-sm">• All personal information</p>
                <p className="text-red-700 text-xs sm:text-sm">• All financial records</p>
                <p className="text-red-700 text-xs sm:text-sm">• All reports & analytics</p>
                <p className="text-red-700 text-xs sm:text-sm">• All settings & preferences</p>
              </div>
            </div>

            {!showConfirmation ? (
              <div className="space-y-4 pt-2">
                <Button
                  variant="destructive"
                  className={cn(
                    "rounded-full bg-linear-to-r from-red-600 to-pink-600",
                    "hover:from-red-700 hover:to-pink-700",
                    "shadow-lg shadow-red-500/20 hover:shadow-xl hover:shadow-red-500/30",
                    "text-sm sm:text-base",
                    "h-11 sm:h-12 px-6 sm:px-8",
                    "w-full sm:w-auto mx-auto"
                  )}
                  onClick={() => setShowConfirmation(true)}
                >
                  <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Delete My Account
                </Button>
                <p className="text-red-600/70 text-xs sm:text-sm">
                  This will trigger immediate account deletion
                </p>
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-6 mt-2 text-center">
                <div className="bg-white border border-red-200 rounded-lg sm:rounded-xl p-4 sm:p-6">
                  <div className="space-y-3">
                    <p className="text-red-900 text-base sm:text-lg font-semibold">
                      Type <span className="font-bold text-red-700">DELETE</span> to confirm
                    </p>
                    <p className="text-red-600 text-sm">
                      This is required to prevent accidental deletion
                    </p>
                    <div className="max-w-xs sm:max-w-sm mx-auto">
                      <Input
                        value={confirmText}
                        onChange={(e) => setConfirmText(e.target.value)}
                        placeholder="Type DELETE to confirm"
                        className={cn(
                          "border-red-300 focus:ring-red-500 focus:border-red-500",
                          "text-base sm:text-lg text-center font-medium",
                          "h-12 sm:h-14",
                          "rounded-full",
                          confirmText === "DELETE" 
                            ? "border-red-500 bg-red-50/30 border-2" 
                            : ""
                        )}
                      />
                    </div>
                    {confirmText === "DELETE" ? (
                      <p className="text-emerald-600 text-sm font-medium">
                        ✓ Confirmation text matches
                      </p>
                    ) : confirmText.length > 0 ? (
                      <p className="text-red-600 text-sm">
                        ✗ Text doesn't match "DELETE"
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    variant="destructive"
                    className={cn(
                      "rounded-full bg-linear-to-r from-red-600 to-pink-600",
                      "hover:from-red-700 hover:to-pink-700",
                      "shadow-lg shadow-red-500/20",
                      "text-sm sm:text-base",
                      "h-11 sm:h-12 px-6",
                      "w-full sm:w-auto",
                      "disabled:opacity-50 disabled:cursor-not-allowed"
                    )}
                    onClick={handleDelete}
                    disabled={confirmText !== "DELETE" || deleteMutation.isPending}
                  >
                    {deleteMutation.isPending ? (
                      <div className="flex items-center justify-center gap-2">
                        <span className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white" />
                        <span>Deleting Account...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>Confirm & Delete</span>
                      </div>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    className={cn(
                      "rounded-full border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300",
                      "text-sm sm:text-base",
                      "h-11 sm:h-12 px-6",
                      "w-full sm:w-auto"
                    )}
                    onClick={() => {
                      setShowConfirmation(false);
                      setConfirmText("");
                    }}
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Cancel
                  </Button>
                </div>

                {/* Final Warning */}
                <div className="pt-2">
                  <p className="text-red-600 font-bold text-sm sm:text-base">
                    ⚠️ FINAL WARNING: This action is PERMANENT and CANNOT be undone!
                  </p>
                </div>
              </div>
            )}

            {/* Safety Note */}
            {!showConfirmation && (
              <div className="pt-4">
                <p className="text-slate-600 text-xs sm:text-sm">
                  <span className="font-medium">Safety Tip:</span> Consider exporting your data before deletion. 
                  Once deleted, your data cannot be recovered.
                </p>
              </div>
            )}
          </AlertDescription>
        </Alert>

        {/* Data Retention Notice */}
        <div className="mt-4 sm:mt-6 p-4 bg-amber-50/50 border border-amber-200 rounded-lg sm:rounded-xl text-center">
          <p className="font-medium text-amber-900 text-sm sm:text-base mb-2">
            Data Retention Policy
          </p>
          <p className="text-amber-700 text-xs sm:text-sm">
            Deleted account data is permanently removed from our servers within 30 days. 
            Backups may persist for up to 60 days.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}