import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/get-current-user";
import {
  canAccessAdminArea,
  canAccessPortalArea,
  getDefaultRouteForRole,
} from "@/lib/permissions";

export const dynamic = "force-dynamic";

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
  }

  redirect(getDefaultRouteForRole(user.role));
}