"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { NAV_LINKS } from "@/lib/site";
import { cn } from "@/lib/utils";

import { UserMenu } from "../shared/user-menu";
import { Logo } from "./logo";

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <div className="relative w-full max-w-4xl">
        <motion.div
          initial={{ y: -24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            "relative rounded-2xl border backdrop-blur-xl backdrop-saturate-150",
            "transition-[background-color,border-color,box-shadow] duration-500",
            scrolled
              ? "border-border bg-background/80 shadow-[var(--shadow-lg)]"
              : "border-border/60 bg-background/50 shadow-[var(--shadow-sm)]",
          )}
        >
          <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent dark:via-white/25" />

          <div className="flex items-center justify-between gap-3 py-2 pl-4 pr-2">
            <Logo />

            <nav
              aria-label="Main"
              className="hidden items-center gap-0.5 md:flex"
            >
              {NAV_LINKS.map((link) => {
                const active = isActive(link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative rounded-xl px-3.5 py-2 text-sm transition-colors duration-200",
                      active
                        ? "font-medium text-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-active-pill"
                        className="absolute inset-0 rounded-xl border border-border bg-secondary"
                        transition={{
                          type: "spring",
                          stiffness: 350,
                          damping: 28,
                        }}
                      />
                    )}
                    <span className="relative z-10">{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="hidden shrink-0 items-center gap-2 md:flex">
              <Button
                size="sm"
                className="rounded-xl px-4 shadow-[var(--shadow-primary)]"
                asChild
              >
                <Link href="/get-quote">Get a quote</Link>
              </Button>
              <UserMenu />
            </div>

            <button
              type="button"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((prev) => !prev)}
              className="flex size-9 items-center justify-center rounded-xl border border-border bg-secondary/60 transition-colors hover:bg-secondary md:hidden"
            >
              {mobileOpen ? (
                <X className="size-4" />
              ) : (
                <Menu className="size-4" />
              )}
            </button>
          </div>
        </motion.div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ y: -8, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -8, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-x-0 top-full mt-2 rounded-2xl border border-border bg-background/95 p-3 shadow-[var(--shadow-xl)] backdrop-blur-xl md:hidden"
            >
              <nav aria-label="Mobile" className="flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    aria-current={isActive(link.href) ? "page" : undefined}
                    className={cn(
                      "rounded-xl px-3 py-2.5 text-sm transition-colors",
                      isActive(link.href)
                        ? "bg-secondary font-medium text-foreground"
                        : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="flex flex-col gap-2 pt-3">
                <Button size="sm" className="w-full rounded-xl" asChild>
                  <Link href="/get-quote" onClick={() => setMobileOpen(false)}>
                    Get a quote
                  </Link>
                </Button>
                <UserMenu />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
