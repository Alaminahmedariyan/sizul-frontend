import { apiClient } from "@/lib/api-client";

import type { ApiSuccessResponse } from "@/types/api";
import type { ContentStatus } from "./testimonials";

export type { ContentStatus } from "./testimonials";

export type PortfolioImage = {
  id: string;
  portfolioId: string;
  url: string;
  altText: string | null;
  caption: string | null;
  order: number;
  createdAt: string;
};

export type Portfolio = {
	id: string;
	title: string;
	slug: string;
	clientName: string | null;
	industry: string | null;
	location: string | null;
	websiteUrl: string | null;
	coverImage: string | null;
	description: string | null;
	technologies: unknown;
	duration: string | null;
	results: unknown;
	seoTitle: string | null;
	seoDescription: string | null;
	status: ContentStatus;
	isFeatured: boolean;
	publishedAt: string | null;
	images: PortfolioImage[];
	createdAt: string;
	updatedAt: string;
};

export type CreatePortfolioInput = {
	title: string;
	slug: string;
	clientName?: string;
	industry?: string;
	location?: string;
	websiteUrl?: string;
	duration?: string;
	description?: string;
	technologies?: string[];
	results?: string[];
	seoTitle?: string;
	seoDescription?: string;
	isFeatured?: boolean;
};

// ---- Public ----
export const getPortfolioItems = () =>
  apiClient<ApiSuccessResponse<Portfolio[]>>("/api/v1/portfolio");

export const getPortfolioBySlug = (slug: string) =>
  apiClient<ApiSuccessResponse<Portfolio>>(`/api/v1/portfolio/${slug}`);

// ---- Admin ----
export const getPortfolioForManage = () =>
  apiClient<ApiSuccessResponse<Portfolio[]>>("/api/v1/portfolio/manage");

export const getPortfolioByIdForManage = (id: string) =>
  apiClient<ApiSuccessResponse<Portfolio>>(`/api/v1/portfolio/manage/${id}`);

export const createPortfolio = (payload: CreatePortfolioInput) =>
  apiClient<ApiSuccessResponse<Portfolio>>("/api/v1/portfolio", {
    method: "POST",
    body: payload,
  });

export const updatePortfolio = (
  id: string,
  payload: Partial<
    Omit<Portfolio, "id" | "images" | "createdAt" | "updatedAt">
  >,
) =>
  apiClient<ApiSuccessResponse<Portfolio>>(`/api/v1/portfolio/${id}`, {
    method: "PATCH",
    body: payload,
  });

export const updatePortfolioStatus = (id: string, status: ContentStatus) =>
  apiClient<ApiSuccessResponse<Portfolio>>(`/api/v1/portfolio/${id}/status`, {
    method: "PATCH",
    body: { status },
  });

/**
 * Backend expects multipart/form-data (field name "file"), not a JSON body —
 * it uploads the image to Cloudinary itself and stores the resulting URL.
 */
export const addPortfolioImage = (
  id: string,
  file: File,
  altText?: string,
  order?: number,
) => {
  const formData = new FormData();
  formData.append("file", file);
  if (altText) formData.append("altText", altText);
  if (order !== undefined) formData.append("order", String(order));

  // NOTE: don't set Content-Type manually — the browser sets the correct
  // multipart boundary automatically when body is a FormData instance.
  return apiClient<ApiSuccessResponse<PortfolioImage>>(
    `/api/v1/portfolio/${id}/images`,
    {
      method: "POST",
      body: formData,
    },
  );
};

export const removePortfolioImage = (imageId: string) =>
  apiClient<ApiSuccessResponse<null>>(`/api/v1/portfolio/images/${imageId}`, {
    method: "DELETE",
  });

export const linkServiceToPortfolio = (id: string, serviceId: string) =>
  apiClient<ApiSuccessResponse<null>>(`/api/v1/portfolio/${id}/services`, {
    method: "POST",
    body: { serviceId },
  });

export const unlinkServiceFromPortfolio = (id: string, serviceId: string) =>
  apiClient<ApiSuccessResponse<null>>(
    `/api/v1/portfolio/${id}/services/${serviceId}`,
    { method: "DELETE" },
  );

export const deletePortfolio = (id: string) =>
  apiClient<ApiSuccessResponse<null>>(`/api/v1/portfolio/${id}`, {
    method: "DELETE",
  });
