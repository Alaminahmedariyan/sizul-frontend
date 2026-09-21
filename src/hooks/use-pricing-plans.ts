import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createPricingPlan,
  deletePricingPlan,
  getPricingPlans,
  type PricingPlan,
  updatePricingPlan,
} from "@/lib/api/pricing-plans";

export function usePricingPlans(serviceId: string) {
  return useQuery({
    queryKey: ["pricing-plans", serviceId],
    queryFn: () => getPricingPlans(serviceId),
    enabled: !!serviceId,
  });
}

export function useCreatePricingPlan(serviceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      payload: Omit<Parameters<typeof createPricingPlan>[0], "serviceId">,
    ) => createPricingPlan({ ...payload, serviceId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pricing-plans", serviceId] });
    },
  });
}

export function useUpdatePricingPlan(serviceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<Omit<PricingPlan, "id" | "createdAt" | "updatedAt">>;
    }) => updatePricingPlan(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pricing-plans", serviceId] });
    },
  });
}

export function useDeletePricingPlan(serviceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePricingPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pricing-plans", serviceId] });
    },
  });
}
