import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createAppreciation,
  deleteAppreciation,
  getAppreciations,
  updateAppreciation,
} from "@/lib/api/client-appreciations";

export function useAppreciations() {
  return useQuery({
    queryKey: ["client-appreciations"],
    queryFn: () => getAppreciations(),
  });
}

export function useCreateAppreciation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAppreciation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client-appreciations"] });
    },
  });
}

export function useUpdateAppreciation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Parameters<typeof updateAppreciation>[1];
    }) => updateAppreciation(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client-appreciations"] });
    },
  });
}

export function useDeleteAppreciation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAppreciation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client-appreciations"] });
    },
  });
}
