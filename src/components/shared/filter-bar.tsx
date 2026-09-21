"use client";

import { Search } from "lucide-react";
import type { ReactNode } from "react";

import { Input } from "@/components/ui/input";

export function FilterBar({
  search,
  onSearchChange,
  searchPlaceholder = "Search...",
  children,
}: {
  search?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  /** Pass <Select> filters (status, priority, etc) as children — rendered next to search */
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-4">
      {onSearchChange && (
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={search ?? ""}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8"
          />
        </div>
      )}
      {children}
    </div>
  );
}
