import { apiClient } from "@/lib/api-client";

import type { ApiSuccessResponse } from "@/types/api";

export type ServiceArea = {
  id: string;
  projectId: string;
  city: string;
  state: string | null;
  slug: string;
  pageUrl: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateServiceAreaInput = {
  projectId: string;
  city: string;
  state?: string;
  slug: string;
};

export const getServiceAreas = (projectId: string) =>
  apiClient<ApiSuccessResponse<ServiceArea[]>>("/api/v1/seo/service-areas", {
    query: { projectId },
  });

export const getServiceAreaById = (id: string) =>
  apiClient<ApiSuccessResponse<ServiceArea>>(`/api/v1/seo/service-areas/${id}`);

export const createServiceArea = (payload: CreateServiceAreaInput) =>
  apiClient<ApiSuccessResponse<ServiceArea>>("/api/v1/seo/service-areas", {
    method: "POST",
    body: payload,
  });

export const updateServiceArea = (
  id: string,
  payload: Partial<Pick<ServiceArea, "pageUrl">>,
) =>
  apiClient<ApiSuccessResponse<ServiceArea>>(
    `/api/v1/seo/service-areas/${id}`,
    { method: "PATCH", body: payload },
  );

export const publishServiceArea = (
  id: string,
  publishedAt: string = new Date().toISOString(),
) =>
  apiClient<ApiSuccessResponse<ServiceArea>>(
    `/api/v1/seo/service-areas/${id}/publish`,
    {
      method: "PATCH",
      body: { publishedAt },
    },
  );

export const deleteServiceArea = (id: string) =>
  apiClient<ApiSuccessResponse<null>>(`/api/v1/seo/service-areas/${id}`, {
    method: "DELETE",
  });
