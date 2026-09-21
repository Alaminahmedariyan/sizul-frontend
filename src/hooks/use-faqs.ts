import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createFaq,
  deleteFaq,
  type Faq,
  getFaqsForManage,
  updateFaq,
} from "@/lib/api/faqs";

export function useFaqsForManage() {
  return useQuery({
    queryKey: ["faqs", "manage"],
    queryFn: () => getFaqsForManage(),
  });
}

export function useCreateFaq() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFaq,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
    },
  });
}

export function useUpdateFaq() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<
        Pick<Faq, "question" | "answer" | "category" | "order" | "isActive">
      >;
    }) => updateFaq(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
    },
  });
}

export function useDeleteFaq() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFaq,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
    },
  });
}
