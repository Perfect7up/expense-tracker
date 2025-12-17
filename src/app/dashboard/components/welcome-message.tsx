"use client";

import { useEffect, useState } from "react";
import { Sparkles, Coffee, Moon, Sun } from "lucide-react";

interface WelcomeMessageProps {
  userName: string | null | undefined;
  isLoading: boolean;
}

export function WelcomeMessage({ userName, isLoading }: WelcomeMessageProps) {
  const [timeOfDay, setTimeOfDay] = useState<"morning" | "afternoon" | "evening" | "night">("morning");
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      
      if (hour >= 5 && hour < 12) {
        setTimeOfDay("morning");
        setGreeting("Good morning");
      } else if (hour >= 12 && hour < 17) {
        setTimeOfDay("afternoon");
        setGreeting("Good afternoon");
      } else if (hour >= 17 && hour < 22) {
        setTimeOfDay("evening");
        setGreeting("Good evening");
      } else {
        setTimeOfDay("night");
        setGreeting("Hello night owl");
      }
    };

    updateGreeting();
    // Update greeting every minute
    const interval = setInterval(updateGreeting, 60000);
    return () => clearInterval(interval);
  }, []);

  const getIcon = () => {
    switch (timeOfDay) {
      case "morning":
        return <Sun className="w-5 h-5 text-amber-500" />;
      case "afternoon":
        return <Sparkles className="w-5 h-5 text-blue-500" />;
      case "evening":
        return <Moon className="w-5 h-5 text-indigo-500" />;
      case "night":
        return <Coffee className="w-5 h-5 text-purple-500" />;
      default:
        return <Sparkles className="w-5 h-5 text-blue-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-4 animate-pulse">
        <div className="w-12 h-12 rounded-xl bg-slate-200/50"></div>
        <div>
          <div className="h-7 bg-slate-200/50 rounded w-48 mb-2"></div>
          <div className="h-5 bg-slate-200/50 rounded w-64"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-4 mb-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl  flex items-center justify-center shadow-lg shadow-blue-500/20">
          {getIcon()}
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
            {greeting}{userName ? `, ${userName}!` : "!"}
          </h1>
          <p className="text-slate-600 mt-1">
            Welcome to your financial dashboard
          </p>
        </div>
      </div>
    </div>
  );
}