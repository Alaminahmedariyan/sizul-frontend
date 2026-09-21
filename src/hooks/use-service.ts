import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createService,
  deleteService,
  getServiceByIdForManage,
  getServices,
  getServicesForManage,
  type Service,
  updateService,
} from "@/lib/api/services";

// ---- Public: all active services ----
export function useServices() {
  return useQuery({
    queryKey: ["services"],
    queryFn: () => getServices(),
  });
}

// ---- Admin ----
export function useServicesForManage() {
  return useQuery({
    queryKey: ["services", "manage"],
    queryFn: () => getServicesForManage(),
  });
}

export function useServiceForManage(id: string) {
  return useQuery({
    queryKey: ["services", "manage", id],
    queryFn: () => getServiceByIdForManage(id),
    enabled: !!id,
  });
}

export function useCreateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
}

export function useUpdateService(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      payload: Partial<Omit<Service, "id" | "createdAt" | "updatedAt">>,
    ) => updateService(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services", "manage", id] });
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
}

export function useDeleteService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
}
