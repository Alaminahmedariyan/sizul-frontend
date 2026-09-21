import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { Sidebar } from "@/components/admin/sidebar";
import { Topbar } from "@/components/admin/topbar";

import { getCurrentUser } from "@/lib/get-current-user";
import { canAccessAdminArea } from "@/lib/permissions";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in?redirect=/admin/dashboard");
  }

  if (!canAccessAdminArea(user.role)) {
    redirect("/portal/dashboard");
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar role={user.role} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar email={user.email} role={user.role} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
