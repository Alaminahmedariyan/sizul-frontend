import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  type CreateSeoAuditInput,
  createSeoAudit,
  deleteSeoAudit,
  getSeoAudits,
} from "@/lib/api/seo-audits";

export function useSeoAudits(projectId: string) {
  return useQuery({
    queryKey: ["seo-audits", projectId],
    queryFn: () => getSeoAudits(projectId),
    enabled: !!projectId,
  });
}

export function useCreateSeoAudit(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Omit<CreateSeoAuditInput, "projectId">) =>
      createSeoAudit({ ...payload, projectId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seo-audits", projectId] });
    },
  });
}

export function useDeleteSeoAudit(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSeoAudit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seo-audits", projectId] });
    },
  });
}
