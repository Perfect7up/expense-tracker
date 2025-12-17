"use client";

import { useState } from "react";
import { CheckCircle, Lock } from "lucide-react";
import Link from "next/link";
import { useResetPasswordForm } from "../hooks/use-reset-password-form";
import { useResetPassword } from "../hooks/use-reset-password";
import { useResetSession } from "../hooks/use-reset-session";
import { useAuthStore } from "../../signup/store/store";
import {
  Form,
  FormField,
} from "@/app/core/components/ui/form";
import { Button } from "@/app/core/components/ui/button";
import { Alert, AlertDescription } from "@/app/core/components/ui/alert";
import PasswordField from "./password-field";

export default function ResetPasswordForm() {
  const [isSuccess, setIsSuccess] = useState(false);
  const form = useResetPasswordForm();
  const resetPasswordMutation = useResetPassword();
  const { isValidSession, isLoading: sessionLoading } = useResetSession();
  const { isLoading, error } = useAuthStore();

  const onSubmit = (data: any) => {
    resetPasswordMutation.mutate(data, {
      onSuccess: () => {
        setIsSuccess(true);
        form.reset();
      },
    });
  };

  if (sessionLoading) {
    return (
      <div className="space-y-4 sm:space-y-6 text-center py-6 sm:py-8">
        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-linear-to-br from-blue-100 to-cyan-100 flex items-center justify-center mx-auto mb-3 sm:mb-4">
          <div className="w-6 h-6 sm:w-8 sm:h-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-slate-900">Loading...</h3>
        <p className="text-sm sm:text-base text-slate-600 max-w-xs mx-auto">
          Checking reset session...
        </p>
      </div>
    );
  }

  if (!isValidSession) {
    return (
      <div className="space-y-4 sm:space-y-6 text-center py-6 sm:py-8 animate-in fade-in zoom-in duration-300">
        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-linear-to-br from-amber-100 to-orange-100 flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-sm">
          <Lock className="w-6 h-6 sm:w-8 sm:h-8 text-amber-600" />
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-slate-900">Invalid Reset Link</h3>
        <p className="text-sm sm:text-base text-slate-600 max-w-xs mx-auto">
          This reset link is invalid or has expired. Please request a new password reset link.
        </p>
        <div className="pt-4">
          <Link href="/account/forgot-password">
            <Button className="bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white text-sm sm:text-base">
              Request New Reset Link
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="space-y-4 sm:space-y-6 text-center py-6 sm:py-8 animate-in fade-in zoom-in duration-300">
        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-linear-to-br from-green-100 to-emerald-100 flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-sm">
          <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-slate-900">
          Password Reset Successfully!
        </h3>
        <p className="text-sm sm:text-base text-slate-600 max-w-xs mx-auto">
          Your password has been updated. Redirecting you to sign in...
        </p>
        <div className="pt-4 space-y-2">
          <Link href="/account/signin">
            <Button
              variant="outline"
              className="border-blue-200 text-blue-600 hover:bg-blue-50 text-sm sm:text-base"
            >
              Go to Sign In Now
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
          {/* New Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <PasswordField
                field={field}
                label="New Password"
                disabled={isLoading}
                showStrength={true}
                onPasswordChange={() => {}}
              />
            )}
          />

          {/* Confirm Password Field */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <PasswordField
                field={field}
                label="Confirm Password"
                disabled={isLoading}
                showStrength={false}
              />
            )}
          />

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-700 text-xs sm:text-sm">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-10 sm:h-11 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
          >
            {isLoading ? (
              <>
                <div className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Resetting Password...
              </>
            ) : (
              "Reset Password"
            )}
          </Button>

          {/* Back to Sign In */}
          <div className="text-center">
            <Link
              href="/account/signin"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Return to sign in
            </Link>
          </div>
        </form>
      </Form>
    </>
  );
}