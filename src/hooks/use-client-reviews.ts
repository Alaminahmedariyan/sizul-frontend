import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  deleteReview,
  getReviewsForManage,
  submitMyReview,
  updateReviewApproval,
  updateReviewFeatured,
} from "@/lib/api/client-reviews";

export function useReviewsForManage() {
  return useQuery({
    queryKey: ["client-reviews", "manage"],
    queryFn: () => getReviewsForManage(),
  });
}

export function useSubmitMyReview() {
  return useMutation({
    mutationFn: submitMyReview,
  });
}

export function useUpdateReviewApproval() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isApproved }: { id: string; isApproved: boolean }) =>
      updateReviewApproval(id, isApproved),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client-reviews"] });
    },
  });
}

export function useUpdateReviewFeatured() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isFeatured }: { id: string; isFeatured: boolean }) =>
      updateReviewFeatured(id, isFeatured),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client-reviews"] });
    },
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client-reviews"] });
    },
  });
}
