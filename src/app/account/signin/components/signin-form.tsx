"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createClient } from "@/app/core/lib/supabase/client";
import {
  signinSchema,
  type SigninSchema,
} from "@/app/core/lib/validations/auth";
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
import { Eye, EyeOff, Loader2, Mail, Lock } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc"; // Make sure to install react-icons

export default function SigninForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false); // Local state for Google loading
  const router = useRouter();
  const supabase = createClient();

  const form = useForm<SigninSchema>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // --- Email/Password Mutation ---
  const mutation = useMutation({
    mutationFn: async (data: SigninSchema) => {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) throw new Error(error.message);
      return authData;
    },
    onSuccess: () => {
      router.refresh();
      router.push("/dashboard");
    },
    onError: (error: Error) => {
      console.error("Sign in error:", error.message);
    },
  });

  const onSubmit = (data: SigninSchema) => {
    mutation.mutate(data);
  };

  // --- Google Sign In Logic ---
  const signInWithGoogle = async () => {
    setIsGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          // Based on your auth route, this will handle the callback
          redirectTo: `${location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
      // Note: Supabase will redirect the window, so we don't need manual routing here
    } catch (error) {
      console.error("Google auth error:", error);
      setIsGoogleLoading(false);
    }
  };

  const isLoading = mutation.isPending || isGoogleLoading;

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
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      {...field}
                      placeholder="you@example.com"
                      type="email"
                      className="pl-10 h-11 bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                      disabled={isLoading}
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
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      {...field}
                      placeholder="••••••••"
                      type={showPassword ? "text" : "password"}
                      className="pl-10 pr-10 h-11 bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Error Alert */}
          {mutation.isError && (
            <Alert variant="destructive" className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-700">
                {mutation.error.message}
              </AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl transition-all duration-300"
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
        disabled={isLoading}
        className="w-full h-11 bg-white border-slate-200 hover:bg-slate-50 text-slate-700 font-medium"
      >
        {isGoogleLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <FcGoogle className="mr-2 h-5 w-5" />
        )}
        Google
      </Button>
    </>
  );
}