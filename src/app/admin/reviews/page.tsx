"use client";

import { Star, Trash2 } from "lucide-react";
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorAlert } from "@/components/shared/error-alert";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

import {
  useDeleteReview,
  useReviewsForManage,
  useUpdateReviewApproval,
  useUpdateReviewFeatured,
} from "@/hooks/use-client-reviews";

export default function AdminReviewsPage() {
  const { data, isLoading, isError, error } = useReviewsForManage();
  const updateApproval = useUpdateReviewApproval();
  const updateFeatured = useUpdateReviewFeatured();
  const deleteReview = useDeleteReview();

  const reviews = data?.data ?? [];

  if (isError) return <ErrorAlert message={error?.message} />;

  return (
    <div>
      <PageHeader
        title="Client Reviews"
        description="Approve and feature client feedback for the public site"
      />

      {isLoading && <p className="text-muted-foreground">Loading reviews...</p>}
      {!isLoading && reviews.length === 0 && (
        <EmptyState icon={Star} title="No reviews submitted yet" />
      )}

      <div className="space-y-3">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-1 text-yellow-500 mb-1">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={`star-${i}`} className="size-4 fill-current" />
                    ))}
                  </div>
                  {review.title && (
                    <p className="font-medium text-sm">{review.title}</p>
                  )}
                  <p className="text-sm text-muted-foreground mt-1">
                    {review.content}
                  </p>

                  {(review.serviceQuality ||
                    review.communication ||
                    review.delivery) && (
                    <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                      {review.serviceQuality && (
                        <span>Quality: {review.serviceQuality}/5</span>
                      )}
                      {review.communication && (
                        <span>Communication: {review.communication}/5</span>
                      )}
                      {review.delivery && (
                        <span>Delivery: {review.delivery}/5</span>
                      )}
                    </div>
                  )}
                </div>

                <ConfirmDeleteDialog
                  trigger={
                    <Button variant="ghost" size="icon">
                      <Trash2 className="size-4" />
                    </Button>
                  }
                  onConfirm={() => deleteReview.mutate(review.id)}
                  isPending={deleteReview.isPending}
                />
              </div>

              <div className="flex items-center gap-6 mt-4 pt-4 border-t">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={review.isApproved}
                    onCheckedChange={(checked) =>
                      updateApproval.mutate({
                        id: review.id,
                        isApproved: !!checked,
                      })
                    }
                  />
                  <span className="text-sm">
                    Approved (visible on public site)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={review.isFeatured}
                    onCheckedChange={(checked) =>
                      updateFeatured.mutate({
                        id: review.id,
                        isFeatured: !!checked,
                      })
                    }
                  />
                  <span className="text-sm">Featured</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
