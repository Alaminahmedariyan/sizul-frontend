"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types/auth";
import { ADMIN_NAV } from "./nav-config";

export function Sidebar({ role }: { role: UserRole }) {
  const pathname = usePathname();

  const visibleItems = ADMIN_NAV.filter(
    (item) => !item.roles || item.roles.includes(role),
  );

  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="flex items-center gap-2 px-6 h-16 border-b border-sidebar-border">
        <div className="size-8 rounded-lg bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-sm">S</span>
        </div>
        <span className="font-semibold text-sidebar-foreground tracking-tight">
          Sizul
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {visibleItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-2 border-t border-sidebar-border space-y-0.5">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to website
        </Link>
      </div>

      <div className="px-3 py-4 border-t border-sidebar-border">
        <p className="text-xs text-sidebar-foreground/50 px-3">
          v1.0.0 · Sizul Agency
        </p>
      </div>
    </aside>
  );
}
