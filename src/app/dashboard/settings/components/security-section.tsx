"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/app/core/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/core/components/ui/card";
import { Input } from "@/app/core/components/ui/input";
import { Label } from "@/app/core/components/ui/label";
import { Lock, Shield, Key } from "lucide-react";
import { updateUser } from "../lib/api";

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
    <Card className="border-slate-200/50 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-500" />
          Security
        </CardTitle>
        <CardDescription>
          Manage your account security settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-linear-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                <Lock className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">Password Protection</p>
                <p className="text-sm text-slate-600">
                  Update your password to keep your account secure
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              className="rounded-full border-blue-200 hover:border-blue-300 hover:bg-blue-50"
              onClick={handlePasswordReset}
              disabled={updateMutation.isPending}
            >
              <Key className="w-4 h-4 mr-2" />
              {updateMutation.isPending ? "Sending..." : "Reset Password"}
            </Button>
          </div>

          {showPasswordForm && (
            <div className="space-y-4 p-4 border border-slate-200 rounded-xl">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" />
              </div>
              <div className="flex gap-3">
                <Button className="rounded-full">Update Password</Button>
                <Button
                  variant="ghost"
                  onClick={() => setShowPasswordForm(false)}
                  className="rounded-full"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}