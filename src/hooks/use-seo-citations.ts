import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  type CitationStatus,
  type CreateCitationInput,
  createCitation,
  deleteCitation,
  getCitations,
  updateCitationStatus,
} from "@/lib/api/seo-citations";

export function useCitations(projectId: string) {
  return useQuery({
    queryKey: ["seo-citations", projectId],
    queryFn: () => getCitations(projectId),
    enabled: !!projectId,
  });
}

export function useCreateCitation(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Omit<CreateCitationInput, "projectId">) =>
      createCitation({ ...payload, projectId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seo-citations", projectId] });
    },
  });
}

export function useUpdateCitationStatus(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: CitationStatus }) =>
      updateCitationStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seo-citations", projectId] });
    },
  });
}

export function useDeleteCitation(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCitation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seo-citations", projectId] });
    },
  });
}
