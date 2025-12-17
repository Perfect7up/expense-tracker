import { redirect } from "next/navigation";
import { DashboardSidebar } from "./components/sidebar";
import { Providers } from "../core/providers/providers";
import { getAuthenticatedUser } from "@/app/core/lib/supabase/server";
import { AiChat } from "./components/bot/ai-chat";
import { MobileSidebar } from "./components/mobile-sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuthenticatedUser();

  if (!user) {
    return redirect("/account/signin");
  }

  return (
    <Providers>
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
        <DashboardSidebar user={user} />
        <MobileSidebar user={user} />
        <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
          <div className="p-4 md:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">{children}</div>
          </div>
        </main>
        <AiChat />
      </div>
    </Providers>
  );
}