"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createClient } from "@/app/core/lib/supabase/client";
import {
  signupSchema,
  type SignupSchema,
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
import { Checkbox } from "@/app/core/components/ui/checkbox";
import { Eye, EyeOff, Loader2, Mail, Lock, CheckCircle } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";

export default function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false); // New state for Google
  const router = useRouter();
  const supabase = createClient();

  const form = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // --- Email/Password Mutation ---
  const mutation = useMutation({
    mutationFn: async (data: SignupSchema) => {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.name, // store in Supabase metadata
          },
        },
      });
  
      if (error) throw new Error(error.message);
  
      // Insert into Prisma via API
      // Note: If you are using Supabase triggers, this fetch might be redundant, 
      // but keeping it as per your provided logic.
      await fetch("/api/user/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          supabaseId: authData.user?.id,
          email: data.email,
          name: data.name,
        }),
      });
  
      return authData;
    },
    onSuccess: (data) => {
      // Check if session is null (implies email confirmation is on)
      if (data.session === null) {
        setSignupSuccess(true);
      } else {
        router.refresh();
        router.push("/dashboard"); 
      }
    },
    onError: (error: Error) => {
      console.error("Signup error:", error.message);
    },
  });
  
  const onSubmit = (data: SignupSchema) => {
    mutation.mutate(data);
  };

  // --- Google Sign In Logic ---
  const signInWithGoogle = async () => {
    setIsGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          // This route (from previous prompt) handles the Prisma creation for OAuth
          redirectTo: `${location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error("Google auth error:", error);
      setIsGoogleLoading(false);
    }
  };

  const isLoading = mutation.isPending || isGoogleLoading;

  // --- Success View ---
  if (signupSuccess) {
    return (
      <div className="space-y-6 text-center py-8 animate-in fade-in zoom-in duration-300">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center mx-auto mb-4 shadow-sm">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">Check Your Email!</h3>
        <p className="text-slate-600 max-w-xs mx-auto">
          We've sent a confirmation link to your email address. Please click the
          link to verify your account and get started.
        </p>
        <div className="pt-4">
          <Button
            type="button"
            onClick={() => setSignupSuccess(false)}
            variant="outline"
            className="border-blue-200 text-blue-600 hover:bg-blue-50"
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Name Field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700">Full Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="John Doe"
                    className="h-11 bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                    disabled={isLoading}
                  />
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
                <FormLabel className="text-slate-700">Password</FormLabel>
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
                <p className="text-xs text-slate-500 mt-1">
                  Must be at least 6 characters long
                </p>
              </FormItem>
            )}
          />

          {/* Terms Checkbox */}
          <div className="flex items-start space-x-3">
            <Checkbox id="terms" disabled={isLoading} />
            <label
              htmlFor="terms"
              className="text-sm text-slate-700 leading-relaxed"
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
                Creating Account...
              </>
            ) : (
              "Create Account"
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