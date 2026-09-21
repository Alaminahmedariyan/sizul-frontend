import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  type CaseStudy,
  type ContentStatus,
  createCaseStudy,
  deleteCaseStudy,
  getCaseStudiesForManage,
  getCaseStudyByIdForManage,
  updateCaseStudy,
  updateCaseStudyStatus,
} from "@/lib/api/case-studies";

export function useCaseStudiesForManage() {
  return useQuery({
    queryKey: ["case-studies", "manage"],
    queryFn: () => getCaseStudiesForManage(),
  });
}

export function useCaseStudyForManage(id: string) {
  return useQuery({
    queryKey: ["case-studies", "manage", id],
    queryFn: () => getCaseStudyByIdForManage(id),
    enabled: !!id,
  });
}

export function useCreateCaseStudy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCaseStudy,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["case-studies"] });
    },
  });
}

export function useUpdateCaseStudy(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      payload: Partial<Omit<CaseStudy, "id" | "createdAt" | "updatedAt">>,
    ) => updateCaseStudy(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["case-studies", "manage", id],
      });
      queryClient.invalidateQueries({ queryKey: ["case-studies"] });
    },
  });
}

export function useUpdateCaseStudyStatus(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (status: ContentStatus) => updateCaseStudyStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["case-studies", "manage", id],
      });
    },
  });
}

export function useDeleteCaseStudy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCaseStudy,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["case-studies"] });
    },
  });
}
