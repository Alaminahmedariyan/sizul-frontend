import { apiClient } from "@/lib/api-client";

import type { ApiSuccessResponse } from "@/types/api";

export type Client = {
  id: string;
  userId: string | null;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  website: string | null;
  location: string | null;
  notes: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export const getMyClientProfile = () =>
  apiClient<ApiSuccessResponse<Client>>("/api/v1/clients/me");

export const updateMyClientProfile = (
  payload: Partial<Pick<Client, "company" | "phone" | "website" | "location">>,
) =>
  apiClient<ApiSuccessResponse<Client>>("/api/v1/clients/me", {
    method: "PATCH",
    body: payload,
  });

export const getClients = (params?: Record<string, string | number>) =>
  apiClient<ApiSuccessResponse<Client[]>>("/api/v1/clients", { query: params });

export const getClientById = (id: string) =>
  apiClient<ApiSuccessResponse<Client>>(`/api/v1/clients/${id}`);

export const createClient = (
  payload: Pick<Client, "name" | "email"> &
    Partial<Pick<Client, "phone" | "company">>,
) =>
  apiClient<ApiSuccessResponse<Client>>("/api/v1/clients", {
    method: "POST",
    body: payload,
  });

export const updateClient = (
  id: string,
  payload: Partial<Pick<Client, "notes" | "company" | "phone">>,
) =>
  apiClient<ApiSuccessResponse<Client>>(`/api/v1/clients/${id}`, {
    method: "PATCH",
    body: payload,
  });

export const updateClientActiveStatus = (id: string, isActive: boolean) =>
  apiClient<ApiSuccessResponse<Client>>(`/api/v1/clients/${id}/active`, {
    method: "PATCH",
    body: { isActive },
  });

export const deleteClient = (id: string) =>
  apiClient<ApiSuccessResponse<null>>(`/api/v1/clients/${id}`, {
    method: "DELETE",
  });
