"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, User, CheckCircle } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { useSignupForm } from "../hooks/use-signup-form";
import { useSignup } from "../hooks/use-signup";
import { useGoogleAuth } from "../hooks/use-google-signup";
import { useAuthStore } from "../store/store";
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
import { Checkbox } from "@/app/core/components/ui/checkbox";

export default function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const form = useSignupForm();
  const signupMutation = useSignup();
  const { signInWithGoogle } = useGoogleAuth();
  const { isLoading, isGoogleLoading, error } = useAuthStore();

  const onSubmit = (data: any) => {
    signupMutation.mutate(data);
  };

  if (signupSuccess) {
    return (
      <div className="space-y-6 text-center py-4 sm:py-6 animate-in fade-in zoom-in duration-300">
        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-linear-to-br from-green-100 to-emerald-100 flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-sm">
          <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-slate-900">Check Your Email!</h3>
        <p className="text-sm sm:text-base text-slate-600 max-w-xs mx-auto">
          We've sent a confirmation link to your email address. Please click the
          link to verify your account and get started.
        </p>
        <div className="pt-4">
          <Button
            type="button"
            onClick={() => setSignupSuccess(false)}
            variant="outline"
            className="border-blue-200 text-blue-600 hover:bg-blue-50 text-sm sm:text-base"
          >
            Back to Sign Up
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
          {/* Name Field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700 text-sm sm:text-base">Full Name</FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                    <Input
                      {...field}
                      placeholder="John Doe"
                      className="pl-9 sm:pl-10 h-10 sm:h-11 bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 text-sm sm:text-base"
                      disabled={isLoading || isGoogleLoading}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
                      disabled={isLoading || isGoogleLoading}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700 text-sm sm:text-base">Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                    <Input
                      {...field}
                      placeholder="••••••••"
                      type={showPassword ? "text" : "password"}
                      className="pl-9 sm:pl-10 pr-9 sm:pr-10 h-10 sm:h-11 bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 text-sm sm:text-base"
                      disabled={isLoading || isGoogleLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      disabled={isLoading || isGoogleLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                      ) : (
                        <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
                <p className="text-xs text-slate-500 mt-1">
                  Must be at least 8 characters long
                </p>
              </FormItem>
            )}
          />

          {/* Terms Checkbox */}
          <div className="flex items-start space-x-2 sm:space-x-3">
            <Checkbox id="terms" disabled={isLoading || isGoogleLoading} className="mt-0.5" />
            <label
              htmlFor="terms"
              className="text-xs sm:text-sm text-slate-700 leading-relaxed"
            >
              I agree to the{" "}
              <Link
                href="/terms"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Privacy Policy
              </Link>
            </label>
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
            disabled={isLoading || isGoogleLoading}
            className="w-full h-10 sm:h-11 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
          >
            {isLoading ? (
              <>
                <div className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>
      </Form>

      {/* Divider */}
      <div className="relative my-4 sm:my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-slate-500">Or continue with</span>
        </div>
      </div>

      {/* Google Button */}
      <Button
        type="button"
        variant="outline"
        onClick={() => signInWithGoogle("/dashboard")}
        disabled={isLoading || isGoogleLoading}
        className="w-full h-10 sm:h-11 bg-white border-slate-200 hover:bg-slate-50 text-slate-700 font-medium text-sm sm:text-base"
      >
        {isGoogleLoading ? (
          <div className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
        ) : (
          <FcGoogle className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
        )}
        Google
      </Button>
    </>
  );
}