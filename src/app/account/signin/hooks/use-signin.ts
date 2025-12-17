import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createClient } from "@/app/core/lib/supabase/client";
import { useSigninStore } from "../store/store";
import { SigninSchema } from "../schema/schema";

export const useSignin = () => {
  const router = useRouter();
  const supabase = createClient();
  const { setLoading, setError, reset } = useSigninStore();

  return useMutation({
    mutationFn: async (data: SigninSchema) => {
      setLoading(true);
      setError(null);
      
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) throw new Error(error.message);
      return authData;
    },
    onSuccess: () => {
      router.refresh();
      router.push("/dashboard");
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