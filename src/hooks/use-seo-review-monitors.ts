import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  type CreateReviewMonitorInput,
  createReviewMonitor,
  deleteReviewMonitor,
  getReviewMonitors,
} from "@/lib/api/seo-review-monitors";

export function useReviewMonitors(projectId: string) {
  return useQuery({
    queryKey: ["seo-review-monitors", projectId],
    queryFn: () => getReviewMonitors(projectId),
    enabled: !!projectId,
  });
}

export function useCreateReviewMonitor(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Omit<CreateReviewMonitorInput, "projectId">) =>
      createReviewMonitor({ ...payload, projectId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["seo-review-monitors", projectId],
      });
    },
  });
}

export function useDeleteReviewMonitor(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteReviewMonitor,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["seo-review-monitors", projectId],
      });
    },
  });
}
