import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/core/components/ui/card";
import { Wifi, Mail, Shield, ArrowLeft, CheckCircle } from "lucide-react";
import ForgotPasswordForm from "./components/forgot-password-form";
import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 to-cyan-50/30">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-100/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-100/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-purple-100/10 rounded-full blur-3xl" />
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
            Remember your password?{" "}
            <Link
              href="/signin"
              className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              Sign in
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Left Side - Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Link
                href="/signin"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-medium">Back to sign in</span>
              </Link>

              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
                Reset Your{" "}
                <span className="bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
                  Password
                </span>
              </h1>
              <p className="text-lg text-slate-600 max-w-md leading-relaxed">
                Enter your email address and we'll send you a link to reset your
                password.
              </p>
            </div>

            {/* Security Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">
                    Secure & Encrypted
                  </p>
                  <p className="text-sm text-slate-500">
                    Your information is protected with bank-level security
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">Instant Delivery</p>
                  <p className="text-sm text-slate-500">
                    Reset links are sent immediately to your inbox
                  </p>
                </div>
              </div>
            </div>

            {/* Help Text */}
            <div className="bg-gradient-to-r from-blue-500/5 to-cyan-500/5 rounded-2xl p-6 border border-blue-200/30">
              <h3 className="font-semibold text-slate-900 mb-2">Need help?</h3>
              <p className="text-slate-600 text-sm">
                If you don't receive an email within a few minutes, check your
                spam folder or contact our{" "}
                <Link
                  href="/support"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  support team
                </Link>
                .
              </p>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="flex justify-center lg:justify-end">
            <Card className="w-full max-w-md border border-slate-200/50 shadow-2xl bg-white/90 backdrop-blur-sm">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-slate-900">
                  Reset Password
                </CardTitle>
                <CardDescription className="text-slate-500">
                  We'll email you a secure link to reset your password
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense
                  fallback={<div className="text-center py-8">Loading...</div>}
                >
                  <ForgotPasswordForm />
                </Suspense>

                {/* Back to Sign In */}
                <div className="mt-6 pt-6 border-t border-slate-200 text-center">
                  <Link
                    href="/signin"
                    className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <ArrowLeft className="w-4 h-4" />
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
