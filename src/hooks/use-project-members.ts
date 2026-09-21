import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  addProjectMember,
  getProjectMembers,
  type ProjectMemberRole,
  removeProjectMember,
  updateProjectMemberRole,
} from "@/lib/api/project-members";

export function useProjectMembers(projectId: string) {
  return useQuery({
    queryKey: ["project-members", projectId],
    queryFn: () => getProjectMembers(projectId),
    enabled: !!projectId,
  });
}

export function useAddProjectMember(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      staffId,
      role,
    }: {
      staffId: string;
      role?: ProjectMemberRole;
    }) => addProjectMember(projectId, staffId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["project-members", projectId],
      });
    },
  });
}

export function useUpdateProjectMemberRole(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: ProjectMemberRole }) =>
      updateProjectMemberRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["project-members", projectId],
      });
    },
  });
}

export function useRemoveProjectMember(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeProjectMember,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["project-members", projectId],
      });
    },
  });
}
