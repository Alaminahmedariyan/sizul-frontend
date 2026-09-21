import { apiClient } from "@/lib/api-client";

import type { ApiSuccessResponse } from "@/types/api";
import type { ContentStatus } from "./testimonials";

export type { ContentStatus } from "./testimonials";

export type CaseStudy = {
	id: string;
	title: string;
	slug: string;
	clientName: string | null;
	industry: string | null;
	location: string | null;
	coverImage: string | null;
	problem: string | null;
	strategy: string | null;
	implementation: string | null;
	results: string | null;
	metrics: unknown;
	seoTitle: string | null;
	seoDescription: string | null;
	status: ContentStatus;
	isFeatured: boolean;
	publishedAt: string | null;
	createdAt: string;
	updatedAt: string;
};

export type CreateCaseStudyInput = {
  title: string;
  slug: string;
  clientName?: string;
  problem?: string;
  strategy?: string;
  results?: string;
  isFeatured?: boolean;
};

// ---- Public ----
export const getCaseStudies = () =>
  apiClient<ApiSuccessResponse<CaseStudy[]>>("/api/v1/case-studies");

export const getCaseStudyBySlug = (slug: string) =>
  apiClient<ApiSuccessResponse<CaseStudy>>(`/api/v1/case-studies/${slug}`);

// ---- Admin ----
export const getCaseStudiesForManage = () =>
  apiClient<ApiSuccessResponse<CaseStudy[]>>("/api/v1/case-studies/manage");

export const getCaseStudyByIdForManage = (id: string) =>
  apiClient<ApiSuccessResponse<CaseStudy>>(`/api/v1/case-studies/manage/${id}`);

export const createCaseStudy = (payload: CreateCaseStudyInput) =>
  apiClient<ApiSuccessResponse<CaseStudy>>("/api/v1/case-studies", {
    method: "POST",
    body: payload,
  });

export const updateCaseStudy = (
  id: string,
  payload: Partial<Omit<CaseStudy, "id" | "createdAt" | "updatedAt">>,
) =>
  apiClient<ApiSuccessResponse<CaseStudy>>(`/api/v1/case-studies/${id}`, {
    method: "PATCH",
    body: payload,
  });

export const updateCaseStudyStatus = (id: string, status: ContentStatus) =>
  apiClient<ApiSuccessResponse<CaseStudy>>(
    `/api/v1/case-studies/${id}/status`,
    {
      method: "PATCH",
      body: { status },
    },
  );

export const linkServiceToCaseStudy = (id: string, serviceId: string) =>
  apiClient<ApiSuccessResponse<null>>(`/api/v1/case-studies/${id}/services`, {
    method: "POST",
    body: { serviceId },
  });

export const unlinkServiceFromCaseStudy = (id: string, serviceId: string) =>
  apiClient<ApiSuccessResponse<null>>(
    `/api/v1/case-studies/${id}/services/${serviceId}`,
    { method: "DELETE" },
  );

export const deleteCaseStudy = (id: string) =>
  apiClient<ApiSuccessResponse<null>>(`/api/v1/case-studies/${id}`, {
    method: "DELETE",
  });
