"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/app/core/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/core/components/ui/card";
import { Input } from "@/app/core/components/ui/input";
import { Label } from "@/app/core/components/ui/label";
import { Lock, Shield, Key, Send, X, CheckCircle, AlertCircle } from "lucide-react";
import { updateUser } from "../lib/api";
import { cn } from "@/app/core/lib/utils";

export default function SecuritySection() {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  
  const updateMutation = useMutation({
    mutationFn: (data: { resetPassword: boolean }) => updateUser(data),
    onSuccess: () => {
      toast.success("Password reset link sent to your email!");
      setShowPasswordForm(false);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handlePasswordReset = () => {
    if (confirm("Send password reset link to your email?")) {
      updateMutation.mutate({ resetPassword: true });
    }
  };

  return (
    <Card className="border-slate-200/50 shadow-sm hover:shadow-md transition-shadow rounded-xl md:rounded-2xl">
      <CardHeader className="px-4 py-4 sm:p-6">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg md:text-xl">
          <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
          Security Settings
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Manage your account security and authentication
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6 px-4 pb-4 sm:p-6 pt-0">
        <div className="space-y-4">
          {/* Password Reset Card */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-linear-to-r from-blue-50 to-cyan-50 rounded-lg md:rounded-xl border border-blue-100/50 gap-4">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-linear-to-br from-blue-500 to-cyan-400 flex items-center justify-center shrink-0">
                <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-slate-900 text-sm sm:text-base">
                  Password Protection
                </p>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Update your password to keep your account secure
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <CheckCircle className="w-3 h-3 text-emerald-500" />
                    <span>Last updated: 30 days ago</span>
                  </div>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              className={cn(
                "rounded-full border-blue-200 hover:border-blue-300 hover:bg-blue-50",
                "w-full sm:w-auto",
                "text-xs sm:text-sm",
                "h-9 sm:h-10 px-3 sm:px-4",
                updateMutation.isPending && "opacity-70"
              )}
              onClick={handlePasswordReset}
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? (
                <div className="flex items-center gap-2">
                  <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-500" />
                  <span>Sending...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Reset Password</span>
                </div>
              )}
            </Button>
          </div>

          {/* Security Status Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="flex items-center gap-3 p-3 sm:p-4 bg-linear-to-br from-emerald-50 to-green-50/50 rounded-lg md:rounded-xl border border-emerald-100/50">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-linear-to-br from-emerald-400 to-green-500 flex items-center justify-center shrink-0">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 text-sm sm:text-base">
                  Account Status
                </p>
                <p className="text-xs text-emerald-600 mt-1">
                  <span className="inline-flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Secured & Active
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 sm:p-4 bg-linear-to-br from-purple-50 to-pink-50/30 rounded-lg md:rounded-xl border border-purple-100/50">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-linear-to-br from-purple-400 to-pink-500 flex items-center justify-center shrink-0">
                <Key className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 text-sm sm:text-base">
                  2FA Status
                </p>
                <p className="text-xs text-slate-600 mt-1">
                  <span className="inline-flex items-center gap-1 text-amber-600">
                    <AlertCircle className="w-3 h-3" />
                    Not enabled
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Manual Password Update Form (Optional) */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-900 text-sm sm:text-base">
                Manual Password Update
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Change password directly (not recommended)
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              className="rounded-full text-xs sm:text-sm h-8 sm:h-9 px-3"
            >
              {showPasswordForm ? (
                <div className="flex items-center gap-1">
                  <X className="w-3 h-3" />
                  <span>Hide Form</span>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <Key className="w-3 h-3" />
                  <span>Show Form</span>
                </div>
              )}
            </Button>
          </div>

          {showPasswordForm && (
            <div className="space-y-3 sm:space-y-4 p-3 sm:p-4 border border-slate-200 rounded-lg md:rounded-xl bg-slate-50/50">
              <div className="space-y-2">
                <Label htmlFor="currentPassword" className="text-xs sm:text-sm">
                  Current Password
                </Label>
                <Input 
                  id="currentPassword" 
                  type="password" 
                  className="text-sm sm:text-base h-9 sm:h-10"
                  placeholder="Enter current password"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-xs sm:text-sm">
                  New Password
                </Label>
                <Input 
                  id="newPassword" 
                  type="password" 
                  className="text-sm sm:text-base h-9 sm:h-10"
                  placeholder="Enter new password"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-xs sm:text-sm">
                  Confirm New Password
                </Label>
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  className="text-sm sm:text-base h-9 sm:h-10"
                  placeholder="Confirm new password"
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                <Button 
                  className={cn(
                    "rounded-full bg-linear-to-r from-blue-500 to-cyan-500",
                    "hover:from-blue-600 hover:to-cyan-600",
                    "text-xs sm:text-sm",
                    "h-9 sm:h-10 px-4",
                    "w-full sm:w-auto"
                  )}
                >
                  Update Password
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowPasswordForm(false)}
                  className={cn(
                    "rounded-full",
                    "text-xs sm:text-sm",
                    "h-9 sm:h-10 px-4",
                    "w-full sm:w-auto"
                  )}
                >
                  Cancel
                </Button>
              </div>
              
              <div className="pt-2">
                <p className="text-xs text-slate-500">
                  <span className="font-medium text-amber-600">Note:</span> For security reasons, we recommend using the password reset link sent to your email.
                </p>
              </div>
            </div>
          )}

          {/* Security Tips */}
          <div className="bg-linear-to-r from-slate-50 to-slate-100/50 rounded-lg md:rounded-xl p-3 sm:p-4 border border-slate-200/50">
            <h4 className="font-semibold text-slate-900 text-sm sm:text-base mb-2">
              Security Tips
            </h4>
            <ul className="space-y-1.5 text-xs sm:text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></span>
                <span>Use a strong, unique password for your account</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></span>
                <span>Enable two-factor authentication when available</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></span>
                <span>Never share your password with anyone</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></span>
                <span>Regularly update your password for better security</span>
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}