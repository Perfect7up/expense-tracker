"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { useSigninForm } from "../hooks/use-signin-form";
import { useSignin } from "../hooks/use-signin";
import { useGoogleSignin } from "../hooks/use-google-signin";
import { useSigninStore } from "../store/store";
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

export default function SigninForm() {
  const [showPassword, setShowPassword] = useState(false);
  const form = useSigninForm();
  const signinMutation = useSignin();
  const { signInWithGoogle } = useGoogleSignin();
  const { isLoading, isGoogleLoading, error } = useSigninStore();

  const onSubmit = (data: any) => {
    signinMutation.mutate(data);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700">Email Address</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                    <Input
                      {...field}
                      placeholder="you@example.com"
                      type="email"
                      className="pl-9 sm:pl-10 h-10 sm:h-11 bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
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
                <div className="flex items-center justify-between">
                  <FormLabel className="text-slate-700">Password</FormLabel>
                  <Link
                    href="/account/forgot-password"
                    className="text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                    <Input
                      {...field}
                      placeholder="••••••••"
                      type={showPassword ? "text" : "password"}
                      className="pl-9 sm:pl-10 pr-9 sm:pr-10 h-10 sm:h-11 bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
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
              </FormItem>
            )}
          />

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-700 text-sm">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading || isGoogleLoading}
            className="w-full h-10 sm:h-11 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
          >
            {isLoading ? (
              <>
                <div className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
      </Form>

      {/* Divider */}
      <div className="relative my-6">
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
        onClick={signInWithGoogle}
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