import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/core/components/ui/card";
import {
  ResetPasswordForm,
  SecurityTip,
} from "./components";
import { BackgroundEffects } from "@/app/core/components/shared/layout";
import ResponsiveNav from "./components/responsive-nav";

export default function ResetPasswordPage() {
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
              <a
                href="/account/signin"
                className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                Sign in
              </a>
            </div>
          }
        />

        <div className="flex justify-center">
          <div className="w-full max-w-sm sm:max-w-md">
            <Card className="border border-slate-200/50 shadow-lg sm:shadow-xl bg-white/90 backdrop-blur-sm">
              <CardHeader className="space-y-1 sm:space-y-2 px-4 sm:px-6 pt-4 sm:pt-6">
                <CardTitle className="text-xl sm:text-2xl font-bold text-slate-900">
                  Reset Your Password
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm text-slate-500">
                  Enter a new password for your account
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
                  <ResetPasswordForm />
                </Suspense>

                {/* Security Tip */}
                <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-slate-200">
                  <SecurityTip />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}