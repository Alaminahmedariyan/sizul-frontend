import { apiClient } from "@/lib/api-client";

import type { ApiSuccessResponse } from "@/types/api";

export type FileCategory = "IMAGE" | "VIDEO" | "DOCUMENT" | "AUDIO" | "OTHER";

export type ProjectFile = {
  id: string;
  projectId: string;
  fileName: string;
  fileUrl: string;
  publicId: string | null;
  mimeType: string | null;
  size: number | null;
  category: FileCategory;
  description: string | null;
  createdAt: string;
};

export const getProjectFiles = (projectId: string) =>
  apiClient<ApiSuccessResponse<ProjectFile[]>>("/api/v1/project-files", {
    query: { projectId },
  });

export const uploadProjectFile = (
  projectId: string,
  file: File,
  description?: string,
) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("projectId", projectId);
  if (description) formData.append("description", description);

  // NOTE: don't set Content-Type manually here — the browser sets the
  // correct multipart boundary automatically when body is a FormData.
  return apiClient<ApiSuccessResponse<ProjectFile>>("/api/v1/project-files", {
    method: "POST",
    body: formData,
  });
};

export const deleteProjectFile = (id: string) =>
  apiClient<ApiSuccessResponse<null>>(`/api/v1/project-files/${id}`, {
    method: "DELETE",
  });
