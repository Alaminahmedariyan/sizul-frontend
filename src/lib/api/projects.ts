import { apiClient } from "@/lib/api-client";

import type { ApiSuccessResponse } from "@/types/api";

export type ProjectType =
  | "CLIENT_PROJECT"
  | "INTERNAL_PROJECT"
  | "RESEARCH"
  | "MAINTENANCE";
export type ProjectStatus =
  | "PLANNING"
  | "IN_PROGRESS"
  | "ON_HOLD"
  | "REVIEW"
  | "COMPLETED"
  | "CANCELLED";

export type Project = {
  id: string;
  clientId: string | null;
  serviceId: string | null;
  name: string;
  slug: string;
  projectType: ProjectType;
  status: ProjectStatus;
  description: string | null;
  budget: string | null;
  currency: string;
  startDate: string | null;
  deadline: string | null;
  completedAt: string | null;
  progress: number;
  createdAt: string;
  updatedAt: string;
};

export const getProjects = (params?: Record<string, string | number>) =>
  apiClient<ApiSuccessResponse<Project[]>>("/api/v1/projects", {
    query: params,
  });

export const getProjectById = (id: string) =>
  apiClient<ApiSuccessResponse<Project>>(`/api/v1/projects/${id}`);

export const createProject = (
  payload: Pick<Project, "name" | "slug"> &
    Partial<Omit<Project, "id" | "createdAt" | "updatedAt">>,
) =>
  apiClient<ApiSuccessResponse<Project>>("/api/v1/projects", {
    method: "POST",
    body: payload,
  });

export const updateProject = (
  id: string,
  payload: Partial<
    Pick<Project, "description" | "budget" | "deadline" | "serviceId">
  >,
) =>
  apiClient<ApiSuccessResponse<Project>>(`/api/v1/projects/${id}`, {
    method: "PATCH",
    body: payload,
  });

export const updateProjectStatus = (id: string, status: ProjectStatus) =>
  apiClient<ApiSuccessResponse<Project>>(`/api/v1/projects/${id}/status`, {
    method: "PATCH",
    body: { status },
  });

export const updateProjectProgress = (id: string, progress: number) =>
  apiClient<ApiSuccessResponse<Project>>(`/api/v1/projects/${id}/progress`, {
    method: "PATCH",
    body: { progress },
  });

export const deleteProject = (id: string) =>
  apiClient<ApiSuccessResponse<null>>(`/api/v1/projects/${id}`, {
    method: "DELETE",
  });
