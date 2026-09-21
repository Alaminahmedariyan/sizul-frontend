"use client";

import { useParams } from "next/navigation";
import { ClientProjectTabs } from "@/components/portal/project-tabs";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

import { useProject } from "@/hooks/use-projects";

export default function PortalProjectOverviewPage() {
  const { id } = useParams<{ id: string }>();

  const { data: projectRes, isLoading } = useProject(id);

  if (isLoading)
    return <p className="text-muted-foreground">Loading project...</p>;

  const project = projectRes?.data;
  if (!project)
    return <p className="text-muted-foreground">Project not found.</p>;

  return (
    <div>
      <PageHeader
        title={project.name}
        action={<StatusBadge status={project.status} />}
      />
      <ClientProjectTabs projectId={id} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            {project.description ?? "No description provided."}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Completion</span>
              <span>{project.progress}%</span>
            </div>
            <Progress value={project.progress} />
            <p className="text-sm text-muted-foreground pt-2">
              Deadline:{" "}
              {project.deadline
                ? new Date(project.deadline).toLocaleDateString()
                : "Not set"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
