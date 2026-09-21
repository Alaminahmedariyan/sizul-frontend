import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  acceptProposal,
  type CreateProposalInput,
  createProposal,
  deleteProposal,
  getProposalById,
  getProposals,
  markProposalViewed,
  type Proposal,
  rejectProposal,
  sendProposal,
  updateProposal,
} from "@/lib/api/proposals";

export function useProposals(params?: Record<string, string | number>) {
  return useQuery({
    queryKey: ["proposals", params],
    queryFn: () => getProposals(params),
  });
}

export function useProposal(id: string) {
  return useQuery({
    queryKey: ["proposals", id],
    queryFn: () => getProposalById(id),
    enabled: !!id,
  });
}

export function useCreateProposal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateProposalInput) => createProposal(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposals"] });
    },
  });
}

export function useUpdateProposal(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      payload: Partial<Pick<Proposal, "title" | "introduction" | "terms">>,
    ) => updateProposal(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposals", id] });
    },
  });
}

function useProposalAction(
  id: string,
  action: (id: string) => Promise<unknown>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => action(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposals", id] });
      queryClient.invalidateQueries({ queryKey: ["proposals"] });
    },
  });
}

export function useSendProposal(id: string) {
  return useProposalAction(id, sendProposal);
}

export function useMarkProposalViewed(id: string) {
  return useProposalAction(id, markProposalViewed);
}

export function useAcceptProposal(id: string) {
  return useProposalAction(id, acceptProposal);
}

export function useRejectProposal(id: string) {
  return useProposalAction(id, rejectProposal);
}

export function useDeleteProposal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProposal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposals"] });
    },
  });
}
