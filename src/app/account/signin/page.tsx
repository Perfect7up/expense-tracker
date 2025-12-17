import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/core/components/ui/card";
import { Wifi, Sparkles, Shield, Zap, ArrowLeftCircleIcon } from "lucide-react";
import SigninForm from "./components/signin-form";
import Link from "next/link";

export default function SigninPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 to-cyan-50/30">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-100/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-100/20 rounded-full blur-3xl" />
      </div>

      <div className="container relative mx-auto px-6 py-12 md:px-12 lg:px-24">
        {/* Header/Nav */}
        <header className="flex items-center justify-between mb-12">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full blur opacity-30 group-hover:opacity-50 transition-opacity" />
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                <Wifi
                  className="h-5 w-5 text-white rotate-45"
                  strokeWidth={3}
                />
              </div>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              FINANCI
              <span className="bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
                AI
              </span>
            </span>
          </Link>
          <div className="text-sm text-slate-600">
            <Link
              href="/"
              className="text-sm font-medium p-25 text-blue-600 hover:text-blue-700"
            >
              <ArrowLeftCircleIcon className="inline w-5 mr-1" />
              Back to Home page
            </Link>
            New user?{" "}
            <Link
              href="/account/signup"
              className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              Create account
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Hero Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
                Welcome back to{" "}
                <span className="bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
                  Smart Finance
                </span>
              </h1>
              <p className="text-lg text-slate-600 max-w-md leading-relaxed">
                Sign in to access your AI-powered financial dashboard and
                continue your journey to smarter spending.
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">
                    AI-Powered Insights
                  </p>
                  <p className="text-sm text-slate-500">
                    Get personalized financial recommendations
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">
                    Bank-Level Security
                  </p>
                  <p className="text-sm text-slate-500">
                    Your data is encrypted and protected
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">
                    Real-time Analytics
                  </p>
                  <p className="text-sm text-slate-500">
                    Track your finances with live updates
                  </p>
                </div>
              </div>
            </div>

            {/* Testimonial */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 shadow-sm">
              <p className="text-slate-600 italic mb-4">
                "FinanciAI helped me save over $500 in my first month. The AI
                insights are game-changing!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-400 to-cyan-300" />
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Sarah Chen
                  </p>
                  <p className="text-xs text-slate-500">Premium User</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Signin Form */}
          <div className="flex justify-center lg:justify-end">
            <Card className="w-full max-w-md border border-slate-200/50 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-slate-900">
                  Sign In to Your Account
                </CardTitle>
                <CardDescription className="text-slate-500">
                  Enter your credentials to access your dashboard
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense
                  fallback={<div className="text-center py-8">Loading...</div>}
                >
                  <SigninForm />
                </Suspense>

                <p className="mt-6 text-center text-sm text-slate-500">
                  By signing in, you agree to our{" "}
                  <Link
                    href="/terms"
                    className="font-medium text-blue-600 hover:text-blue-700"
                  >
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="font-medium text-blue-600 hover:text-blue-700"
                  >
                    Privacy Policy
                  </Link>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
