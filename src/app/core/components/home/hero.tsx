"use client";
import { Button } from "../ui/button";
import PhoneVisual from "./phone-visual";
import {
  ArrowRight,
  CheckCircle,
  Play,
  Star,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

export default function Hero() {
  return (
    <section className="relative z-10 pt-12 pb-24 px-6 md:px-12 lg:px-24 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-100/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-100/20 rounded-full blur-3xl" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative">
        <div className="flex flex-col gap-8 max-w-xl">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-sm font-medium">
              <Star className="w-4 h-4" />
              <span>Trusted by 50K+ users</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
              SMART SPENDING
              <span className="block bg-linear-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
                STARTS HERE
              </span>
            </h1>
          </div>

          <p className="text-lg text-slate-600 max-w-lg leading-relaxed">
            Unlock intelligent expense management with AI-powered insights,
            real-time tracking, and personalized financial guidance.
          </p>

          <div className="grid grid-cols-2 gap-4">
            {[
              "AI-powered insights",
              "Real-time tracking",
              "Bank-level security",
              "Multi-device sync",
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm text-slate-700">{feature}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-4 mt-4">
            <Button
              size="lg"
              className="rounded-full bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 h-12 text-base shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 group"
            >
              Get Started Free
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full border-blue-400/50 text-blue-500 hover:bg-blue-50 px-8 h-12 text-base hover:border-blue-500 transition-all duration-300"
            >
              <Play className="mr-2 w-4 h-4" />
              Watch Demo
            </Button>
          </div>
          <div className="flex items-center gap-6 pt-4">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-linear-to-br from-blue-400 to-cyan-300 border-2 border-white"
                  />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-xs text-slate-500">4.9/5 from 2K+ reviews</p>
              </div>
            </div>
            <div className="h-8 w-px bg-slate-300" />
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-slate-400" />
              <span className="text-sm text-slate-600">50K+ active users</span>
            </div>
          </div>
        </div>
        <div className="relative flex justify-center lg:justify-end">
          {/* Floating Elements */}
          <div className="absolute -top-8 right-8 bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-2xl border border-slate-200/50 animate-float">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-linear-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">+$1,240</p>
                <p className="text-xs text-slate-500">Saved this month</p>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-6 left-8 bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-2xl border border-slate-200/50 animate-float-delayed">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  12 AI Tips
                </p>
                <p className="text-xs text-slate-500">Active</p>
              </div>
            </div>
          </div>

          <PhoneVisual />
        </div>
      </div>
    </section>
  );
}
