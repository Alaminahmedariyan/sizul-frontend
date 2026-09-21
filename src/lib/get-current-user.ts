import { cache } from "react";
import type { ApiSuccessResponse } from "@/types/api";
import type { SessionUser } from "@/types/auth";
import { serverApiClient } from "./server-api-client";

/**
 * Server-only. Hits the backend's lightweight custom session route
 * (GET /api/v1/auth/session — requireAuth, returns id/email/role/emailVerified)
 * instead of Better Auth's full getSession, since layouts only need the role
 * to decide access.
 *
 * Wrapped in React's `cache()` so multiple layouts/pages in the same request
 * (e.g. root layout + (admin) layout + a page) only trigger ONE network call.
 *
 * Returns null if there's no valid session — callers decide what to do
 * (redirect, show public content, etc). Never throws for the "not logged
 * in" case.
 */
export const getCurrentUser = cache(async (): Promise<SessionUser | null> => {
  try {
    const res = await serverApiClient<ApiSuccessResponse<SessionUser>>(
      "/api/v1/auth/session",
    );
    return res.data;
  } catch {
    return null;
  }
});
