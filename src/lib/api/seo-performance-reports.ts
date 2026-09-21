import { apiClient } from "@/lib/api-client";

import type { ApiSuccessResponse } from "@/types/api";
import type { RankingDevice } from "./seo-keyword-rankings";

export type PerformanceReport = {
  id: string;
  projectId: string;
  pageUrl: string;
  device: RankingDevice;
  performanceScore: number | null;
  seoScore: number | null;
  metrics: unknown;
  reportUrl: string | null;
  checkedAt: string;
  createdAt: string;
};

export type CreatePerformanceReportInput = {
  projectId: string;
  pageUrl: string;
  device?: RankingDevice;
  performanceScore?: number;
  seoScore?: number;
};

export const getPerformanceReports = (projectId: string) =>
  apiClient<ApiSuccessResponse<PerformanceReport[]>>(
    "/api/v1/seo/performance-reports",
    { query: { projectId } },
  );

export const getPerformanceReportById = (id: string) =>
  apiClient<ApiSuccessResponse<PerformanceReport>>(
    `/api/v1/seo/performance-reports/${id}`,
  );

export const createPerformanceReport = (
  payload: CreatePerformanceReportInput,
) =>
  apiClient<ApiSuccessResponse<PerformanceReport>>(
    "/api/v1/seo/performance-reports",
    { method: "POST", body: payload },
  );

export const deletePerformanceReport = (id: string) =>
  apiClient<ApiSuccessResponse<null>>(`/api/v1/seo/performance-reports/${id}`, {
    method: "DELETE",
  });
