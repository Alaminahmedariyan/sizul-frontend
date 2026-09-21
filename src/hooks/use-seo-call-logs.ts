import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { deleteCallLog, getCallLogs } from "@/lib/api/seo-call-logs";

export function useCallLogs(projectId: string) {
  return useQuery({
    queryKey: ["seo-call-logs", projectId],
    queryFn: () => getCallLogs(projectId),
    enabled: !!projectId,
  });
}

export function useDeleteCallLog(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCallLog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seo-call-logs", projectId] });
    },
  });
}
