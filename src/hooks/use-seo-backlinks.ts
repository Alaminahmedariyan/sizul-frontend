import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  type BacklinkStatus,
  type CreateBacklinkInput,
  createBacklink,
  deleteBacklink,
  getBacklinks,
  updateBacklinkStatus,
} from "@/lib/api/seo-backlinks";

export function useBacklinks(projectId: string) {
  return useQuery({
    queryKey: ["seo-backlinks", projectId],
    queryFn: () => getBacklinks(projectId),
    enabled: !!projectId,
  });
}

export function useCreateBacklink(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Omit<CreateBacklinkInput, "projectId">) =>
      createBacklink({ ...payload, projectId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seo-backlinks", projectId] });
    },
  });
}

export function useUpdateBacklinkStatus(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: BacklinkStatus }) =>
      updateBacklinkStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seo-backlinks", projectId] });
    },
  });
}

export function useDeleteBacklink(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBacklink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seo-backlinks", projectId] });
    },
  });
}
