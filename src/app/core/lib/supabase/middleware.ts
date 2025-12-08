// src/core/lib/supabase/middleware.ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  // 1. Create an initial response
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Update request cookies so Server Components get the new session immediately
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );

          // Update the response object which will be returned (stores the new token)
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // 2. Get User
  // This refreshes the session if expired and triggers 'setAll' above
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 3. PROTECTED ROUTES LOGIC

  // A. Protected Routes (Dashboard) -> Redirect to Sign In if not logged in
  if (request.nextUrl.pathname.startsWith("/dashboard") && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/signin";
    // Optional: Add ?next=/dashboard to redirect back after login
    url.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // B. Auth Pages (Sign In/Up) -> Redirect to Dashboard if already logged in
  if (request.nextUrl.pathname.startsWith("/auth") && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    const redirectResponse = NextResponse.redirect(url);

    // CRITICAL FIX: Ensure session cookies are carried over to the redirect response
    // If Supabase refreshed the token in 'getUser', 'response' has the Set-Cookie header.
    // We must copy that to 'redirectResponse' or the user will be logged out on arrival.
    const newCookies = response.cookies.getAll();
    newCookies.forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
    });

    return redirectResponse;
  }

  // 4. Return the response (which might contain updated cookies)
  return response;
}
