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
    <Card className="border-red-200/50 bg-linear-to-r from-red-50/50 to-pink-50/50 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-600">
          <AlertTriangle className="w-5 h-5" />
          Danger Zone
        </CardTitle>
        <CardDescription className="text-red-600/70">
          Irreversible actions. Proceed with caution.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert variant="destructive" className="border-red-200 bg-white">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="space-y-3">
            <div>
              <p className="font-semibold text-red-900">Delete Account</p>
              <p className="text-sm text-red-700 mt-1">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
            </div>

            {!showConfirmation ? (
              <Button
                variant="destructive"
                className="rounded-full bg-linear-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 shadow-lg shadow-red-500/20 mt-2"
                onClick={() => setShowConfirmation(true)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account
              </Button>
            ) : (
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-red-900">
                    Type <span className="font-bold">DELETE</span> to confirm
                  </p>
                  <Input
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    placeholder="Type DELETE to confirm"
                    className="border-red-300 focus:ring-red-500"
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="destructive"
                    className="rounded-full bg-linear-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
                    onClick={handleDelete}
                    disabled={confirmText !== "DELETE" || deleteMutation.isPending}
                  >
                    {deleteMutation.isPending ? (
                      <>
                        <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Confirm Delete
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-full border-red-200 hover:bg-red-50"
                    onClick={() => {
                      setShowConfirmation(false);
                      setConfirmText("");
                    }}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}