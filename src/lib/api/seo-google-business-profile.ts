import { apiClient } from "@/lib/api-client";

import type { ApiSuccessResponse } from "@/types/api";

export type GoogleBusinessProfile = {
  id: string;
  projectId: string;
  businessName: string;
  gbpUrl: string | null;
  category: string | null;
  address: string | null;
  phone: string | null;
  isVerified: boolean;
  lastOptimizedAt: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type UpsertGbpInput = {
  businessName: string;
  category?: string;
  address?: string;
  phone?: string;
};

/** Returns null if no GBP record exists yet for this project (404 from backend). */
export const getGbp = async (projectId: string) => {
  try {
    return await apiClient<ApiSuccessResponse<GoogleBusinessProfile>>(
      `/api/v1/seo/google-business-profiles/${projectId}`,
    );
  } catch {
    return null;
  }
};

export const upsertGbp = (projectId: string, payload: UpsertGbpInput) =>
  apiClient<ApiSuccessResponse<GoogleBusinessProfile>>(
    `/api/v1/seo/google-business-profiles/${projectId}`,
    {
      method: "PUT",
      body: payload,
    },
  );

export const updateGbpVerification = (projectId: string, isVerified: boolean) =>
  apiClient<ApiSuccessResponse<GoogleBusinessProfile>>(
    `/api/v1/seo/google-business-profiles/${projectId}/verification`,
    {
      method: "PATCH",
      body: { isVerified },
    },
  );

export const markGbpOptimized = (projectId: string) =>
  apiClient<ApiSuccessResponse<GoogleBusinessProfile>>(
    `/api/v1/seo/google-business-profiles/${projectId}/mark-optimized`,
    {
      method: "PATCH",
    },
  );

export const deleteGbp = (projectId: string) =>
  apiClient<ApiSuccessResponse<null>>(
    `/api/v1/seo/google-business-profiles/${projectId}`,
    { method: "DELETE" },
  );