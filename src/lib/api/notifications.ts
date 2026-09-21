import { apiClient } from "@/lib/api-client";

import type { ApiSuccessResponse } from "@/types/api";

export type NotificationType =
  | "LEAD_NEW"
  | "LEAD_ASSIGNED"
  | "LEAD_STATUS_CHANGED"
  | "PROPOSAL_SENT"
  | "PROPOSAL_ACCEPTED"
  | "PROPOSAL_REJECTED"
  | "PROJECT_UPDATE"
  | "TASK_ASSIGNED"
  | "TASK_DUE"
  | "CONSULTATION_SCHEDULED"
  | "MESSAGE_RECEIVED"
  | "REVIEW_RECEIVED"
  | "SEO_REPORT"
  | "SYSTEM";

export type NotificationEntityType =
  | "LEAD"
  | "PROPOSAL"
  | "PROJECT"
  | "TASK"
  | "CONSULTATION"
  | "MESSAGE"
  | "REVIEW"
  | "USER";

export type AppNotification = {
  id: string;
  userId: string;
  type: NotificationType;
  entityType: NotificationEntityType | null;
  entityId: string | null;
  title: string;
  message: string;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
};

export const getMyNotifications = (isRead?: boolean) =>
  apiClient<ApiSuccessResponse<AppNotification[]>>("/api/v1/notifications/me", {
    query: isRead !== undefined ? { isRead: String(isRead) } : undefined,
  });

export const markNotificationRead = (id: string) =>
  apiClient<ApiSuccessResponse<AppNotification>>(
    `/api/v1/notifications/${id}/read`,
    { method: "PATCH" },
  );

export const markAllNotificationsRead = () =>
  apiClient<ApiSuccessResponse<null>>("/api/v1/notifications/me/read-all", {
    method: "PATCH",
  });

export const deleteNotification = (id: string) =>
  apiClient<ApiSuccessResponse<null>>(`/api/v1/notifications/${id}`, {
    method: "DELETE",
  });

export const createManualNotification = (payload: {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
}) =>
  apiClient<ApiSuccessResponse<AppNotification>>("/api/v1/notifications", {
    method: "POST",
    body: payload,
  });
