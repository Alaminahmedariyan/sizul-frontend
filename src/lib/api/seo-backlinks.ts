import { apiClient } from "@/lib/api-client";

import type { ApiSuccessResponse } from "@/types/api";

export type BacklinkStatus = "LIVE" | "LOST" | "PENDING" | "DISAVOWED";

export type Backlink = {
  id: string;
  projectId: string;
  sourceUrl: string;
  targetUrl: string;
  anchorText: string | null;
  status: BacklinkStatus;
  domainAuthority: number | null;
  pageAuthority: number | null;
  linkType: string | null;
  isDofollow: boolean;
  firstSeenAt: string | null;
  lastSeenAt: string | null;
  lostAt: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateBacklinkInput = {
  projectId: string;
  sourceUrl: string;
  targetUrl: string;
  anchorText?: string;
  status?: BacklinkStatus;
  domainAuthority?: number;
  pageAuthority?: number;
  linkType?: string;
  isDofollow?: boolean;
  notes?: string;
};

export const getBacklinks = (projectId: string) =>
  apiClient<ApiSuccessResponse<Backlink[]>>("/api/v1/seo/backlinks", {
    query: { projectId },
  });

export const getBacklinkById = (id: string) =>
  apiClient<ApiSuccessResponse<Backlink>>(`/api/v1/seo/backlinks/${id}`);

export const createBacklink = (payload: CreateBacklinkInput) =>
  apiClient<ApiSuccessResponse<Backlink>>("/api/v1/seo/backlinks", {
    method: "POST",
    body: payload,
  });

export const updateBacklinkStatus = (id: string, status: BacklinkStatus) =>
  apiClient<ApiSuccessResponse<Backlink>>(`/api/v1/seo/backlinks/${id}/status`, {
    method: "PATCH",
    body: { status },
  });

export const deleteBacklink = (id: string) =>
  apiClient<ApiSuccessResponse<null>>(`/api/v1/seo/backlinks/${id}`, {
    method: "DELETE",
  });