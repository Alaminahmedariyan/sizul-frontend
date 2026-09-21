import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getTrackingConfig,
  type UpsertTrackingConfigInput,
  upsertTrackingConfig,
} from "@/lib/api/seo-tracking-config";

export function useTrackingConfig(projectId: string) {
  return useQuery({
    queryKey: ["seo-tracking-config", projectId],
    queryFn: () => getTrackingConfig(projectId),
    enabled: !!projectId,
  });
}

export function useUpsertTrackingConfig(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpsertTrackingConfigInput) =>
      upsertTrackingConfig(projectId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["seo-tracking-config", projectId],
      });
    },
  });
}
