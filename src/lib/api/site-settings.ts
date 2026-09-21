import { apiClient } from "@/lib/api-client";

import type { ApiSuccessResponse } from "@/types/api";

export type SiteSetting = {
  id: string;
  key: string;
  value: string | null;
  description: string | null;
  updatedAt: string;
};

export const getSiteSettings = () =>
  apiClient<ApiSuccessResponse<SiteSetting[]>>("/api/v1/site-settings");

export const getSiteSettingByKey = (key: string) =>
  apiClient<ApiSuccessResponse<SiteSetting>>(`/api/v1/site-settings/${key}`);

export const upsertSiteSetting = (payload: {
  key: string;
  value: string;
  description?: string;
}) =>
  apiClient<ApiSuccessResponse<SiteSetting>>("/api/v1/site-settings", {
    method: "PUT",
    body: payload,
  });

export const deleteSiteSetting = (key: string) =>
  apiClient<ApiSuccessResponse<null>>(`/api/v1/site-settings/${key}`, {
    method: "DELETE",
  });
