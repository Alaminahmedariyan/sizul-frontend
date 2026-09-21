import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  deleteMedia,
  getMediaList,
  type Media,
  updateMediaMetadata,
  uploadMedia,
} from "@/lib/api/media";

export function useMediaList() {
  return useQuery({
    queryKey: ["media"],
    queryFn: () => getMediaList(),
  });
}

export function useUploadMedia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ file, altText }: { file: File; altText?: string }) =>
      uploadMedia(file, altText),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
    },
  });
}

export function useUpdateMediaMetadata() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<Pick<Media, "altText" | "caption">>;
    }) => updateMediaMetadata(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
    },
  });
}

export function useDeleteMedia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMedia,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
    },
  });
}
