// app/signup/page.tsx
import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/core/components/ui/card";
import {
  Wifi,
  Sparkles,
  Zap,
  TrendingUp,
  Users,
  Target,
  ArrowLeft,
  ArrowLeftCircle,
  ArrowLeftCircleIcon,
} from "lucide-react";
import SignupForm from "./components/signup-form";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 to-cyan-50/30">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-100/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-100/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-purple-100/10 rounded-full blur-3xl" />
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
            Already have an account?{" "}
            <Link
              href="/auth/signin"
              className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              Sign in
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Hero Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 text-blue-600 px-4 py-1.5 rounded-full text-sm font-medium border border-blue-200/50">
                <Sparkles className="w-4 h-4" />
                <span>Join 50K+ Smart Spenders</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
                Start Your{" "}
                <span className="bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
                  Financial Journey
                </span>{" "}
                Today
              </h1>
              <p className="text-lg text-slate-600 max-w-md leading-relaxed">
                Create your account and unlock AI-powered insights to transform
                how you manage your finances.
              </p>
            </div>

            {/* Benefits Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center mb-3">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <p className="font-semibold text-slate-900">Save 30% More</p>
                <p className="text-sm text-slate-500 mt-1">
                  Average user savings
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center mb-3">
                  <Target className="w-5 h-5 text-blue-600" />
                </div>
                <p className="font-semibold text-slate-900">AI Goals</p>
                <p className="text-sm text-slate-500 mt-1">
                  Personalized targets
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center mb-3">
                  <Zap className="w-5 h-5 text-purple-600" />
                </div>
                <p className="font-semibold text-slate-900">Real-time</p>
                <p className="text-sm text-slate-500 mt-1">
                  Live expense tracking
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center mb-3">
                  <Users className="w-5 h-5 text-orange-600" />
                </div>
                <p className="font-semibold text-slate-900">Community</p>
                <p className="text-sm text-slate-500 mt-1">50K+ members</p>
              </div>
            </div>

            {/* Testimonials */}
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-500/5 to-cyan-500/5 rounded-2xl p-6 border border-blue-200/30">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-cyan-300" />
                  <div>
                    <p className="font-semibold text-slate-900">Alex Johnson</p>
                    <p className="text-sm text-slate-500">
                      Saved $2,400 in 3 months
                    </p>
                  </div>
                </div>
                <p className="text-slate-600">
                  "The AI insights helped me identify wasteful subscriptions I
                  didn't even remember having!"
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Signup Form */}
          <div className="flex justify-center lg:justify-end">
            <Card className="w-full max-w-md border border-slate-200/50 shadow-2xl bg-white/90 backdrop-blur-sm -mt-12">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-slate-900">
                  Create Your Account
                </CardTitle>
                <CardDescription className="text-slate-500">
                  Start your journey to smarter finances
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense
                  fallback={<div className="text-center py-8">Loading...</div>}
                >
                  <SignupForm />
                </Suspense>

                {/* Terms & Privacy */}
                <p className="mt-6 text-center text-sm text-slate-500">
                  By signing up, you agree to our{" "}
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

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-slate-500">
                      Already have an account?
                    </span>
                  </div>
                </div>

                {/* Sign In Link */}
                <div className="text-center">
                  <Link
                    href="/signin"
                    className="inline-flex items-center justify-center w-full py-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-slate-700 font-medium"
                  >
                    Sign In to Existing Account
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
