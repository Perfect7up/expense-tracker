// app/dashboard/components/sidebar.tsx
"use client";

import { User } from "@supabase/supabase-js";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  Home,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Settings,
  HelpCircle,
  CreditCard,
  Wallet,
  PieChart,
  Bell,
  FileText,
  ChevronLeft,
  ChevronRight,
  User as UserIcon,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/app/core/components/ui/button";
import { Separator } from "@/app/core/components/ui/separator";
import { LogoutButton } from "@/app/account/signin/components/logout-button";

interface SidebarProps {
  user: User;
}

// Type for user profile data
type UserProfile = {
  email: string;
  name?: string | null;
  avatarUrl?: string | null;
};

const navigationItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
    description: "Overview",
  },
  {
    name: "Expenses",
    href: "/dashboard/expenses",
    icon: TrendingDown,
    description: "Track spending",
  },
  {
    name: "Income",
    href: "/dashboard/income",
    icon: TrendingUp,
    description: "Manage earnings",
  },
  {
    name: "Transactions",
    href: "/dashboard/transactions",
    icon: CreditCard,
    description: "All transactions",
  },
  {
    name: "Budget",
    href: "/dashboard/budget",
    icon: PieChart,
    description: "Plan spending",
  },
  {
    name: "Reports",
    href: "/dashboard/reports",
    icon: BarChart3,
    description: "Analytics",
  },
  {
    name: "Bills",
    href: "/dashboard/bills",
    icon: FileText,
    description: "Upcoming bills",
  },
  {
    name: "Goals",
    href: "/dashboard/goals",
    icon: Wallet,
    description: "Financial goals",
  },
];

const secondaryItems = [
  {
    name: "Notifications",
    href: "/dashboard/notifications",
    icon: Bell,
    badge: 3,
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
  {
    name: "Help & Support",
    href: "/dashboard/help",
    icon: HelpCircle,
  },
];

export function DashboardSidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [imageError, setImageError] = useState(false);

  // Fetch user profile data including avatar
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

  // Get display name
  const displayName = userProfile?.name || user.email?.split("@")[0] || "User";
  const displayEmail = userProfile?.email || user.email || "";

  // Get first letter for fallback avatar
  const firstLetter = displayName.charAt(0).toUpperCase();

  return (
    <aside
      className={`${collapsed ? "w-20" : "w-64"} flex flex-col h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out sticky top-0`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-gray-900 dark:text-white">
                  FinTrack
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Personal Finance
                </p>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center mx-auto">
              <Wallet className="w-5 h-5 text-white" />
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        {!collapsed ? (
          <Link 
            href="/dashboard/settings"
            className="flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 p-2 rounded-lg transition-colors cursor-pointer"
          >
            <div className="relative w-10 h-10 rounded-full shrink-0 overflow-hidden">
              {userProfile?.avatarUrl && !imageError ? (
                <Image
                  src={userProfile.avatarUrl}
                  alt={displayName}
                  fill
                  className="object-cover"
                  unoptimized
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {firstLetter}
                  </span>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 dark:text-white truncate">
                {displayName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {displayEmail}
              </p>
            </div>
          </Link>
        ) : (
          <Link 
            href="/dashboard/settings"
            className="flex justify-center hover:opacity-80 transition-opacity cursor-pointer"
          >
            <div className="relative w-10 h-10 rounded-full overflow-hidden">
              {userProfile?.avatarUrl && !imageError ? (
                <Image
                  src={userProfile.avatarUrl}
                  alt={displayName}
                  fill
                  className="object-cover"
                  unoptimized
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {firstLetter}
                  </span>
                </div>
              )}
            </div>
          </Link>
        )}
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {!collapsed && (
                  <div className="flex-1">
                    <span className="font-medium">{item.name}</span>
                    {item.description && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {item.description}
                      </p>
                    )}
                  </div>
                )}
                {isActive && !collapsed && (
                  <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                )}
              </Link>
            );
          })}
        </div>

        <Separator className="my-4" />

        {/* Secondary Navigation */}
        <div className="space-y-1">
          {secondaryItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors relative ${
                  isActive
                    ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {!collapsed && (
                  <>
                    <span className="font-medium flex-1">{item.name}</span>
                    {item.badge && (
                      <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
                {item.badge && collapsed && (
                  <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-2 h-2"></span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom Section - Logout */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        {!collapsed ? (
          <div className="space-y-3">
            {/* AI Assistant Quick Action */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-3 rounded-lg">
              <p className="text-xs text-gray-600 dark:text-gray-300 mb-1">
                Need help with transactions?
              </p>
              <p className="text-xs font-medium text-blue-600 dark:text-blue-400">
                Try our AI Assistant →
              </p>
            </div>

            {/* Logout Button */}
            <LogoutButton />
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 flex items-center justify-center">
              <HelpCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <LogoutButton />
          </div>
        )}
      </div>
    </aside>
  );
}