import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  deleteProjectFile,
  getProjectFiles,
  uploadProjectFile,
} from "@/lib/api/project-files";

export function useProjectFiles(projectId: string) {
  return useQuery({
    queryKey: ["project-files", projectId],
    queryFn: () => getProjectFiles(projectId),
    enabled: !!projectId,
  });
}

export function useUploadProjectFile(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ file, description }: { file: File; description?: string }) =>
      uploadProjectFile(projectId, file, description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-files", projectId] });
    },
  });
}

export function useDeleteProjectFile(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProjectFile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-files", projectId] });
    },
  });
}
