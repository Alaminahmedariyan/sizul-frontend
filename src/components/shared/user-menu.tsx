"use client";

import {
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Moon,
  Sun,
  User as UserIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";

import { authClient } from "@/lib/auth-client";

export function UserMenu() {
  const { data: session, isPending } = authClient.useSession();
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isPending) {
    return <div className="size-8 animate-pulse rounded-full bg-white/10" />;
  }

  if (!session?.user) {
    return (
      <Link
        href="/sign-in"
        className="rounded-xl border border-white/20 bg-foreground/90 px-4 py-2 text-sm font-medium text-background shadow-lg backdrop-blur-md transition hover:bg-foreground"
      >
        Sign in
      </Link>
    );
  }

  const user = session.user;
  const initial =
    user.name?.charAt(0).toUpperCase() ??
    user.email?.charAt(0).toUpperCase() ??
    "U";

  // Role-aware dashboard route
  const role = (user as { role?: string }).role;
  const dashboardHref =
    role === "ADMIN" || role === "STAFF"
      ? "/admin/dashboard"
      : "/portal/dashboard";

  const profileHref =
    role === "ADMIN" || role === "STAFF" ? "/admin/profile" : "/portal/profile";

  const isDark = theme === "dark";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label="User menu"
        className="flex size-9 items-center justify-center overflow-hidden rounded-full border border-white/25 bg-white/15 backdrop-blur-md transition hover:bg-white/25 dark:border-white/10"
      >
        {user.image ? (
          <Image
            src={user.image}
            alt={user.name ?? "User"}
            width={36}
            height={36}
            className="size-full object-cover"
          />
        ) : (
          <span className="text-sm font-semibold">{initial}</span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-60 overflow-hidden rounded-2xl border border-white/25 bg-popover p-1.5 shadow-[0_20px_60px_rgba(0,0,0,0.15)] backdrop-blur-[24px] dark:border-white/10">
          {/* User info */}
          <div className="border-b border-white/15 px-3 py-2 dark:border-white/10">
            <p className="truncate text-sm font-medium">
              {user.name ?? "User"}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {user.email}
            </p>
          </div>

          {/* Main menu */}
          <div className="pt-1">
            <Link
              href={dashboardHref}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition hover:bg-white/10 hover:text-foreground"
            >
              <LayoutDashboard className="size-4" />
              Dashboard
            </Link>

            <Link
              href={profileHref}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition hover:bg-white/10 hover:text-foreground"
            >
              <UserIcon className="size-4" />
              Profile
            </Link>

            <Link
              href="/help"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition hover:bg-white/10 hover:text-foreground"
            >
              <HelpCircle className="size-4" />
              Help
            </Link>
          </div>

          {/* Theme toggle */}
          <div className="mt-1 border-t border-white/15 pt-1 dark:border-white/10">
            <button
              type="button"
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition hover:bg-white/10 hover:text-foreground"
            >
              {isDark ? (
                <Sun className="size-4" />
              ) : (
                <Moon className="size-4" />
              )}
              {isDark ? "Light mode" : "Dark mode"}
            </button>
          </div>

          {/* Sign out */}
          <div className="mt-1 border-t border-white/15 pt-1 dark:border-white/10">
            <button
              type="button"
              onClick={async () => {
                setOpen(false);
                await authClient.signOut({
                  fetchOptions: {
                    onSuccess: () => {
                      window.location.href = "/";
                    },
                  },
                });
              }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition hover:bg-white/10 hover:text-foreground"
            >
              <LogOut className="size-4" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
