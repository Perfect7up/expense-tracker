import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createClient } from "@/app/core/lib/supabase/client";
import { useAuthStore } from "../store/store";
import { SignupSchema } from "../schema/schema";

export const useSignup = () => {
  const router = useRouter();
  const supabase = createClient();
  const { setLoading, setError, reset } = useAuthStore();

  return useMutation({
    mutationFn: async (data: SignupSchema) => {
      setLoading(true);
      setError(null);
      
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.name,
          },
        },
      });

      if (error) throw new Error(error.message);
      await fetch("/api/user/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          supabaseId: authData.user?.id,
          email: data.email,
          name: data.name,
        }),
      });

      return authData;
    },
    onSuccess: (data) => {
      if (data.session === null) {
        reset();
      } else {
        router.refresh();
        router.push("/dashboard");
      }
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