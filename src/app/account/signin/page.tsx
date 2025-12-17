import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/core/components/ui/card";
import Link from "next/link";
import { FeaturesList, ResponsiveNav, SigninForm, Testimonial } from "./components";

export default function SigninPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50/50 to-cyan-50/30">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-40 h-40 sm:w-72 sm:h-72 bg-cyan-100/20 rounded-full blur-xl sm:blur-3xl" />
        <div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-40 h-40 sm:w-72 sm:h-72 bg-blue-100/20 rounded-full blur-xl sm:blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24 py-6 sm:py-8 md:py-12">
        <ResponsiveNav />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          <div className="space-y-6 sm:space-y-8">
            <div className="space-y-3 sm:space-y-4">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
                Welcome back to{" "}
                <span className="bg-linear-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
                  Smart Finance
                </span>
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-slate-600 max-w-md leading-relaxed">
                Sign in to access your AI-powered financial dashboard and
                continue your journey to smarter spending.
              </p>
            </div>
            <FeaturesList />
            <Testimonial />
          </div>
          <div className="flex justify-center lg:justify-end">
            <Card className="w-full max-w-sm sm:max-w-md border border-slate-200/50 shadow-lg sm:shadow-xl bg-white/90 backdrop-blur-sm">
              <CardHeader className="space-y-1 sm:space-y-2">
                <CardTitle className="text-xl sm:text-2xl font-bold text-slate-900">
                  Sign In to Your Account
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm text-slate-500">
                  Enter your credentials to access your dashboard
                </CardDescription>
              </CardHeader>
              <CardContent className="px-4 sm:px-6">
                <Suspense
                  fallback={
                    <div className="text-center py-6 sm:py-8 text-sm sm:text-base">
                      Loading...
                    </div>
                  }
                >
                  <SigninForm />
                </Suspense>

                <p className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-slate-500">
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