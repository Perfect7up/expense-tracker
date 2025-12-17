"use client";

import { User } from "@supabase/supabase-js";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Settings,
  HelpCircle,
  CreditCard,
  PieChart,
  Menu,
  X,
  Wifi,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/app/core/components/ui/button";
import { Separator } from "@/app/core/components/ui/separator";
import { LogoutButton } from "@/app/dashboard/components/logout-button";

interface MobileSidebarProps {
  user: User;
}

type UserProfile = {
  email: string;
  name?: string | null;
  avatarUrl?: string | null;
};

const navigationItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Expenses", href: "/dashboard/expenses", icon: TrendingDown },
  { name: "Income", href: "/dashboard/income", icon: TrendingUp },
  { name: "Subscriptions", href: "/dashboard/subscription", icon: CreditCard },
  { name: "Investments", href: "/dashboard/investment", icon: PieChart },
  { name: "Reports", href: "/dashboard/reports", icon: BarChart3 },
];

const secondaryItems = [
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
  { name: "Help", href: "/dashboard/help", icon: HelpCircle },
];

export function MobileSidebar({ user }: MobileSidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await fetch("/api/user");
        if (res.ok) {
          const data = await res.json();
          setUserProfile(data);
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };
    fetchUserProfile();
  }, []);

  const displayName = userProfile?.name || user.email?.split("@")[0] || "User";
  const displayEmail = userProfile?.email || user.email || "";
  const firstLetter = displayName.charAt(0).toUpperCase();

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && !(event.target as Element).closest('.mobile-sidebar')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Close sidebar on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile Menu Button - Fixed at bottom */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50 p-2">
        <div className="flex justify-between items-center px-4">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Wifi className="w-4 h-4 text-white rotate-45" strokeWidth={3} />
            </div>
            <span className="font-bold text-gray-900 dark:text-white">
              FINANC<span className="text-blue-500">AI</span>
            </span>
          </Link>

          {/* Menu Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-full"
          >
            {isOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setIsOpen(false)} />
      )}

      {/* Mobile Sidebar Content */}
      <aside
        className={`mobile-sidebar md:hidden fixed bottom-16 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-40 transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="p-4 overflow-y-auto max-h-[70vh]">
          {/* User Profile Section */}
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <Link
              href="/dashboard/settings"
              className="flex items-center gap-3"
              onClick={() => setIsOpen(false)}
            >
              <div className="w-12 h-12 rounded-full bg-linear-to-r from-blue-500 to-purple-500 flex items-center justify-center shrink-0">
                <span className="text-white font-semibold text-lg">
                  {firstLetter}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 dark:text-white truncate">
                  {displayName}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {displayEmail}
                </p>
              </div>
            </Link>
          </div>

          {/* Main Navigation */}
          <div className="space-y-2 mb-6">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-3">
              Navigation
            </h3>
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-linear-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-600 dark:text-blue-400"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </div>

          <Separator className="my-4" />

          {/* Secondary Navigation */}
          <div className="space-y-2 mb-6">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-3">
              Account
            </h3>
            {secondaryItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* AI Assistant Card */}
          <div className="mb-6 p-4 bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-100 dark:border-blue-900/30">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              Need help with transactions?
            </p>
            <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
              Try our AI Assistant →
            </p>
          </div>

          {/* Logout Button */}
          <div className="px-4">
            <LogoutButton collapsed={false} />
          </div>
        </div>
      </aside>

      {/* Bottom Navigation Bar (Always Visible) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50">
        <div className="flex justify-around items-center px-2 py-3">
          {navigationItems.slice(0, 4).map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                  isActive
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.name}</span>
              </Link>
            );
          })}
          
          {/* More Button */}
          <button
            onClick={() => setIsOpen(true)}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
              isOpen
                ? "text-blue-600 dark:text-blue-400"
                : "text-gray-600 dark:text-gray-400"
            }`}
          >
            <div className="flex flex-col gap-0.5">
              <div className="w-1 h-1 rounded-full bg-current" />
              <div className="w-1 h-1 rounded-full bg-current" />
              <div className="w-1 h-1 rounded-full bg-current" />
            </div>
            <span className="text-xs font-medium">More</span>
          </button>
        </div>
      </div>
    </>
  );
}