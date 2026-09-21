"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const CONTENT_TABS = [
  { label: "Portfolio", href: "/admin/content/portfolio" },
  { label: "Case Studies", href: "/admin/content/case-studies" },
  { label: "Testimonials", href: "/admin/content/testimonials" },
  { label: "FAQs", href: "/admin/content/faqs" },
  { label: "Blog Posts", href: "/admin/content/blog/posts" },
  { label: "Blog Categories", href: "/admin/content/blog/categories" },
  { label: "Blog Tags", href: "/admin/content/blog/tags" },
];

export function ContentTabs() {
  const pathname = usePathname();

  return (
    <div className="flex gap-1 overflow-x-auto border-b mb-6 pb-px">
      {CONTENT_TABS.map((tab) => {
        const isActive = pathname.startsWith(tab.href);

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "px-3 py-2 text-sm whitespace-nowrap border-b-2 -mb-px",
              isActive
                ? "border-primary font-medium"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
