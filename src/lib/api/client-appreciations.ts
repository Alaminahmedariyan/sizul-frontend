import { apiClient } from "@/lib/api-client";

import type { ApiSuccessResponse } from "@/types/api";

export type AppreciationType =
  | "THANK_YOU_NOTE"
  | "GIFT"
  | "REFERRAL"
  | "BONUS"
  | "TESTIMONIAL"
  | "OTHER";

export type ClientAppreciation = {
  id: string;
  clientId: string;
  projectId: string | null;
  type: AppreciationType;
  amount: string | null;
  currency: string | null;
  title: string | null;
  description: string | null;
  receivedAt: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateAppreciationInput = {
  clientId: string;
  projectId?: string;
  type: AppreciationType;
  title?: string;
  description?: string;
  amount?: number;
  currency?: string;
};

export const getAppreciations = () =>
  apiClient<ApiSuccessResponse<ClientAppreciation[]>>(
    "/api/v1/client-appreciations",
  );

export const getAppreciationById = (id: string) =>
  apiClient<ApiSuccessResponse<ClientAppreciation>>(
    `/api/v1/client-appreciations/${id}`,
  );

export const createAppreciation = (payload: CreateAppreciationInput) =>
  apiClient<ApiSuccessResponse<ClientAppreciation>>(
    "/api/v1/client-appreciations",
    { method: "POST", body: payload },
  );

export const updateAppreciation = (
  id: string,
  payload: Partial<Pick<ClientAppreciation, "title" | "description">>,
) =>
  apiClient<ApiSuccessResponse<ClientAppreciation>>(
    `/api/v1/client-appreciations/${id}`,
    {
      method: "PATCH",
      body: payload,
    },
  );

export const deleteAppreciation = (id: string) =>
  apiClient<ApiSuccessResponse<null>>(`/api/v1/client-appreciations/${id}`, {
    method: "DELETE",
  });
