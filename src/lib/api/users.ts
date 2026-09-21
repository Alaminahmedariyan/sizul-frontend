import { apiClient } from "@/lib/api-client";

import type { ApiSuccessResponse } from "@/types/api";
import type { UserRole, UserStatus } from "@/types/auth";

export type AppUser = {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export const getMyProfile = () =>
  apiClient<ApiSuccessResponse<AppUser>>("/api/v1/users/me");

export const updateMyProfile = (payload: Partial<Pick<AppUser, "name">>) =>
  apiClient<ApiSuccessResponse<AppUser>>("/api/v1/users/me", {
    method: "PATCH",
    body: payload,
  });

// ---- Admin only ----
export const getUsers = (params?: Record<string, string | number>) =>
  apiClient<ApiSuccessResponse<AppUser[]>>("/api/v1/users", { query: params });

export const getUserById = (id: string) =>
  apiClient<ApiSuccessResponse<AppUser>>(`/api/v1/users/${id}`);

export const updateUserRole = (id: string, role: UserRole) =>
  apiClient<ApiSuccessResponse<AppUser>>(`/api/v1/users/${id}/role`, {
    method: "PATCH",
    body: { role },
  });

export const updateUserStatus = (id: string, status: UserStatus) =>
  apiClient<ApiSuccessResponse<AppUser>>(`/api/v1/users/${id}/status`, {
    method: "PATCH",
    body: { status },
  });
