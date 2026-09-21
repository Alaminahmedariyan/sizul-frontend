import { apiClient } from "@/lib/api-client";

import type { ApiSuccessResponse } from "@/types/api";

export type Service = {
  id: string;
  slug: string;
  name: string;
  shortName: string | null;
  tagline: string | null;
  description: string | null;
  icon: string | null;
  coverImage: string | null;
  features: unknown;
  process: unknown;
  startingPrice: string | null;
  currency: string;
  isActive: boolean;
  isFeatured: boolean;
  order: number;
  seoTitle: string | null;
  seoDescription: string | null;
  createdAt: string;
  updatedAt: string;
};

// ---- Public ----
export const getServices = () =>
  apiClient<ApiSuccessResponse<Service[]>>("/api/v1/services");

export const getServiceBySlug = (slug: string) =>
  apiClient<ApiSuccessResponse<Service>>(`/api/v1/services/${slug}`);

// ---- Admin ----
export const getServicesForManage = () =>
  apiClient<ApiSuccessResponse<Service[]>>("/api/v1/services/manage");

export const getServiceByIdForManage = (id: string) =>
  apiClient<ApiSuccessResponse<Service>>(`/api/v1/services/manage/${id}`);

export const createService = (
  payload: Pick<Service, "slug" | "name"> &
    Partial<Omit<Service, "id" | "createdAt" | "updatedAt">>,
) =>
  apiClient<ApiSuccessResponse<Service>>("/api/v1/services", {
    method: "POST",
    body: payload,
  });

export const updateService = (
  id: string,
  payload: Partial<Omit<Service, "id" | "createdAt" | "updatedAt">>,
) =>
  apiClient<ApiSuccessResponse<Service>>(`/api/v1/services/${id}`, {
    method: "PATCH",
    body: payload,
  });

export const deleteService = (id: string) =>
  apiClient<ApiSuccessResponse<null>>(`/api/v1/services/${id}`, {
    method: "DELETE",
  });
