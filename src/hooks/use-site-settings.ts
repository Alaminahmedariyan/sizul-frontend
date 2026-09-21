import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  deleteSiteSetting,
  getSiteSettings,
  upsertSiteSetting,
} from "@/lib/api/site-settings";

export function useSiteSettings() {
  return useQuery({
    queryKey: ["site-settings"],
    queryFn: () => getSiteSettings(),
  });
}

export function useUpsertSiteSetting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: upsertSiteSetting,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-settings"] });
    },
  });
}

export function useDeleteSiteSetting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSiteSetting,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-settings"] });
    },
  });
}
