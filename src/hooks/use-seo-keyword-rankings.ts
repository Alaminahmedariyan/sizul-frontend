import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  type CreateKeywordRankingInput,
  createKeywordRanking,
  deleteKeywordRanking,
  getKeywordRankings,
  updateKeywordRanking,
} from "@/lib/api/seo-keyword-rankings";

export function useKeywordRankings(projectId: string) {
  return useQuery({
    queryKey: ["seo-keyword-rankings", projectId],
    queryFn: () => getKeywordRankings(projectId),
    enabled: !!projectId,
  });
}

export function useCreateKeywordRanking(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Omit<CreateKeywordRankingInput, "projectId">) =>
      createKeywordRanking({ ...payload, projectId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["seo-keyword-rankings", projectId],
      });
    },
  });
}

export function useUpdateKeywordRanking(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, rank }: { id: string; rank: number }) =>
      updateKeywordRanking(id, { rank }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["seo-keyword-rankings", projectId],
      });
    },
  });
}

export function useDeleteKeywordRanking(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteKeywordRanking,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["seo-keyword-rankings", projectId],
      });
    },
  });
}
