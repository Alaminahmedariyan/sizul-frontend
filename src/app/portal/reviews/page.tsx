"use client";

import { Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSubmitMyReview } from "@/hooks/use-client-reviews";
import { useClientProjects, useMyClientProfile } from "@/hooks/use-clients";

export default function PortalReviewsPage() {
  const { data: clientRes } = useMyClientProfile();
  const clientId = clientRes?.data?.id ?? "";

  const { data: projectsRes } = useClientProjects(clientId);

  const submitReview = useSubmitMyReview();

  const [projectId, setProjectId] = useState("");
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const projects = projectsRes?.data ?? [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      toast.error("Please enter your review.");
      return;
    }

    submitReview.mutate(
      {
        projectId: projectId || undefined,
        rating,
        title: title || undefined,
        content,
      },
      {
        onSuccess: () => {
          setSubmitted(true);
          toast.success("Thank you for your feedback!");
        },
        onError: (err) => {
          toast.error(err.message);
        },
      },
    );
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Star className="mb-4 size-12 fill-current text-yellow-500" />
        <h1 className="text-lg font-semibold">Thanks for your review!</h1>
        <p className="mt-1 text-muted-foreground">
          Your feedback helps us improve.
        </p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Leave a Review"
        description="Tell us about your experience working with us"
      />

      <Card>
        <CardHeader>
          <CardTitle>Your Feedback</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {projects.length > 0 && (
              <div className="space-y-1">
                <label
                  htmlFor="related-project"
                  className="text-sm font-medium"
                >
                  Related Project (optional)
                </label>

                <Select value={projectId} onValueChange={setProjectId}>
                  <SelectTrigger id="related-project">
                    <SelectValue placeholder="Select a project" />
                  </SelectTrigger>

                  <SelectContent>
                    {projects.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <fieldset className="space-y-1">
              <legend className="text-sm font-medium">Rating</legend>

              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    aria-label={`Rate ${star} out of 5`}
                    aria-pressed={rating === star}
                    onClick={() => setRating(star)}
                    className="rounded-sm p-1 transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <Star
                      className={
                        star <= rating
                          ? "size-6 fill-current text-yellow-500"
                          : "size-6 text-muted-foreground"
                      }
                    />
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="space-y-1">
              <label htmlFor="review-title" className="text-sm font-medium">
                Title (optional)
              </label>

              <Input
                id="review-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Great experience!"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="review-content" className="text-sm font-medium">
                Your Review
              </label>

              <Textarea
                id="review-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Tell us what you liked..."
                required
                rows={4}
              />
            </div>

            <Button type="submit" disabled={submitReview.isPending}>
              {submitReview.isPending ? "Submitting..." : "Submit Review"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
