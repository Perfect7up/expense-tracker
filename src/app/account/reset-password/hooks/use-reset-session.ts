import { useEffect, useState } from "react";
import { createClient } from "@/app/core/lib/supabase/client";

export const useResetSession = () => {
  const [isValidSession, setIsValidSession] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const checkSession = async () => {
      setIsLoading(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();
      
      if (!session) {
        setIsValidSession(false);
      }
      setIsLoading(false);
    };
    
    checkSession();
  }, [supabase.auth]);

  return { isValidSession, isLoading };
};