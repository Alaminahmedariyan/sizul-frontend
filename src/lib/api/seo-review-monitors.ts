import { apiClient } from "@/lib/api-client";

import type { ApiSuccessResponse } from "@/types/api";

export type ReviewPlatform =
  | "GOOGLE"
  | "FACEBOOK"
  | "YELP"
  | "TRUSTPILOT"
  | "OTHER";

export type ReviewMonitor = {
  id: string;
  projectId: string;
  platform: ReviewPlatform;
  rating: string | null;
  reviewCount: number | null;
  checkedAt: string;
  createdAt: string;
};

export type CreateReviewMonitorInput = {
  projectId: string;
  platform?: ReviewPlatform;
  rating?: number;
  reviewCount?: number;
};

export const getReviewMonitors = (projectId: string) =>
  apiClient<ApiSuccessResponse<ReviewMonitor[]>>(
    "/api/v1/seo/review-monitors",
    { query: { projectId } },
  );

export const getReviewMonitorById = (id: string) =>
  apiClient<ApiSuccessResponse<ReviewMonitor>>(
    `/api/v1/seo/review-monitors/${id}`,
  );

export const createReviewMonitor = (payload: CreateReviewMonitorInput) =>
  apiClient<ApiSuccessResponse<ReviewMonitor>>("/api/v1/seo/review-monitors", {
    method: "POST",
    body: payload,
  });

export const deleteReviewMonitor = (id: string) =>
  apiClient<ApiSuccessResponse<null>>(`/api/v1/seo/review-monitors/${id}`, {
    method: "DELETE",
  });
