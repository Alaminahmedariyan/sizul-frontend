import { apiClient } from "@/lib/api-client";

import type { ApiSuccessResponse } from "@/types/api";

export type CitationStatus = "PENDING" | "SUBMITTED" | "LIVE" | "REJECTED";

export type Citation = {
  id: string;
  projectId: string;
  directoryName: string;
  url: string | null;
  status: CitationStatus;
  submittedAt: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateCitationInput = {
  projectId: string;
  directoryName: string;
  url?: string;
};

export const getCitations = (projectId: string) =>
  apiClient<ApiSuccessResponse<Citation[]>>("/api/v1/seo/citations", {
    query: { projectId },
  });

export const getCitationById = (id: string) =>
  apiClient<ApiSuccessResponse<Citation>>(`/api/v1/seo/citations/${id}`);

export const createCitation = (payload: CreateCitationInput) =>
  apiClient<ApiSuccessResponse<Citation>>("/api/v1/seo/citations", {
    method: "POST",
    body: payload,
  });

export const updateCitation = (
  id: string,
  payload: Partial<Pick<Citation, "notes" | "url">>,
) =>
  apiClient<ApiSuccessResponse<Citation>>(`/api/v1/seo/citations/${id}`, {
    method: "PATCH",
    body: payload,
  });

export const updateCitationStatus = (id: string, status: CitationStatus) =>
  apiClient<ApiSuccessResponse<Citation>>(
    `/api/v1/seo/citations/${id}/status`,
    {
      method: "PATCH",
      body: { status },
    },
  );

export const deleteCitation = (id: string) =>
  apiClient<ApiSuccessResponse<null>>(`/api/v1/seo/citations/${id}`, {
    method: "DELETE",
  });
