import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  assignConsultationToStaff,
  type ConsultationStatus,
  deleteConsultation,
  getConsultationById,
  getConsultations,
  updateConsultationStatus,
} from "@/lib/api/consultations";

export function useConsultations(params?: Record<string, string | number>) {
  return useQuery({
    queryKey: ["consultations", params],
    queryFn: () => getConsultations(params),
  });
}

export function useConsultation(id: string) {
  return useQuery({
    queryKey: ["consultations", id],
    queryFn: () => getConsultationById(id),
    enabled: !!id,
  });
}

export function useUpdateConsultationStatus(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (status: ConsultationStatus) =>
      updateConsultationStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consultations", id] });
      queryClient.invalidateQueries({ queryKey: ["consultations"] });
    },
  });
}

export function useAssignConsultation(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (staffId: string) => assignConsultationToStaff(id, staffId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consultations", id] });
    },
  });
}

export function useDeleteConsultation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteConsultation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consultations"] });
    },
  });
}
