import { apiClient } from "@/lib/api-client";

import type { ApiSuccessResponse } from "@/types/api";

export type MilestoneStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "BLOCKED";

export type ProjectMilestone = {
  id: string;
  projectId: string;
  title: string;
  description: string | null;
  status: MilestoneStatus;
  startDate: string | null;
  dueDate: string | null;
  completedAt: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
};

export type CreateMilestoneInput = {
  projectId: string;
  title: string;
  description?: string;
  dueDate?: string;
  order?: number;
};

export const getMilestones = (projectId: string) =>
  apiClient<ApiSuccessResponse<ProjectMilestone[]>>(
    "/api/v1/project-milestones",
    {
      query: { projectId },
    },
  );

export const getMilestoneById = (id: string) =>
  apiClient<ApiSuccessResponse<ProjectMilestone>>(
    `/api/v1/project-milestones/${id}`,
  );

export const createMilestone = (payload: CreateMilestoneInput) =>
  apiClient<ApiSuccessResponse<ProjectMilestone>>(
    "/api/v1/project-milestones",
    {
      method: "POST",
      body: payload,
    },
  );

export const updateMilestone = (
  id: string,
  payload: Partial<Pick<ProjectMilestone, "title" | "description" | "dueDate">>,
) =>
  apiClient<ApiSuccessResponse<ProjectMilestone>>(
    `/api/v1/project-milestones/${id}`,
    {
      method: "PATCH",
      body: payload,
    },
  );

export const updateMilestoneStatus = (id: string, status: MilestoneStatus) =>
  apiClient<ApiSuccessResponse<ProjectMilestone>>(
    `/api/v1/project-milestones/${id}/status`,
    {
      method: "PATCH",
      body: { status },
    },
  );

export const deleteMilestone = (id: string) =>
  apiClient<ApiSuccessResponse<null>>(`/api/v1/project-milestones/${id}`, {
    method: "DELETE",
  });
