"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const TABS = [
  { label: "Overview", segment: "" },
  { label: "Milestones", segment: "milestones" },
  { label: "Tasks", segment: "tasks" },
  { label: "Members", segment: "members" },
  { label: "Files", segment: "files" },
  { label: "SEO", segment: "seo/rankings" },
];

export function ProjectTabs({ projectId }: { projectId: string }) {
  const pathname = usePathname();

  return (
    <div className="flex gap-1 border-b mb-6">
      {TABS.map((tab) => {
        const href = `/admin/projects/${projectId}${tab.segment ? `/${tab.segment}` : ""}`;
        const isActive =
          tab.segment === ""
            ? pathname === `/admin/projects/${projectId}`
            : pathname.startsWith(
                `/admin/projects/${projectId}/${tab.segment.split("/")[0]}`,
              );

        return (
          <Link
            key={tab.label}
            href={href}
            className={cn(
              "px-3 py-2 text-sm border-b-2 -mb-px",
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
