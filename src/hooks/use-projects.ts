import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createProject,
  deleteProject,
  getProjectById,
  getProjects,
  type Project,
  type ProjectStatus,
  updateProject,
  updateProjectProgress,
  updateProjectStatus,
} from "@/lib/api/projects";

export function useProjects(params?: Record<string, string | number>) {
  return useQuery({
    queryKey: ["projects", params],
    queryFn: () => getProjects(params),
  });
}

export function useProject(id: string) {
  return useQuery({
    queryKey: ["projects", id],
    queryFn: () => getProjectById(id),
    enabled: !!id,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useUpdateProject(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      payload: Partial<Pick<Project, "description" | "budget" | "deadline">>,
    ) => updateProject(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects", id] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useUpdateProjectStatus(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (status: ProjectStatus) => updateProjectStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects", id] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useUpdateProjectProgress(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (progress: number) => updateProjectProgress(id, progress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects", id] });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}
