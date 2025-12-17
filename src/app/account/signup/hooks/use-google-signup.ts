import { createClient } from "@/app/core/lib/supabase/client";
import { useAuthStore } from "../store/store";


export const useGoogleAuth = () => {
  const supabase = createClient();
  const { setGoogleLoading, setError } = useAuthStore();

  const signInWithGoogle = async (redirectPath: string = "/dashboard") => {
    setGoogleLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirect=${redirectPath}`,
        },
      });
      
      if (error) throw error;
    } catch (error) {
      setError(error instanceof Error ? error.message : "Google sign-in failed");
      setGoogleLoading(false);
    }
  };

  return { signInWithGoogle };
};