"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ProjectTabs } from "@/components/admin/project-tabs";
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCreateTask,
  useDeleteTask,
  useTasks,
  useUpdateTaskStatus,
} from "@/hooks/use-project-task";
import type {
  ProjectTask,
  TaskPriority,
  TaskStatus,
} from "@/lib/api/project-tasks";

const STATUS_COLUMNS: TaskStatus[] = [
  "TODO",
  "IN_PROGRESS",
  "IN_REVIEW",
  "BLOCKED",
  "COMPLETED",
  "CANCELLED",
];
const PRIORITY_OPTIONS: TaskPriority[] = ["LOW", "MEDIUM", "HIGH", "URGENT"];

function TaskCard({
  task,
  onStatusChange,
  onDelete,
  isDeletePending,
}: {
  task: ProjectTask;
  onStatusChange: (status: TaskStatus) => void;
  onDelete: () => void;
  isDeletePending: boolean;
}) {
  return (
    <Card className="mb-3">
      <CardContent className="p-3 space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">{task.title}</p>
          <StatusBadge status={task.priority} />
        </div>
        {task.dueDate && (
          <p className="text-xs text-muted-foreground">
            Due: {new Date(task.dueDate).toLocaleDateString()}
          </p>
        )}

        <div className="flex gap-2">
          <Select
            value={task.status}
            onValueChange={(v) => onStatusChange(v as TaskStatus)}
          >
            <SelectTrigger className="h-8 text-xs flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_COLUMNS.map((s) => (
                <SelectItem key={s} value={s}>
                  {s.replace(/_/g, " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <ConfirmDeleteDialog
            trigger={
              <Button variant="ghost" size="sm" className="h-8">
                Delete
              </Button>
            }
            onConfirm={onDelete}
            isPending={isDeletePending}
          />
        </div>
      </CardContent>
    </Card>
  );
}

export default function ProjectTasksPage() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading } = useTasks(id);
  const createTask = useCreateTask(id);
  const updateStatus = useUpdateTaskStatus(id);
  const deleteTask = useDeleteTask(id);

  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("MEDIUM");

  const tasks = data?.data ?? [];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    createTask.mutate(
      { title, priority },
      {
        onSuccess: () => {
          setTitle("");
          toast.success("Task added");
        },
        onError: (err) => toast.error(err.message),
      },
    );
  };

  return (
    <div>
      <PageHeader title="Tasks" />
      <ProjectTabs projectId={id} />

      <form onSubmit={handleCreate} className="flex gap-2 mb-4">
        <Input
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="max-w-xs"
        />
        <Select
          value={priority}
          onValueChange={(v) => setPriority(v as TaskPriority)}
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PRIORITY_OPTIONS.map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="submit" disabled={createTask.isPending}>
          Add task
        </Button>
      </form>

      {isLoading && <p className="text-muted-foreground">Loading tasks...</p>}

      {!isLoading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {STATUS_COLUMNS.map((status) => {
            const columnTasks = tasks.filter((t) => t.status === status);

            return (
              <div key={status}>
                <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase">
                  {status.replace(/_/g, " ")} ({columnTasks.length})
                </p>
                {columnTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onStatusChange={(newStatus) =>
                      updateStatus.mutate({ id: task.id, status: newStatus })
                    }
                    onDelete={() => deleteTask.mutate(task.id)}
                    isDeletePending={deleteTask.isPending}
                  />
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
