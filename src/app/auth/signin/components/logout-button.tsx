"use client";

import { Button } from "@/app/core/components/ui/button";
import { createClient } from "@/app/core/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const logout = async () => {
    setIsLoading(true);

    // 1. Sign out (clears cookies)
    await supabase.auth.signOut();

    // 2. CRITICAL: Refresh the router to clear Client Cache
    // If you miss this, the Dashboard stays visible until manual refresh
    router.refresh();

    // 3. Redirect to login
    router.push("/auth/signin");

    setIsLoading(false);
  };

  return (
    <Button onClick={logout} disabled={isLoading} variant="destructive">
      {isLoading ? "Logging out..." : "Logout"}
    </Button>
  );
}
