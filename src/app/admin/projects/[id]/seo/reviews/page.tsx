"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { SeoTabs } from "@/components/admin/seo-tabs";
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  useCreateReviewMonitor,
  useDeleteReviewMonitor,
  useReviewMonitors,
} from "@/hooks/use-seo-review-monitors";

import type { ReviewPlatform } from "@/lib/api/seo-review-monitors";

const PLATFORM_OPTIONS: ReviewPlatform[] = [
  "GOOGLE",
  "FACEBOOK",
  "YELP",
  "TRUSTPILOT",
  "OTHER",
];

export default function SeoReviewMonitorPage() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading } = useReviewMonitors(id);
  const createSnapshot = useCreateReviewMonitor(id);
  const deleteSnapshot = useDeleteReviewMonitor(id);

  const [platform, setPlatform] = useState<ReviewPlatform>("GOOGLE");
  const [rating, setRating] = useState("");
  const [reviewCount, setReviewCount] = useState("");

  const snapshots = data?.data ?? [];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();

    createSnapshot.mutate(
      {
        platform,
        rating: rating ? Number(rating) : undefined,
        reviewCount: reviewCount ? Number(reviewCount) : undefined,
      },
      {
        onSuccess: () => {
          setRating("");
          setReviewCount("");
          toast.success("Snapshot recorded");
        },
        onError: (err) => toast.error(err.message),
      },
    );
  };

  return (
    <div>
      <PageHeader title="Review Monitor" />
      <SeoTabs projectId={id} />

      <form onSubmit={handleCreate} className="flex gap-2 mb-4">
        <Select
          value={platform}
          onValueChange={(v) => setPlatform(v as ReviewPlatform)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PLATFORM_OPTIONS.map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          placeholder="Rating (e.g. 4.5)"
          type="number"
          step="0.1"
          min={0}
          max={5}
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="w-36"
        />
        <Input
          placeholder="Review count"
          type="number"
          value={reviewCount}
          onChange={(e) => setReviewCount(e.target.value)}
          className="w-32"
        />
        <Button type="submit" disabled={createSnapshot.isPending}>
          Record
        </Button>
      </form>

      {isLoading && (
        <p className="text-muted-foreground">Loading snapshots...</p>
      )}
      {!isLoading && snapshots.length === 0 && (
        <EmptyState title="No review snapshots yet" />
      )}

      <div className="space-y-2">
        {snapshots.map((s) => (
          <Card key={s.id}>
            <CardContent className="pt-6 flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">
                  {s.platform} — {s.rating ?? "-"}★ ({s.reviewCount ?? 0}{" "}
                  reviews)
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(s.checkedAt).toLocaleDateString()}
                </p>
              </div>
              <ConfirmDeleteDialog
                trigger={
                  <Button variant="ghost" size="sm">
                    Delete
                  </Button>
                }
                onConfirm={() => deleteSnapshot.mutate(s.id)}
                isPending={deleteSnapshot.isPending}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
