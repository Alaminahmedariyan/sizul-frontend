import { apiClient } from "@/lib/api-client";

import type { ApiSuccessResponse } from "@/types/api";

export type ProjectMemberRole = "LEAD" | "MEMBER" | "REVIEWER" | "OBSERVER";

export type ProjectMember = {
  id: string;
  projectId: string;
  staffId: string;
  role: ProjectMemberRole;
  createdAt: string;
};

export const getProjectMembers = (projectId: string) =>
  apiClient<ApiSuccessResponse<ProjectMember[]>>("/api/v1/project-members", {
    query: { projectId },
  });

export const addProjectMember = (
  projectId: string,
  staffId: string,
  role: ProjectMemberRole = "MEMBER",
) =>
  apiClient<ApiSuccessResponse<ProjectMember>>("/api/v1/project-members", {
    method: "POST",
    body: { projectId, staffId, role },
  });

export const updateProjectMemberRole = (id: string, role: ProjectMemberRole) =>
  apiClient<ApiSuccessResponse<ProjectMember>>(
    `/api/v1/project-members/${id}/role`,
    {
      method: "PATCH",
      body: { role },
    },
  );

export const removeProjectMember = (id: string) =>
  apiClient<ApiSuccessResponse<null>>(`/api/v1/project-members/${id}`, {
    method: "DELETE",
  });
