"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSettings } from "./hooks/use-settings";
import { cn } from "@/app/core/lib/utils";
import { toast } from "sonner";
import { createClient } from "@/app/core/lib/supabase/client";

// Icons
import {
  User as UserIcon,
  Shield,
  AlertTriangle,
  Settings as SettingsIcon,
  CheckCircle2,
  Lock,
  LogOut,
  Mail,
  Smartphone,
} from "lucide-react";

// Shared Components
import {
  BackgroundEffects,
  PageHeader,
  StatsGrid,
} from "@/app/core/components/shared/layout";
import { Button } from "@/app/core/components/ui/button";

// Sub-components
import SettingsSkeleton from "./components/settings-skeleton";
import SettingsError from "./components/settings-error";
import AvatarSection from "./components/avatar-section";
import PersonalInfoSection from "./components/personal-info-section";
import SecuritySection from "./components/security-section";
import DangerZoneSection from "./components/danger-zone-section";
import { LogoutModal } from "../components/logout-modal";

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  
  // State for Logout
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const supabase = createClient();
  
  const { data: user, isLoading, error, refetch } = useSettings();

  // Navigation Tabs configuration
  const tabs = [
    {
      value: "profile",
      icon: <UserIcon className="h-4 w-4" />,
      label: "Profile",
      color: "from-blue-500 to-cyan-400",
      description: "Manage your personal information",
    },
    {
      value: "security",
      icon: <Shield className="h-4 w-4" />,
      label: "Security",
      color: "from-purple-500 to-pink-400",
      description: "Password and authentication",
    },
    {
      value: "danger",
      icon: <AlertTriangle className="h-4 w-4" />,
      label: "Danger Zone",
      color: "from-red-500 to-orange-400",
      description: "Delete account and data",
    },
  ];

  // Mock Stats for the Header Grid
  const stats = [
    {
      title: "Account Status",
      value: "Active",
      description: "Profile is visible",
      icon: "checkCircle" as const,
      iconBg: "bg-linear-to-br from-emerald-500 to-green-400",
      loading: isLoading,
    },
    {
      title: "Member Since",
      value: user ? new Date(user.createdAt || Date.now()).getFullYear().toString() : "...",
      description: "Registration year",
      icon: "calendar" as const,
      iconBg: "bg-linear-to-br from-blue-500 to-cyan-400",
      loading: isLoading,
    },
    {
      title: "Security Level",
      value: "High",
      description: "2FA is enabled",
      icon: "shield" as const,
      iconBg: "bg-linear-to-br from-purple-500 to-pink-400",
      loading: isLoading,
    },
    {
      title: "Plan",
      value: "Free",
      description: "Current subscription",
      icon: "creditCard" as const,
      iconBg: "bg-linear-to-br from-orange-500 to-amber-400",
      loading: isLoading,
    },
  ];

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await supabase.auth.signOut();
      router.refresh();
      router.push("/account/signin");
      toast.success("Signed out successfully");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Failed to sign out. Please try again.");
      setIsLoggingOut(false);
      setShowLogoutModal(false);
    }
  };

  if (isLoading) {
    return (
      <div className="relative min-h-screen px-2 sm:px-4 py-4 sm:py-8 overflow-hidden">
        <BackgroundEffects />
        <div className="container mx-auto relative z-10">
          <SettingsSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative min-h-screen px-2 sm:px-4 py-4 sm:py-8 overflow-hidden">
        <BackgroundEffects />
        <div className="container mx-auto relative z-10 flex items-center justify-center min-h-[50vh]">
          <SettingsError error={error} onRetry={() => refetch()} />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen px-2 sm:px-4 py-4 sm:py-8 overflow-hidden">
      <BackgroundEffects />
      
      {/* Background linear Overlay */}
      <div className="absolute inset-0 bg-linear-to-br from-slate-50/30 via-transparent to-blue-50/20" />

      <div className="container mx-auto relative z-10 px-0 sm:px-4 max-w-7xl">
        <PageHeader
          title="ACCOUNT SETTINGS"
          description="Manage your profile, security preferences, and account configurations."
          icon={<SettingsIcon className="w-4 h-4 sm:w-5 sm:h-5" />}
          tagline="Your Control Center"
        >
          <Button
            variant="outline"
            className="w-full sm:w-auto rounded-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 px-4 sm:px-6 h-10 sm:h-12 transition-all duration-300 group text-sm sm:text-base"
            onClick={() => setShowLogoutModal(true)}
          >
            <LogOut className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            Sign Out
          </Button>
        </PageHeader>

        {/* Stats Grid */}
        <div className="mb-4 sm:mb-6 md:mb-8 px-2 sm:px-0">
          <StatsGrid stats={stats} />
        </div>

        {/* Main Content Container */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl p-2 sm:p-4 md:p-6 border border-slate-200/50 shadow-lg mb-6 md:mb-8 mx-2 sm:mx-0">
          
          {/* Enhanced Tab Navigation */}
          <div className="flex flex-col gap-4 mb-4 sm:mb-6">
            
            {/* TABS - Single Line Grid on Mobile */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 px-0 sm:px-6 md:px-8 lg:px-12">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.value;
                // Only show first word on mobile
                const oneWordLabel = tab.label.split(" ")[0]; 
                
                return (
                  <button
                    key={tab.value}
                    onClick={() => setActiveTab(tab.value)}
                    className={cn(
                      "flex flex-col items-center justify-center gap-1.5 sm:gap-3 p-2 sm:p-4",
                      "rounded-xl transition-all duration-300 relative min-w-0",
                      isActive
                        ? `bg-linear-to-r ${tab.color} text-white shadow-lg`
                        : "text-slate-700 hover:bg-slate-100/50 hover:shadow-sm border border-slate-200/50"
                    )}
                  >
                    <div className={cn(
                      "p-1.5 sm:p-2.5 rounded-lg",
                      isActive
                        ? "bg-white/20"
                        : "bg-linear-to-br from-slate-50 to-slate-100"
                    )}>
                      {/* Control icon size */}
                      <div className="[&>svg]:w-4 [&>svg]:h-4 sm:[&>svg]:w-5 sm:[&>svg]:h-5">
                        {tab.icon}
                      </div>
                    </div>
                    {/* Label handling */}
                    <span className="font-medium text-[10px] sm:text-sm whitespace-nowrap w-full truncate text-center">
                      {oneWordLabel}
                    </span>
                    {/* Active Line */}
                    {isActive && (
                      <div className="absolute bottom-0 left-2 right-2 sm:left-4 sm:right-4 h-0.5 bg-white/50 rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Divider */}
            <div className="h-px bg-linear-to-r from-transparent via-slate-300 to-transparent" />

            {/* Tab Description */}
            <div className="px-1 sm:px-6 md:px-8 lg:px-12">
              <div className="text-center sm:text-left">
                <p className="text-xs sm:text-sm text-slate-500">
                  {tabs.find(t => t.value === activeTab)?.description || "Manage your account settings"}
                </p>
              </div>
            </div>
          </div>

          {/* Tab Content Areas */}
          <div className="min-h-[400px] space-y-4 sm:space-y-6">
            {/* Header for Tab Content */}
            <div className="hidden sm:flex flex-col md:flex-row md:items-center justify-between gap-4 px-1 sm:px-6 md:px-8 lg:px-12">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  {tabs.find(t => t.value === activeTab)?.label || "Settings"}
                </h2>
              </div>
            </div>

            {activeTab === "profile" && (
              <div className="space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 px-1 sm:px-6 md:px-8 lg:px-12">
                <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
                  {/* Left Column: Avatar */}
                  <div className="lg:col-span-1">
                    <div className="bg-linear-to-br from-blue-50 to-cyan-50/50 rounded-xl md:rounded-2xl p-3 sm:p-6 border border-blue-100/50 h-full">
                      <div className="flex items-center gap-3 mb-4 sm:mb-6">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg md:rounded-xl bg-linear-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                          <UserIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-sm sm:text-base">Profile Picture</h3>
                          <p className="text-xs sm:text-sm text-slate-500">Visible to other users</p>
                        </div>
                      </div>
                      <AvatarSection user={user} />
                    </div>
                  </div>

                  {/* Right Column: Personal Info */}
                  <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl md:rounded-2xl p-3 sm:p-6 border border-slate-200/60 shadow-xs h-full">
                       <div className="flex items-center gap-3 mb-4 sm:mb-6 border-b border-slate-100 pb-4">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg md:rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                          <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-sm sm:text-base">Personal Details</h3>
                          <p className="text-xs sm:text-sm text-slate-500">Update your basic information</p>
                        </div>
                      </div>
                      <PersonalInfoSection user={user} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 px-1 sm:px-6 md:px-8 lg:px-12">
                <div className="bg-linear-to-br from-purple-50 to-pink-50/30 rounded-xl md:rounded-2xl p-3 sm:p-6 border border-purple-100/50">
                  <div className="flex items-center gap-3 mb-4 sm:mb-6">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg md:rounded-xl bg-linear-to-br from-purple-500 to-pink-400 flex items-center justify-center">
                      <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900">Security Settings</h3>
                      <p className="text-xs sm:text-sm text-slate-500">Manage your password and authentication methods</p>
                    </div>
                  </div>
                  
                  <div className="grid gap-4 sm:gap-6 md:grid-cols-2 mb-6 sm:mb-8">
                     <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg md:rounded-xl bg-white/60 border border-purple-100">
                        <div className="p-1.5 sm:p-2 bg-green-100 text-green-600 rounded-lg">
                           <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5"/>
                        </div>
                        <div>
                           <p className="font-semibold text-slate-800 text-sm sm:text-base">Email Verified</p>
                           <p className="text-xs text-slate-500">Your account is safe</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg md:rounded-xl bg-white/60 border border-purple-100">
                        <div className="p-1.5 sm:p-2 bg-blue-100 text-blue-600 rounded-lg">
                           <Smartphone className="w-4 h-4 sm:w-5 sm:h-5"/>
                        </div>
                        <div>
                           <p className="font-semibold text-slate-800 text-sm sm:text-base">2FA Enabled</p>
                           <p className="text-xs text-slate-500">Extra layer of security</p>
                        </div>
                     </div>
                  </div>

                  <div className="bg-white rounded-lg md:rounded-xl p-3 sm:p-4 shadow-xs border border-purple-100/50">
                     <SecuritySection />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "danger" && (
              <div className="space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 px-1 sm:px-6 md:px-8 lg:px-12">
                 <div className="bg-linear-to-br from-red-50 to-orange-50/30 rounded-xl md:rounded-2xl p-3 sm:p-6 border border-red-100/50">
                    <div className="flex items-center gap-3 mb-4 sm:mb-6">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg md:rounded-xl bg-linear-to-br from-red-500 to-orange-400 flex items-center justify-center shadow-lg shadow-red-500/20">
                        <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-slate-900">Danger Zone</h3>
                        <p className="text-xs sm:text-sm text-slate-500">Irreversible actions for your account</p>
                      </div>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm rounded-lg md:rounded-xl p-1 border border-red-200/50">
                      <DangerZoneSection />
                    </div>
                 </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center text-slate-400 text-xs sm:text-sm pb-4 sm:pb-8 px-2 sm:px-0">
          <p>Expense Tracker Settings • Version 2.4.0</p>
        </div>
      </div>

      {/* Logout Modal Component */}
      <LogoutModal 
        open={showLogoutModal} 
        onOpenChange={setShowLogoutModal} 
        onConfirm={handleLogout}
        isLoading={isLoggingOut}
      />
    </div>
  );
}