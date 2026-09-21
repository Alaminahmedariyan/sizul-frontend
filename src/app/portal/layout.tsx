import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { PortalSidebar } from "@/components/portal/sidebar";
import { PortalTopbar } from "@/components/portal/topbar";

import { getCurrentUser } from "@/lib/get-current-user";
import { canAccessPortalArea } from "@/lib/permissions";

export default async function PortalLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in?redirect=/portal/dashboard");
  }

  if (!canAccessPortalArea(user.role)) {
    redirect("/admin/dashboard");
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <PortalSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <PortalTopbar email={user.email} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
