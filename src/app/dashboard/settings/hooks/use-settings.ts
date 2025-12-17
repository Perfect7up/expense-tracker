import { useQuery } from "@tanstack/react-query";
import { User } from "../types"; // Adjust path based on your folder structure

const fetchUser = async (): Promise<User> => {
  const res = await fetch("/api/user");
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to fetch user");
  }
  return res.json();
};

export const useSettings = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    retry: 1,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};