import { apiClient } from "@/lib/api-client";

import type { ApiSuccessResponse } from "@/types/api";

export type TaskStatus =
  | "TODO"
  | "IN_PROGRESS"
  | "IN_REVIEW"
  | "BLOCKED"
  | "COMPLETED"
  | "CANCELLED";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export type ProjectTask = {
  id: string;
  projectId: string;
  milestoneId: string | null;
  assignedStaffId: string | null;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateTaskInput = {
  projectId: string;
  milestoneId?: string;
  assignedStaffId?: string;
  title: string;
  priority?: TaskPriority;
  dueDate?: string;
};

export const getTasks = (projectId: string) =>
  apiClient<ApiSuccessResponse<ProjectTask[]>>("/api/v1/project-tasks", {
    query: { projectId },
  });

export const getTaskById = (id: string) =>
  apiClient<ApiSuccessResponse<ProjectTask>>(`/api/v1/project-tasks/${id}`);

export const createTask = (payload: CreateTaskInput) =>
  apiClient<ApiSuccessResponse<ProjectTask>>("/api/v1/project-tasks", {
    method: "POST",
    body: payload,
  });

export const updateTask = (
  id: string,
  payload: Partial<
    Pick<ProjectTask, "title" | "priority" | "dueDate" | "assignedStaffId">
  >,
) =>
  apiClient<ApiSuccessResponse<ProjectTask>>(`/api/v1/project-tasks/${id}`, {
    method: "PATCH",
    body: payload,
  });

export const updateTaskStatus = (id: string, status: TaskStatus) =>
  apiClient<ApiSuccessResponse<ProjectTask>>(
    `/api/v1/project-tasks/${id}/status`,
    {
      method: "PATCH",
      body: { status },
    },
  );

export const deleteTask = (id: string) =>
  apiClient<ApiSuccessResponse<null>>(`/api/v1/project-tasks/${id}`, {
    method: "DELETE",
  });
