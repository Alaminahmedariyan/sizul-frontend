import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  addPortfolioImage,
  type ContentStatus,
  createPortfolio,
  deletePortfolio,
  getPortfolioByIdForManage,
  getPortfolioForManage,
  type Portfolio,
  removePortfolioImage,
  updatePortfolio,
  updatePortfolioStatus,
} from "@/lib/api/portfolio";

export function usePortfolioForManage() {
  return useQuery({
    queryKey: ["portfolio", "manage"],
    queryFn: () => getPortfolioForManage(),
  });
}

export function usePortfolioItemForManage(id: string) {
  return useQuery({
    queryKey: ["portfolio", "manage", id],
    queryFn: () => getPortfolioByIdForManage(id),
    enabled: !!id,
  });
}

export function useCreatePortfolio() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPortfolio,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolio"] });
    },
  });
}

export function useUpdatePortfolio(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      payload: Partial<
        Omit<Portfolio, "id" | "images" | "createdAt" | "updatedAt">
      >,
    ) => updatePortfolio(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolio", "manage", id] });
      queryClient.invalidateQueries({ queryKey: ["portfolio"] });
    },
  });
}

export function useUpdatePortfolioStatus(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (status: ContentStatus) => updatePortfolioStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolio", "manage", id] });
    },
  });
}

export function useAddPortfolioImage(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      file,
      altText,
      order,
    }: {
      file: File;
      altText?: string;
      order?: number;
    }) => addPortfolioImage(id, file, altText, order),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolio", "manage", id] });
    },
  });
}

export function useRemovePortfolioImage(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removePortfolioImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolio", "manage", id] });
    },
  });
}

export function useDeletePortfolio() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePortfolio,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolio"] });
    },
  });
}
