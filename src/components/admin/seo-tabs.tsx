"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const SEO_TABS = [
  { label: "Rankings", segment: "rankings" },
  { label: "Backlinks", segment: "backlinks" },
  { label: "Citations", segment: "citations" },
  { label: "GBP", segment: "gbp" },
  { label: "Audits", segment: "audits" },
  { label: "Performance", segment: "performance" },
  { label: "Reviews", segment: "reviews" },
  { label: "Service Areas", segment: "service-areas" },
  { label: "Call Logs", segment: "call-logs" },
  { label: "Tracking", segment: "tracking" },
];

export function SeoTabs({ projectId }: { projectId: string }) {
  const pathname = usePathname();

  return (
    <div className="flex gap-1 overflow-x-auto border-b mb-6 pb-px">
      {SEO_TABS.map((tab) => {
        const href = `/admin/projects/${projectId}/seo/${tab.segment}`;
        const isActive = pathname === href;

        return (
          <Link
            key={tab.segment}
            href={href}
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
