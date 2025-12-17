import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/core/components/ui/card";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import {
  ResponsiveNav,
  BenefitsGrid,
  TestimonialCard,
  SignupForm,
} from "./components";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50/50 to-cyan-50/30">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-40 h-40 sm:w-72 sm:h-72 bg-cyan-100/20 rounded-full blur-xl sm:blur-3xl" />
        <div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-40 h-40 sm:w-72 sm:h-72 bg-blue-100/20 rounded-full blur-xl sm:blur-3xl" />
        <div className="absolute top-1/2 left-1/4 w-32 h-32 sm:w-48 sm:h-48 bg-purple-100/10 rounded-full blur-xl sm:blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24 py-6 sm:py-8 md:py-12">
        <ResponsiveNav />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center">
          <div className="space-y-6 sm:space-y-8">
            <div className="space-y-3 sm:space-y-4">
              <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-linear-to-r from-blue-500/10 to-cyan-500/10 text-blue-600 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium border border-blue-200/50">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Join 50K+ Smart Spenders</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
                Start Your{" "}
                <span className="bg-linear-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
                  Financial Journey
                </span>{" "}
                Today
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-slate-600 max-w-md leading-relaxed">
                Create your account and unlock AI-powered insights to transform
                how you manage your finances.
              </p>
            </div>
            <BenefitsGrid />
            <TestimonialCard />
          </div>
          <div className="flex justify-center lg:justify-end">
            <Card className="w-full max-w-sm sm:max-w-md border border-slate-200/50 shadow-lg sm:shadow-xl lg:shadow-2xl bg-white/90 backdrop-blur-sm -mt-8 sm:-mt-10 lg:-mt-12">
              <CardHeader className="space-y-1 sm:space-y-2 px-4 sm:px-6 pt-4 sm:pt-6">
                <CardTitle className="text-xl sm:text-2xl font-bold text-slate-900">
                  Create Your Account
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm text-slate-500">
                  Start your journey to smarter finances
                </CardDescription>
              </CardHeader>
              <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                <Suspense
                  fallback={
                    <div className="text-center py-6 sm:py-8 text-sm sm:text-base">
                      Loading...
                    </div>
                  }
                >
                  <SignupForm />
                </Suspense>
                <p className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-slate-500">
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

                <div className="relative my-4 sm:my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-slate-500">
                      Already have an account?
                    </span>
                  </div>
                </div>

                <div className="text-center">
                  <Link
                    href="/account/signin"
                    className="inline-flex items-center justify-center w-full py-2.5 sm:py-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-slate-700 font-medium text-sm sm:text-base"
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