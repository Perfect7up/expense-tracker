import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createClient } from "@/app/core/lib/supabase/client";
import { useAuthStore } from "../../signup/store/store";
import { ResetPasswordSchema } from "../schema/schema";

export const useResetPassword = () => {
  const router = useRouter();
  const supabase = createClient();
  const { setLoading, setError, reset } = useAuthStore();

  return useMutation({
    mutationFn: async (data: ResetPasswordSchema) => {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      reset();
      // Redirect after success
      setTimeout(() => {
        router.push("/account/signin");
      }, 3000);
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