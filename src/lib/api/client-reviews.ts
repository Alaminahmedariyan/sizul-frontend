import { apiClient } from "@/lib/api-client";

import type { ApiSuccessResponse } from "@/types/api";

export type ClientReview = {
  id: string;
  clientId: string;
  projectId: string | null;
  rating: number;
  title: string | null;
  content: string;
  serviceQuality: number | null;
  communication: number | null;
  delivery: number | null;
  isApproved: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
};

export type SubmitReviewInput = {
  projectId?: string;
  rating: number;
  title?: string;
  content: string;
  serviceQuality?: number;
  communication?: number;
  delivery?: number;
};

// ---- Public ----
export const getApprovedReviews = () =>
  apiClient<ApiSuccessResponse<ClientReview[]>>("/api/v1/client-reviews");

// ---- Client Portal ----
export const submitMyReview = (payload: SubmitReviewInput) =>
  apiClient<ApiSuccessResponse<ClientReview>>("/api/v1/client-reviews/me", {
    method: "POST",
    body: payload,
  });

// ---- Admin/Staff ----
export const getReviewsForManage = () =>
  apiClient<ApiSuccessResponse<ClientReview[]>>(
    "/api/v1/client-reviews/manage",
  );

export const getReviewByIdForManage = (id: string) =>
  apiClient<ApiSuccessResponse<ClientReview>>(
    `/api/v1/client-reviews/manage/${id}`,
  );

export const updateReviewApproval = (id: string, isApproved: boolean) =>
  apiClient<ApiSuccessResponse<ClientReview>>(
    `/api/v1/client-reviews/${id}/approval`,
    {
      method: "PATCH",
      body: { isApproved },
    },
  );

export const updateReviewFeatured = (id: string, isFeatured: boolean) =>
  apiClient<ApiSuccessResponse<ClientReview>>(
    `/api/v1/client-reviews/${id}/featured`,
    {
      method: "PATCH",
      body: { isFeatured },
    },
  );

export const deleteReview = (id: string) =>
  apiClient<ApiSuccessResponse<null>>(`/api/v1/client-reviews/${id}`, {
    method: "DELETE",
  });
