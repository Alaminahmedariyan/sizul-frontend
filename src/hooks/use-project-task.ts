import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  type CreateTaskInput,
  createTask,
  deleteTask,
  getTasks,
  type TaskStatus,
  updateTask,
  updateTaskStatus,
} from "@/lib/api/project-tasks";

export function useTasks(projectId: string) {
  return useQuery({
    queryKey: ["project-tasks", projectId],
    queryFn: () => getTasks(projectId),
    enabled: !!projectId,
  });
}

export function useCreateTask(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Omit<CreateTaskInput, "projectId">) =>
      createTask({ ...payload, projectId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-tasks", projectId] });
    },
  });
}

export function useUpdateTask(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Parameters<typeof updateTask>[1];
    }) => updateTask(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-tasks", projectId] });
    },
  });
}

export function useUpdateTaskStatus(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: TaskStatus }) =>
      updateTaskStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-tasks", projectId] });
    },
  });
}

export function useDeleteTask(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-tasks", projectId] });
    },
  });
}
