import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  type CreateServiceAreaInput,
  createServiceArea,
  deleteServiceArea,
  getServiceAreas,
  publishServiceArea,
  updateServiceArea,
} from "@/lib/api/seo-service-areas";

export function useServiceAreas(projectId: string) {
  return useQuery({
    queryKey: ["seo-service-areas", projectId],
    queryFn: () => getServiceAreas(projectId),
    enabled: !!projectId,
  });
}

export function useCreateServiceArea(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Omit<CreateServiceAreaInput, "projectId">) =>
      createServiceArea({ ...payload, projectId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["seo-service-areas", projectId],
      });
    },
  });
}

export function useUpdateServiceArea(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, pageUrl }: { id: string; pageUrl: string }) =>
      updateServiceArea(id, { pageUrl }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["seo-service-areas", projectId],
      });
    },
  });
}

export function usePublishServiceArea(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => publishServiceArea(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["seo-service-areas", projectId],
      });
    },
  });
}

export function useDeleteServiceArea(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteServiceArea,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["seo-service-areas", projectId],
      });
    },
  });
}
