// src/core/lib/supabase/server.ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createServerSupabase() {
  // In Next.js 15+, cookies() is async. In 14, it's synchronous but await doesn't hurt.
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `try/catch` block is required for Server Components,
            // BUT it must actually work (not throw) when called from a Route Handler.
          }
        },
      },
    }
  );
}

// --- ADD THIS FUNCTION ---
export async function getAuthenticatedUser() {
  const supabase = await createServerSupabase();

  // getUser() is the secure way to fetch user on the server.
  // It verifies the JWT token with Supabase.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}
