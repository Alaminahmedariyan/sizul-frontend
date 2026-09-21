import { apiClient } from "@/lib/api-client";

import type { ApiSuccessResponse } from "@/types/api";

export type ContactMessageStatus =
  | "UNREAD"
  | "READ"
  | "REPLIED"
  | "ARCHIVED"
  | "SPAM";

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  subject: string | null;
  message: string;
  status: ContactMessageStatus;
  repliedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateContactMessageInput = {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject?: string;
  message: string;
};

// ---- Public ----
export const sendContactMessage = (payload: CreateContactMessageInput) =>
  apiClient<ApiSuccessResponse<ContactMessage>>("/api/v1/contact-messages", {
    method: "POST",
    body: payload,
  });

// ---- Admin/Staff ----
export const getContactMessages = (params?: Record<string, string | number>) =>
  apiClient<ApiSuccessResponse<ContactMessage[]>>("/api/v1/contact-messages", {
    query: params,
  });

/** NOTE: backend auto-flips UNREAD -> READ on first fetch of this endpoint. */
export const getContactMessageById = (id: string) =>
  apiClient<ApiSuccessResponse<ContactMessage>>(
    `/api/v1/contact-messages/${id}`,
  );

export const updateContactMessageStatus = (
  id: string,
  status: ContactMessageStatus,
) =>
  apiClient<ApiSuccessResponse<ContactMessage>>(
    `/api/v1/contact-messages/${id}/status`,
    {
      method: "PATCH",
      body: { status },
    },
  );

export const deleteContactMessage = (id: string) =>
  apiClient<ApiSuccessResponse<null>>(`/api/v1/contact-messages/${id}`, {
    method: "DELETE",
  });
