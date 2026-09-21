"use client";

import { useSession as useBetterAuthSession } from "@/lib/auth-client";

/**
 * Thin wrapper around Better Auth's useSession — use this in Client
 * Components that need to reactively show/hide UI based on the logged-in
 * user (navbar avatar, "Sign out" button, etc).
 *
 * For route protection, DON'T rely on this hook — it flashes
 * loading/unauthenticated state on first paint. Use the server-side
 * `getCurrentUser()` in a layout instead (see lib/get-current-user.ts).
 */
export function useSession() {
  const { data, isPending, error, refetch } = useBetterAuthSession();

  return {
    user: data?.user ?? null,
    isAuthenticated: Boolean(data?.user),
    isPending,
    error,
    refetch,
  };
}
