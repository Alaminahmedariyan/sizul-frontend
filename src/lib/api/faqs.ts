import { apiClient } from "@/lib/api-client";

import type { ApiSuccessResponse } from "@/types/api";

export type Faq = {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
};

export type CreateFaqInput = {
  question: string;
  answer: string;
  category?: string;
  order?: number;
};

// ---- Public ----
export const getFaqs = () =>
  apiClient<ApiSuccessResponse<Faq[]>>("/api/v1/faqs");

// ---- Admin ----
export const getFaqsForManage = () =>
  apiClient<ApiSuccessResponse<Faq[]>>("/api/v1/faqs/manage");

export const getFaqByIdForManage = (id: string) =>
  apiClient<ApiSuccessResponse<Faq>>(`/api/v1/faqs/manage/${id}`);

export const createFaq = (payload: CreateFaqInput) =>
  apiClient<ApiSuccessResponse<Faq>>("/api/v1/faqs", {
    method: "POST",
    body: payload,
  });

export const updateFaq = (
  id: string,
  payload: Partial<
    Pick<Faq, "question" | "answer" | "category" | "order" | "isActive">
  >,
) =>
  apiClient<ApiSuccessResponse<Faq>>(`/api/v1/faqs/${id}`, {
    method: "PATCH",
    body: payload,
  });

export const deleteFaq = (id: string) =>
  apiClient<ApiSuccessResponse<null>>(`/api/v1/faqs/${id}`, {
    method: "DELETE",
  });
