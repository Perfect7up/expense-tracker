import { useMutation } from "@tanstack/react-query";
import { createClient } from "@/app/core/lib/supabase/client";
import { useAuthStore } from "../../signup/store/store";
import { ForgotPasswordSchema } from "../schema/schema";

export const useForgotPassword = () => {
  const supabase = createClient();
  const { setLoading, setError, reset } = useAuthStore();

  return useMutation({
    mutationFn: async (data: ForgotPasswordSchema) => {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/account/reset-password`,
      });

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      reset();
    },
    onError: (error: Error) => {
      setError(error.message);
      setLoading(false);
    },
    onSettled: () => {
      setLoading(false);
    },
  });
};