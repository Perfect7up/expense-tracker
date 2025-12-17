import { createClient } from "@/app/core/lib/supabase/client";
import { useSigninStore } from "../store/store";


export const useGoogleSignin = () => {
  const supabase = createClient();
  const { setGoogleLoading, setError } = useSigninStore();

  const signInWithGoogle = async () => {
    setGoogleLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
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