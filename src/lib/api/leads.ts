import { apiClient } from "@/lib/api-client";

import type { ApiSuccessResponse } from "@/types/api";

export type LeadStatus =
  | "NEW"
  | "CONTACTED"
  | "QUALIFIED"
  | "PROPOSAL_SENT"
  | "NEGOTIATING"
  | "CONVERTED"
  | "LOST";
export type LeadPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type LeadSource =
  | "WEBSITE"
  | "REFERRAL"
  | "SOCIAL_MEDIA"
  | "EMAIL_CAMPAIGN"
  | "PHONE"
  | "WALK_IN"
  | "OTHER";

export type Lead = {
  id: string;
  serviceId: string | null;
  clientId: string | null;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  website: string | null;
  location: string | null;
  budget: string | null;
  timeline: string | null;
  message: string | null;
  status: LeadStatus;
  priority: LeadPriority;
  source: LeadSource;
  followUpAt: string | null;
  assignedStaffId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type LeadNote = {
  id: string;
  leadId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};
export type LeadActivity = {
  id: string;
  leadId: string;
  type: string;
  description: string;
  metadata: unknown;
  createdById: string | null;
  createdAt: string;
};

export type CreateLeadInput = {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
  source?: LeadSource;
};

// ---- Public ----
export const createLead = (payload: CreateLeadInput) =>
  apiClient<ApiSuccessResponse<Lead>>("/api/v1/leads", {
    method: "POST",
    body: payload,
  });

// ---- Admin/Staff ----
export const getLeads = (params?: Record<string, string | number>) =>
  apiClient<ApiSuccessResponse<Lead[]>>("/api/v1/leads", { query: params });

export const getLeadById = (id: string) =>
  apiClient<ApiSuccessResponse<Lead>>(`/api/v1/leads/${id}`);

export const updateLead = (
  id: string,
  payload: Partial<Pick<Lead, "priority" | "budget" | "timeline" | "location">>,
) =>
  apiClient<ApiSuccessResponse<Lead>>(`/api/v1/leads/${id}`, {
    method: "PATCH",
    body: payload,
  });

export const updateLeadStatus = (id: string, status: LeadStatus) =>
  apiClient<ApiSuccessResponse<Lead>>(`/api/v1/leads/${id}/status`, {
    method: "PATCH",
    body: { status },
  });

export const assignLeadToStaff = (id: string, staffId: string) =>
  apiClient<ApiSuccessResponse<Lead>>(`/api/v1/leads/${id}/assign`, {
    method: "PATCH",
    body: { staffId },
  });

export const convertLeadToClient = (id: string) =>
  apiClient<ApiSuccessResponse<{ clientId: string }>>(
    `/api/v1/leads/${id}/convert`,
    { method: "POST" },
  );

export const addLeadNote = (id: string, content: string) =>
  apiClient<ApiSuccessResponse<LeadNote>>(`/api/v1/leads/${id}/notes`, {
    method: "POST",
    body: { content },
  });

export const getLeadNotes = (id: string) =>
  apiClient<ApiSuccessResponse<LeadNote[]>>(`/api/v1/leads/${id}/notes`);

export const getLeadActivities = (id: string) =>
  apiClient<ApiSuccessResponse<LeadActivity[]>>(
    `/api/v1/leads/${id}/activities`,
  );

export const deleteLead = (id: string) =>
  apiClient<ApiSuccessResponse<null>>(`/api/v1/leads/${id}`, {
    method: "DELETE",
  });
