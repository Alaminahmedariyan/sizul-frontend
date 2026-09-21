import { apiClient } from "@/lib/api-client";

import type { ApiSuccessResponse } from "@/types/api";

export type SeoAudit = {
  id: string;
  projectId: string;
  title: string | null;
  auditDate: string;
  score: number | null;
  issues: unknown;
  reportUrl: string | null;
  summary: string | null;
  createdAt: string;
};

export type CreateSeoAuditInput = {
  projectId: string;
  title?: string;
  score?: number;
  summary?: string;
};

export const getSeoAudits = (projectId: string) =>
  apiClient<ApiSuccessResponse<SeoAudit[]>>("/api/v1/seo/audits", {
    query: { projectId },
  });

export const getSeoAuditById = (id: string) =>
  apiClient<ApiSuccessResponse<SeoAudit>>(`/api/v1/seo/audits/${id}`);

export const createSeoAudit = (payload: CreateSeoAuditInput) =>
  apiClient<ApiSuccessResponse<SeoAudit>>("/api/v1/seo/audits", {
    method: "POST",
    body: payload,
  });

export const deleteSeoAudit = (id: string) =>
  apiClient<ApiSuccessResponse<null>>(`/api/v1/seo/audits/${id}`, {
    method: "DELETE",
  });
