import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/get-current-user";
import {
  canAccessAdminArea,
  canAccessPortalArea,
  getDefaultRouteForRole,
} from "@/lib/permissions";

/**
 * Single "where should this logged-in user go?" gateway.
 * Sign-in/sign-up/OTP pages all push here instead of guessing a path
 * themselves — this is the one place that actually knows the role
 * (fetched server-side via getCurrentUser -> /api/v1/auth/session).
 *
 * Usage: /redirect            -> role's default dashboard
 *        /redirect?to=/admin/leads/123 -> that path, IF the role is allowed
 *                                          there, else falls back to default
 */
export default async function RedirectPage({
  searchParams,
}: {
  searchParams: Promise<{ to?: string }>;
}) {
  const { to } = await searchParams;
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  if (to) {
    if (to.startsWith("/admin") && canAccessAdminArea(user.role)) {
      redirect(to);
    }
    if (to.startsWith("/portal") && canAccessPortalArea(user.role)) {
      redirect(to);
    }
    // `to` was given but this role can't go there — fall through to default.
  }

  redirect(getDefaultRouteForRole(user.role));
}
