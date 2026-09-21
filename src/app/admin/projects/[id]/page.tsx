"use client";

import { useParams } from "next/navigation";
import { toast } from "sonner";
import { ProjectTabs } from "@/components/admin/project-tabs";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

import {
  useProject,
  useUpdateProjectProgress,
  useUpdateProjectStatus,
} from "@/hooks/use-projects";

import type { ProjectStatus } from "@/lib/api/projects";

const STATUS_OPTIONS: ProjectStatus[] = [
  "PLANNING",
  "IN_PROGRESS",
  "ON_HOLD",
  "REVIEW",
  "COMPLETED",
  "CANCELLED",
];

export default function ProjectOverviewPage() {
  const { id } = useParams<{ id: string }>();

  const { data: projectRes, isLoading } = useProject(id);
  const updateStatus = useUpdateProjectStatus(id);
  const updateProgress = useUpdateProjectProgress(id);

  if (isLoading)
    return <p className="text-muted-foreground">Loading project...</p>;

  const project = projectRes?.data;
  if (!project)
    return <p className="text-muted-foreground">Project not found.</p>;

  return (
    <div>
      <PageHeader
        title={project.name}
        description={project.description ?? undefined}
        action={<StatusBadge status={project.status} />}
      />
      <ProjectTabs projectId={id} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-sm font-medium">Status</p>
          <Select
            value={project.status}
            onValueChange={(v) =>
              updateStatus.mutate(v as ProjectStatus, {
                onSuccess: () => toast.success("Status updated"),
                onError: (err) => toast.error(err.message),
              })
            }
          >
            <SelectTrigger>
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
        </div>

        <div className="space-y-1">
          <p className="text-sm font-medium">Progress — {project.progress}%</p>
          <Slider
            value={[project.progress]}
            max={100}
            step={5}
            onValueChange={([value]) => updateProgress.mutate(value)}
          />
        </div>

        <div className="text-sm">
          <span className="text-muted-foreground">Budget:</span>{" "}
          {project.budget ?? "N/A"} {project.currency}
        </div>
        <div className="text-sm">
          <span className="text-muted-foreground">Deadline:</span>{" "}
          {project.deadline
            ? new Date(project.deadline).toLocaleDateString()
            : "N/A"}
        </div>
      </div>
    </div>
  );
}
