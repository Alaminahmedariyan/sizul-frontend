import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { Meta } from "@/types/api";

export function Pagination({
  meta,
  page,
  onPageChange,
}: {
  meta: Meta | undefined;
  page: number;
  onPageChange: (page: number) => void;
}) {
  if (!meta) return null;

  return (
    <div className="flex items-center justify-between mt-4">
      <p className="text-sm text-muted-foreground">
        Page {meta.page} of {meta.totalPage} ({meta.total} total)
      </p>

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft className="size-4" />
          Previous
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={page >= meta.totalPage}
          onClick={() => onPageChange(page + 1)}
        >
          Next
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
