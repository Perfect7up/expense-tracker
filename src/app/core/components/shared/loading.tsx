"use client";
import { Wifi } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50/50 to-white p-6">
      {/* Animated background gradient circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-gradient-to-r from-cyan-400/10 to-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-blue-500/5 to-cyan-400/5 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-8">
        {/* Logo with enhanced animation */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative group">
            {/* Outer glow animation */}
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full opacity-20 blur-lg animate-ping-slow" />
            
            {/* Pulsing ring */}
            <div className="absolute -inset-3 border-2 border-blue-400/30 rounded-full animate-spin-slow">
              <div className="absolute top-1/2 left-full w-4 h-4 -translate-y-1/2">
                <div className="w-full h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full" />
              </div>
            </div>
            
            {/* Logo container */}
            <div className="relative">
              <div className="absolute -inset-3 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-xl blur opacity-30 animate-pulse" />
              <div className="relative w-20 h-20 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-2xl shadow-blue-500/30">
                <Wifi
                  className="h-8 w-8 text-white rotate-45 animate-bounce-slow"
                  strokeWidth={3}
                />
              </div>
            </div>
          </div>

          {/* Animated text */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="text-4xl font-bold tracking-tight text-slate-900">
                FINANCI
                <span className="bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
                  AI
                </span>
              </span>
            </div>
            <div className="h-1 w-24 bg-gradient-to-r from-blue-500/30 to-cyan-400/30 rounded-full overflow-hidden">
              <div className="h-full w-full bg-gradient-to-r from-blue-500 to-cyan-400 animate-loading-bar" />
            </div>
          </div>
        </div>

        {/* Loading message with dots animation */}
        <div className="flex flex-col items-center gap-6">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-semibold text-slate-800">
              Preparing your financial insights
            </h2>
            <p className="text-slate-600 max-w-md">
              Loading AI-powered expense tracker with personalized recommendations
            </p>
          </div>

          {/* Animated dots */}
          <div className="flex items-center justify-center gap-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 animate-bounce"
                style={{
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: "1s",
                }}
              />
            ))}
          </div>

          {/* Progress indicator */}
          <div className="w-64 h-2 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full w-0 bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 animate-loading-progress" />
          </div>

          {/* Feature badges */}
          <div className="flex flex-wrap gap-3 justify-center mt-4">
            {[
              { text: "AI Insights", color: "from-blue-500 to-blue-600" },
              { text: "Real-time Sync", color: "from-cyan-500 to-blue-500" },
              { text: "Secure Data", color: "from-blue-600 to-cyan-500" },
            ].map((feature, i) => (
              <div
                key={i}
                className="px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200/50 shadow-sm flex items-center gap-2 animate-fade-in"
                style={{ animationDelay: `${i * 0.2}s` }}
              >
                <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${feature.color} animate-pulse`} />
                <span className="text-sm font-medium text-slate-700">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom info */}
      <div className="absolute bottom-8 left-0 right-0 text-center">
        <p className="text-sm text-slate-500">
          Loading your personalized dashboard • Please wait...
        </p>
      </div>
    </div>
  );
}