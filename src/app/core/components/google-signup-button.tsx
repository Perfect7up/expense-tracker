"use client";

import { createBrowserClient } from "@supabase/ssr";
import { FcGoogle } from "react-icons/fc";

export default function GoogleSignupButton() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  return (
    <button
      onClick={signInWithGoogle}
      className="w-full flex items-center justify-center gap-3 py-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition font-medium"
    >
      <FcGoogle className="text-xl" />
      Continue with Google
    </button>
  );
}
