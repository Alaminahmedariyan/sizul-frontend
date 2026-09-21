import { apiClient } from "@/lib/api-client";

import type { ApiSuccessResponse } from "@/types/api";

export type TrackingConfig = {
  id: string;
  projectId: string;
  ga4MeasurementId: string | null;
  gtmContainerId: string | null;
  metaPixelId: string | null;
  whatsappNumber: string | null;
  createdAt: string;
  updatedAt: string;
};

export type UpsertTrackingConfigInput = {
  ga4MeasurementId?: string;
  gtmContainerId?: string;
  metaPixelId?: string;
  whatsappNumber?: string;
};

export const getTrackingConfig = async (projectId: string) => {
  try {
    return await apiClient<ApiSuccessResponse<TrackingConfig>>(
      `/api/v1/seo/tracking-configs/${projectId}`,
    );
  } catch {
    return null;
  }
};

export const upsertTrackingConfig = (projectId: string, payload: UpsertTrackingConfigInput) =>
  apiClient<ApiSuccessResponse<TrackingConfig>>(
    `/api/v1/seo/tracking-configs/${projectId}`,
    {
      method: "PUT",
      body: payload,
    },
  );