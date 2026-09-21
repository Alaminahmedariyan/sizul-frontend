import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getGbp,
  markGbpOptimized,
  type UpsertGbpInput,
  updateGbpVerification,
  upsertGbp,
} from "@/lib/api/seo-google-business-profile";

export function useGbp(projectId: string) {
  return useQuery({
    queryKey: ["seo-gbp", projectId],
    queryFn: () => getGbp(projectId),
    enabled: !!projectId,
  });
}

export function useUpsertGbp(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpsertGbpInput) => upsertGbp(projectId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seo-gbp", projectId] });
    },
  });
}

export function useUpdateGbpVerification(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (isVerified: boolean) =>
      updateGbpVerification(projectId, isVerified),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seo-gbp", projectId] });
    },
  });
}

export function useMarkGbpOptimized(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => markGbpOptimized(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seo-gbp", projectId] });
    },
  });
}
