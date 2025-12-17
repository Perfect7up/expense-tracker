"use client";

import { Button } from "@/app/core/components/ui/button";
import { createClient } from "@/app/core/lib/supabase/client";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogoutModal } from "@/app/dashboard/components/logout-modal";

interface LogoutButtonProps {
  collapsed?: boolean;
}

export function LogoutButton({ collapsed = false }: LogoutButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const supabase = createClient();

  const handleLogout = async () => {
    setIsLoading(true);

    try {
      // 1. Sign out (clears cookies)
      await supabase.auth.signOut();

      // 2. Refresh router to clear Client Cache
      router.refresh();

      // 3. Redirect to login
      router.push("/account/signin");
    } catch (error) {
      console.error("Logout failed", error);
      setIsLoading(false);
      setShowModal(false); // Close modal on error
    }
    // Note: We don't set isLoading(false) on success because we are navigating away
  };

  return (
    <>
      <Button
        onClick={() => setShowModal(true)}
        disabled={isLoading}
        variant="destructive"
        size={collapsed ? "icon" : "default"}
        className={`transition-all duration-300 ${
          collapsed
            ? "w-10 h-10 rounded-lg"
            : "w-full flex items-center gap-2 justify-center"
        }`}
        title="Logout"
      >
        <LogOut className="h-4 w-4" />
        {!collapsed && <span>Logout</span>}
      </Button>

      <LogoutModal 
        open={showModal} 
        onOpenChange={setShowModal} 
        onConfirm={handleLogout}
        isLoading={isLoading}
      />
    </>
  );
}