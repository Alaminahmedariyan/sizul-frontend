import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  type CreatePerformanceReportInput,
  createPerformanceReport,
  deletePerformanceReport,
  getPerformanceReports,
} from "@/lib/api/seo-performance-reports";

export function usePerformanceReports(projectId: string) {
  return useQuery({
    queryKey: ["seo-performance-reports", projectId],
    queryFn: () => getPerformanceReports(projectId),
    enabled: !!projectId,
  });
}

export function useCreatePerformanceReport(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Omit<CreatePerformanceReportInput, "projectId">) =>
      createPerformanceReport({ ...payload, projectId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["seo-performance-reports", projectId],
      });
    },
  });
}

export function useDeletePerformanceReport(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePerformanceReport,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["seo-performance-reports", projectId],
      });
    },
  });
}
