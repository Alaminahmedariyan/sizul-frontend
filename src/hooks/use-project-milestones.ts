import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  type CreateMilestoneInput,
  createMilestone,
  deleteMilestone,
  getMilestones,
  type MilestoneStatus,
  updateMilestone,
  updateMilestoneStatus,
} from "@/lib/api/project-milestones";

export function useMilestones(projectId: string) {
  return useQuery({
    queryKey: ["project-milestones", projectId],
    queryFn: () => getMilestones(projectId),
    enabled: !!projectId,
  });
}

export function useCreateMilestone(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Omit<CreateMilestoneInput, "projectId">) =>
      createMilestone({ ...payload, projectId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["project-milestones", projectId],
      });
    },
  });
}

export function useUpdateMilestone(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Parameters<typeof updateMilestone>[1];
    }) => updateMilestone(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["project-milestones", projectId],
      });
    },
  });
}

export function useUpdateMilestoneStatus(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: MilestoneStatus }) =>
      updateMilestoneStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["project-milestones", projectId],
      });
    },
  });
}

export function useDeleteMilestone(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMilestone,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["project-milestones", projectId],
      });
    },
  });
}
