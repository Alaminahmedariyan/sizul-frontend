import type { UserRole } from "@/types/auth";

/**
 * Central place for "who can see what" — top-level area access.
 * Page-level fine-grained rules (e.g. only ADMIN sees /admin/users, STAFF
 * doesn't) are checked separately inside those specific pages, not here.
 *
 * NOTE: /admin/* and /portal/* are REAL path segments, not route groups —
 * both areas had overlapping folder names (dashboard, proposals, payments,
 * reviews, projects), so bare route groups `(admin)`/`(client)` would have
 * collided on the same URL at build time. Keep the prefix.
 */
export const AREA_ROLES = {
  admin: ["ADMIN", "STAFF"] as UserRole[],
  portal: ["CLIENT"] as UserRole[],
} as const;

export const canAccessAdminArea = (
  role: UserRole | undefined | null,
): boolean => !!role && AREA_ROLES.admin.includes(role);

export const canAccessPortalArea = (
  role: UserRole | undefined | null,
): boolean => !!role && AREA_ROLES.portal.includes(role);

/** ADMIN-only pages inside /admin: /admin/users, /admin/staff, /admin/settings */
export const isAdminOnly = (role: UserRole | undefined | null): boolean =>
  role === "ADMIN";

/** Where to send a logged-in user right after sign-in, based on role. */
export const getDefaultRouteForRole = (role: UserRole): string => {
  switch (role) {
    case "ADMIN":
    case "STAFF":
      return "/admin/dashboard";
    case "CLIENT":
      return "/portal/dashboard";
    default:
      return "/";
  }
};
