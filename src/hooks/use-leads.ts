import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  addLeadNote,
  assignLeadToStaff,
  convertLeadToClient,
  getLeadActivities,
  getLeadById,
  getLeadNotes,
  getLeads,
  type LeadStatus,
  updateLeadStatus,
} from "@/lib/api/leads";

export function useLeads(params?: Record<string, string | number>) {
  return useQuery({
    queryKey: ["leads", params],
    queryFn: () => getLeads(params),
  });
}

export function useLead(id: string) {
  return useQuery({
    queryKey: ["leads", id],
    queryFn: () => getLeadById(id),
    enabled: !!id,
  });
}

export function useLeadNotes(id: string) {
  return useQuery({
    queryKey: ["leads", id, "notes"],
    queryFn: () => getLeadNotes(id),
    enabled: !!id,
  });
}

export function useLeadActivities(id: string) {
  return useQuery({
    queryKey: ["leads", id, "activities"],
    queryFn: () => getLeadActivities(id),
    enabled: !!id,
  });
}

export function useUpdateLeadStatus(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (status: LeadStatus) => updateLeadStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads", id] });
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });
}

export function useAssignLead(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (staffId: string) => assignLeadToStaff(id, staffId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads", id] });
    },
  });
}

export function useAddLeadNote(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) => addLeadNote(id, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads", id, "notes"] });
    },
  });
}

export function useConvertLead(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => convertLeadToClient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads", id] });
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });
}
