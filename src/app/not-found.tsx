// app/not-found.tsx
"use client";

import Link from "next/link";
import { Button } from "@/app/core/components/ui/button";
import { Wifi, Home, Search, AlertCircle, ArrowLeft, Zap } from "lucide-react";
import { useState, useEffect } from "react";

export default function NotFound() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleGoBack = () => {
    if (mounted && window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = "/";
    }
  };

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
          <div className="text-sm text-slate-600 hidden md:block">
            Smart Finance Management
          </div>
        </header>

        <div className="flex flex-col items-center justify-center text-center py-12 md:py-24">
          {/* Error Code & Icon */}
          <div className="relative mb-8">
            <div className="absolute -inset-8 bg-gradient-to-r from-blue-500/10 to-cyan-400/10 rounded-full blur-2xl" />
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center mb-6 mx-auto">
                <AlertCircle className="w-16 h-16 text-blue-600" />
              </div>
              <div className="absolute -top-4 -right-4">
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-red-500 to-orange-400 rounded-full blur opacity-30" />
                  <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                    <span className="text-3xl font-bold text-white">404</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Message */}
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-4">
            Page Not Found
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mb-8">
            Oops! The page you're looking for seems to have wandered off into
            the digital void.
          </p>

          {/* Search Suggestion */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 shadow-sm max-w-lg w-full mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                <Search className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-left">
                <p className="font-medium text-slate-900">
                  Looking for something?
                </p>
                <p className="text-sm text-slate-500">
                  Try one of these popular pages instead
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Link href="/dashboard">
                <div className="p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all group">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500/10 to-cyan-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Zap className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-700">
                      Dashboard
                    </span>
                  </div>
                </div>
              </Link>
              <Link href="/signin">
                <div className="p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all group">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500/10 to-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Home className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-700">
                      Sign In
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/">
              <Button className="rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl transition-all duration-300 group px-8 h-12">
                <Home className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                Back to Home
              </Button>
            </Link>

            <Button
              variant="outline"
              onClick={handleGoBack}
              className="rounded-full border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 px-8 h-12 group"
            >
              <ArrowLeft className="mr-2 w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Go Back
            </Button>
          </div>

          {/* Contact Support */}
          <div className="mt-12 pt-8 border-t border-slate-200 max-w-lg">
            <p className="text-slate-600 mb-2">
              Can't find what you're looking for?
            </p>
            <Link
              href="/contact"
              className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1"
            >
              Contact Support
              <span className="group-hover:translate-x-1 transition-transform">
                →
              </span>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-slate-200 text-center text-sm text-slate-500">
          <p>© {new Date().getFullYear()} FinanciAI. All rights reserved.</p>
          <p className="mt-1">Error 404 • Page Not Found</p>
        </footer>
      </div>
    </div>
  );
}
