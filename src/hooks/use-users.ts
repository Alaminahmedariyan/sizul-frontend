import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getUserById,
  getUsers,
  updateUserRole,
  updateUserStatus,
} from "@/lib/api/users";

import type { UserRole, UserStatus } from "@/types/auth";

export function useUsers(params?: Record<string, string | number>) {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => getUsers(params),
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: ["users", id],
    queryFn: () => getUserById(id),
    enabled: !!id,
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: UserRole }) =>
      updateUserRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: UserStatus }) =>
      updateUserStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
