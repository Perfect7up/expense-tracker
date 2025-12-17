"use client";
import { useQuery } from "@tanstack/react-query";

export type User = {
  id: string;
  name: string | null;
  email: string;
};

async function fetchCurrentUser(): Promise<User> {
  const res = await fetch("/api/user/me");

  if (!res.ok) {
    throw new Error("Failed to fetch user");
  }

  return res.json();
}

export function useCurrentUser() {
  return useQuery<User>({
    queryKey: ["currentUser"],
    queryFn: fetchCurrentUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
