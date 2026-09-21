import { apiClient } from "@/lib/api-client";

import type { ApiSuccessResponse } from "@/types/api";

export type ContentStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type Testimonial = {
  id: string;
  clientName: string;
  clientRole: string | null;
  companyName: string | null;
  clientImage: string | null;
  content: string;
  rating: number;
  serviceName: string | null;
  status: ContentStatus;
  isFeatured: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateTestimonialInput = {
  clientName: string;
  clientRole?: string;
  companyName?: string;
  content: string;
  rating?: number;
  serviceName?: string;
  isFeatured?: boolean;
};

// ---- Public ----
export const getTestimonials = () =>
  apiClient<ApiSuccessResponse<Testimonial[]>>("/api/v1/testimonials");

// ---- Admin ----
export const getTestimonialsForManage = () =>
  apiClient<ApiSuccessResponse<Testimonial[]>>("/api/v1/testimonials/manage");

export const getTestimonialByIdForManage = (id: string) =>
  apiClient<ApiSuccessResponse<Testimonial>>(
    `/api/v1/testimonials/manage/${id}`,
  );

export const createTestimonial = (payload: CreateTestimonialInput) =>
  apiClient<ApiSuccessResponse<Testimonial>>("/api/v1/testimonials", {
    method: "POST",
    body: payload,
  });

export const updateTestimonial = (
  id: string,
  payload: Partial<Omit<Testimonial, "id" | "createdAt" | "updatedAt">>,
) =>
  apiClient<ApiSuccessResponse<Testimonial>>(`/api/v1/testimonials/${id}`, {
    method: "PATCH",
    body: payload,
  });

export const updateTestimonialStatus = (id: string, status: ContentStatus) =>
  apiClient<ApiSuccessResponse<Testimonial>>(
    `/api/v1/testimonials/${id}/status`,
    {
      method: "PATCH",
      body: { status },
    },
  );

export const deleteTestimonial = (id: string) =>
  apiClient<ApiSuccessResponse<null>>(`/api/v1/testimonials/${id}`, {
    method: "DELETE",
  });
