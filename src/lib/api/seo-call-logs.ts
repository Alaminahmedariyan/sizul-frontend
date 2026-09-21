import { apiClient } from "@/lib/api-client";

import type { ApiSuccessResponse } from "@/types/api";

export type CallStatus = "COMPLETED" | "MISSED" | "VOICEMAIL";

export type CallLog = {
  id: string;
  projectId: string;
  twilioCallSid: string | null;
  fromNumber: string;
  toNumber: string | null;
  duration: number | null;
  recordingUrl: string | null;
  status: CallStatus;
  receivedAt: string;
  createdAt: string;
};

export const getCallLogs = (projectId: string) =>
  apiClient<ApiSuccessResponse<CallLog[]>>("/api/v1/seo/call-logs", {
    query: { projectId },
  });

export const getCallLogById = (id: string) =>
  apiClient<ApiSuccessResponse<CallLog>>(`/api/v1/seo/call-logs/${id}`);

export const deleteCallLog = (id: string) =>
  apiClient<ApiSuccessResponse<null>>(`/api/v1/seo/call-logs/${id}`, {
    method: "DELETE",
  });
