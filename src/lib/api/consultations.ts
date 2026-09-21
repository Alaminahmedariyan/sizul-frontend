import { apiClient } from "@/lib/api-client";

import type { ApiSuccessResponse } from "@/types/api";

export type ConsultationStatus =
  | "PENDING"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED"
  | "NO_SHOW";

export type Consultation = {
  id: string;
  leadId: string;
  serviceId: string | null;
  preferredDate: string | null;
  preferredTime: string | null;
  status: ConsultationStatus;
  notes: string | null;
  assignedStaffId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateConsultationInput = {
  leadId: string;
  serviceId?: string;
  preferredDate?: string;
  preferredTime?: string;
  notes?: string;
};

export const getConsultations = (params?: Record<string, string | number>) =>
  apiClient<ApiSuccessResponse<Consultation[]>>("/api/v1/consultations", {
    query: params,
  });

export const getConsultationById = (id: string) =>
  apiClient<ApiSuccessResponse<Consultation>>(`/api/v1/consultations/${id}`);

export const createConsultation = (payload: CreateConsultationInput) =>
  apiClient<ApiSuccessResponse<Consultation>>("/api/v1/consultations", {
    method: "POST",
    body: payload,
  });

export const updateConsultation = (
  id: string,
  payload: Partial<
    Pick<Consultation, "preferredDate" | "preferredTime" | "notes">
  >,
) =>
  apiClient<ApiSuccessResponse<Consultation>>(`/api/v1/consultations/${id}`, {
    method: "PATCH",
    body: payload,
  });

export const updateConsultationStatus = (
  id: string,
  status: ConsultationStatus,
) =>
  apiClient<ApiSuccessResponse<Consultation>>(
    `/api/v1/consultations/${id}/status`,
    {
      method: "PATCH",
      body: { status },
    },
  );

export const assignConsultationToStaff = (id: string, staffId: string) =>
  apiClient<ApiSuccessResponse<Consultation>>(
    `/api/v1/consultations/${id}/assign`,
    {
      method: "PATCH",
      body: { staffId },
    },
  );

export const deleteConsultation = (id: string) =>
  apiClient<ApiSuccessResponse<null>>(`/api/v1/consultations/${id}`, {
    method: "DELETE",
  });
