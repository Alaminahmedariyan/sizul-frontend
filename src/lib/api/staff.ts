import { apiClient } from "@/lib/api-client";

import type { ApiSuccessResponse } from "@/types/api";

export type StaffRole =
  | "OWNER"
  | "MANAGER"
  | "DEVELOPER"
  | "DESIGNER"
  | "MARKETING"
  | "SALES"
  | "SUPPORT";
export type StaffStatus = "ACTIVE" | "INACTIVE" | "ON_LEAVE" | "TERMINATED";

export type Staff = {
  id: string;
  userId: string | null;
  employeeId: string | null;
  fullName: string;
  email: string;
  phone: string | null;
  role: StaffRole;
  status: StaffStatus;
  designation: string | null;
  department: string | null;
  bio: string | null;
  avatar: string | null;
  hireDate: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateStaffInput = {
  fullName: string;
  email: string;
  phone?: string;
  role: StaffRole;
  designation?: string;
  department?: string;
};

export const getStaffList = (params?: Record<string, string | number>) =>
  apiClient<ApiSuccessResponse<Staff[]>>("/api/v1/staff", { query: params });

export const getStaffById = (id: string) =>
  apiClient<ApiSuccessResponse<Staff>>(`/api/v1/staff/${id}`);

export const createStaff = (payload: CreateStaffInput) =>
  apiClient<ApiSuccessResponse<Staff>>("/api/v1/staff", {
    method: "POST",
    body: payload,
  });

export const updateStaff = (
  id: string,
  payload: Partial<Pick<Staff, "designation" | "department" | "bio">>,
) =>
  apiClient<ApiSuccessResponse<Staff>>(`/api/v1/staff/${id}`, {
    method: "PATCH",
    body: payload,
  });

export const updateStaffStatus = (id: string, status: StaffStatus) =>
  apiClient<ApiSuccessResponse<Staff>>(`/api/v1/staff/${id}/status`, {
    method: "PATCH",
    body: { status },
  });

export const deleteStaff = (id: string) =>
  apiClient<ApiSuccessResponse<null>>(`/api/v1/staff/${id}`, {
    method: "DELETE",
  });
