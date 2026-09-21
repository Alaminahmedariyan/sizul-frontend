import { apiClient } from "@/lib/api-client";

import type { ApiSuccessResponse } from "@/types/api";
import type { FileCategory } from "./project-files";

export type Media = {
  id: string;
  fileName: string;
  url: string;
  publicId: string | null;
  mimeType: string | null;
  size: number | null;
  category: FileCategory;
  altText: string | null;
  caption: string | null;
  width: number | null;
  height: number | null;
  createdAt: string;
  updatedAt: string;
};

export const getMediaList = () =>
  apiClient<ApiSuccessResponse<Media[]>>("/api/v1/media");

export const getMediaById = (id: string) =>
  apiClient<ApiSuccessResponse<Media>>(`/api/v1/media/${id}`);

export const uploadMedia = (file: File, altText?: string) => {
  const formData = new FormData();
  formData.append("file", file);
  if (altText) formData.append("altText", altText);

  return apiClient<ApiSuccessResponse<Media>>("/api/v1/media", {
    method: "POST",
    body: formData,
  });
};

export const updateMediaMetadata = (
  id: string,
  payload: Partial<Pick<Media, "altText" | "caption">>,
) =>
  apiClient<ApiSuccessResponse<Media>>(`/api/v1/media/${id}`, {
    method: "PATCH",
    body: payload,
  });

export const deleteMedia = (id: string) =>
  apiClient<ApiSuccessResponse<null>>(`/api/v1/media/${id}`, {
    method: "DELETE",
  });
