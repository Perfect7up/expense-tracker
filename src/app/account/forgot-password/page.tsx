import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/core/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import {
  ForgotPasswordForm,
  SecurityInfo,
  HelpCard,
  ResponsiveNav,
} from "./components";
import { BackgroundEffects } from "@/app/core/components/shared/layout";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50/50 to-cyan-50/30">
      {/* Background Effects */}
      <BackgroundEffects />

      <div className="container relative mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24 py-6 sm:py-8 md:py-12">
        {/* Responsive Navigation */}
        <ResponsiveNav
          backHref="/account/signin"
          backText="Back to sign in"
          rightContent={
            <div className="text-xs sm:text-sm text-slate-600">
              Remember your password?{" "}
              <Link
                href="/account/signin"
                className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                Sign in
              </Link>
            </div>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center max-w-6xl mx-auto">
          {/* Left Side - Content */}
          <div className="space-y-6 sm:space-y-8">
            <div className="space-y-3 sm:space-y-4">
              {/* Back Link */}
              <Link
                href="/account/signin"
                className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 transition-colors group"
              >
                <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:-translate-x-0.5 transition-transform" />
                <span className="text-xs sm:text-sm font-medium">Back to sign in</span>
              </Link>

              {/* Heading */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
                Reset Your{" "}
                <span className="bg-linear-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
                  Password
                </span>
              </h1>

              {/* Description */}
              <p className="text-sm sm:text-base lg:text-lg text-slate-600 max-w-md leading-relaxed">
                Enter your email address and we'll send you a link to reset your
                password.
              </p>
            </div>

            {/* Security Info */}
            <SecurityInfo />

            {/* Help Card */}
            <HelpCard />
          </div>

          {/* Right Side - Form */}
          <div className="flex justify-center lg:justify-end">
            <Card className="w-full max-w-sm sm:max-w-md border border-slate-200/50 shadow-lg sm:shadow-xl bg-white/90 backdrop-blur-sm">
              <CardHeader className="space-y-1 sm:space-y-2 px-4 sm:px-6 pt-4 sm:pt-6">
                <CardTitle className="text-xl sm:text-2xl font-bold text-slate-900">
                  Reset Password
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm text-slate-500">
                  We'll email you a secure link to reset your password
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
                  <ForgotPasswordForm />
                </Suspense>

                {/* Back to Sign In Link */}
                <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-slate-200 text-center">
                  <Link
                    href="/account/signin"
                    className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    Return to sign in
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