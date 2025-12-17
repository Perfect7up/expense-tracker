"use client";

import { useState } from "react";
import { Mail, CheckCircle, ArrowLeft } from "lucide-react";
import { useForgotPasswordForm } from "../hooks/use-forgot-password-form";
import { useForgotPassword } from "../hooks/use-forgot-password";
import { useAuthStore } from "../../signup/store/store";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/core/components/ui/form";
import { Input } from "@/app/core/components/ui/input";
import { Button } from "@/app/core/components/ui/button";
import { Alert, AlertDescription } from "@/app/core/components/ui/alert";
import Link from "next/link";

export default function ForgotPasswordForm() {
  const [isSuccess, setIsSuccess] = useState(false);
  const form = useForgotPasswordForm();
  const forgotPasswordMutation = useForgotPassword();
  const { isLoading, error } = useAuthStore();

  const onSubmit = (data: any) => {
    forgotPasswordMutation.mutate(data, {
      onSuccess: () => {
        setIsSuccess(true);
        form.reset();
      },
    });
  };

  if (isSuccess) {
    return (
      <div className="space-y-4 sm:space-y-6 text-center py-6 sm:py-8 animate-in fade-in zoom-in duration-300">
        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-linear-to-br from-green-100 to-emerald-100 flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-sm">
          <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-slate-900">Check Your Email!</h3>
        <p className="text-sm sm:text-base text-slate-600 max-w-xs mx-auto">
          We've sent a password reset link to your email address. Please check
          your inbox and follow the instructions.
        </p>
        <div className="pt-4 space-y-2">
          <Button
            type="button"
            onClick={() => setIsSuccess(false)}
            variant="outline"
            className="border-blue-200 text-blue-600 hover:bg-blue-50 text-sm sm:text-base"
          >
            Send Another Link
          </Button>
          <Link
            href="/account/signin"
            className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium justify-center w-full"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700 text-sm sm:text-base">Email Address</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                    <Input
                      {...field}
                      placeholder="you@example.com"
                      type="email"
                      className="pl-9 sm:pl-10 h-10 sm:h-11 bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 text-sm sm:text-base"
                      disabled={isLoading}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Info Text */}
          <div className="bg-slate-50 rounded-lg p-3 sm:p-4 border border-slate-200">
            <p className="text-xs sm:text-sm text-slate-600">
              Enter the email address associated with your account, and we'll
              send you a link to reset your password.
            </p>
          </div>

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
                Sending Reset Link...
              </>
            ) : (
              "Send Reset Link"
            )}
          </Button>
        </form>
      </Form>
    </>
  );
}