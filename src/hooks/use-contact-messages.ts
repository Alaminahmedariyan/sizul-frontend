import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  type ContactMessageStatus,
  deleteContactMessage,
  getContactMessageById,
  getContactMessages,
  updateContactMessageStatus,
} from "@/lib/api/contact-messages";

export function useContactMessages(params?: Record<string, string | number>) {
  return useQuery({
    queryKey: ["contact-messages", params],
    queryFn: () => getContactMessages(params),
  });
}

export function useContactMessage(id: string) {
  return useQuery({
    queryKey: ["contact-messages", id],
    queryFn: () => getContactMessageById(id),
    enabled: !!id,
  });
}

export function useUpdateContactMessageStatus(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (status: ContactMessageStatus) =>
      updateContactMessageStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact-messages", id] });
      queryClient.invalidateQueries({ queryKey: ["contact-messages"] });
    },
  });
}

export function useDeleteContactMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteContactMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact-messages"] });
    },
  });
}
