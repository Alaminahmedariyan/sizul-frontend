"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ProjectTabs } from "@/components/admin/project-tabs";
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  useCreateMilestone,
  useDeleteMilestone,
  useMilestones,
  useUpdateMilestoneStatus,
} from "@/hooks/use-project-milestones";

import type { MilestoneStatus } from "@/lib/api/project-milestones";

const STATUS_OPTIONS: MilestoneStatus[] = [
  "PENDING",
  "IN_PROGRESS",
  "COMPLETED",
  "BLOCKED",
];

export default function ProjectMilestonesPage() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading } = useMilestones(id);
  const createMilestone = useCreateMilestone(id);
  const updateStatus = useUpdateMilestoneStatus(id);
  const deleteMilestone = useDeleteMilestone(id);

  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");

  const milestones = data?.data ?? [];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    createMilestone.mutate(
      { title, dueDate: dueDate || undefined },
      {
        onSuccess: () => {
          setTitle("");
          setDueDate("");
          toast.success("Milestone added");
        },
        onError: (err) => toast.error(err.message),
      },
    );
  };

  return (
    <div>
      <PageHeader title="Milestones" />
      <ProjectTabs projectId={id} />

      <form onSubmit={handleCreate} className="flex gap-2 mb-4">
        <Input
          placeholder="Milestone title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="max-w-xs"
        />
        <Input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="max-w-[150px]"
        />
        <Button type="submit" disabled={createMilestone.isPending}>
          Add
        </Button>
      </form>

      <div className="space-y-3">
        {isLoading && (
          <p className="text-muted-foreground">Loading milestones...</p>
        )}
        {!isLoading && milestones.length === 0 && (
          <p className="text-muted-foreground">No milestones yet.</p>
        )}
        {milestones.map((milestone) => (
          <Card key={milestone.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">{milestone.title}</CardTitle>
              <StatusBadge status={milestone.status} />
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Due:{" "}
                {milestone.dueDate
                  ? new Date(milestone.dueDate).toLocaleDateString()
                  : "N/A"}
              </p>
              <div className="flex gap-2">
                <Select
                  value={milestone.status}
                  onValueChange={(v) =>
                    updateStatus.mutate({
                      id: milestone.id,
                      status: v as MilestoneStatus,
                    })
                  }
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s.replace(/_/g, " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <ConfirmDeleteDialog
                  trigger={
                    <Button variant="ghost" size="sm">
                      Delete
                    </Button>
                  }
                  onConfirm={() => deleteMilestone.mutate(milestone.id)}
                  isPending={deleteMilestone.isPending}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
