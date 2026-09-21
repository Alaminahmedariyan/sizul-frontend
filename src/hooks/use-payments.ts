import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createBkashCheckout,
  createSslcommerzCheckout,
  createStripeCheckout,
  getMyPayments,
  getPaymentById,
  getPayments,
  refundPayment,
} from "@/lib/api/payments";

// ---- Client Portal ----
export function useMyPayments() {
  return useQuery({
    queryKey: ["payments", "me"],
    queryFn: () => getMyPayments(),
  });
}

export function useStripeCheckout() {
  return useMutation({
    mutationFn: (proposalId: string) => createStripeCheckout(proposalId),
  });
}

export function useBkashCheckout() {
  return useMutation({
    mutationFn: (proposalId: string) => createBkashCheckout(proposalId),
  });
}

export function useSslcommerzCheckout() {
  return useMutation({
    mutationFn: (proposalId: string) => createSslcommerzCheckout(proposalId),
  });
}

// ---- Admin/Staff ----
export function usePayments(params?: Record<string, string | number>) {
  return useQuery({
    queryKey: ["payments", params],
    queryFn: () => getPayments(params),
  });
}

export function usePayment(id: string) {
  return useQuery({
    queryKey: ["payments", id],
    queryFn: () => getPaymentById(id),
    enabled: !!id,
  });
}

export function useRefundPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: refundPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
  });
}
