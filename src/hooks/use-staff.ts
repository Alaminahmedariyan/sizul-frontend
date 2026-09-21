import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  type CreateStaffInput,
  createStaff,
  deleteStaff,
  getStaffById,
  getStaffList,
  type Staff,
  type StaffStatus,
  updateStaff,
  updateStaffStatus,
} from "@/lib/api/staff";

export function useStaffList(params?: Record<string, string | number>) {
  return useQuery({
    queryKey: ["staff", params],
    queryFn: () => getStaffList(params),
  });
}

export function useStaffMember(id: string) {
  return useQuery({
    queryKey: ["staff", id],
    queryFn: () => getStaffById(id),
    enabled: !!id,
  });
}

export function useCreateStaff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateStaffInput) => createStaff(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
    },
  });
}

export function useUpdateStaff(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      payload: Partial<Pick<Staff, "designation" | "department" | "bio">>,
    ) => updateStaff(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff", id] });
      queryClient.invalidateQueries({ queryKey: ["staff"] });
    },
  });
}

export function useUpdateStaffStatus(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (status: StaffStatus) => updateStaffStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff", id] });
      queryClient.invalidateQueries({ queryKey: ["staff"] });
    },
  });
}

export function useDeleteStaff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteStaff,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
    },
  });
}
