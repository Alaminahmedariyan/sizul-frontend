"use client";

import { FolderKanban } from "lucide-react";
import Link from "next/link";

import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useClientProjects, useMyClientProfile } from "@/hooks/use-clients";

export default function PortalProjectsPage() {
  const { data: clientRes, isLoading: isClientLoading } = useMyClientProfile();
  const clientId = clientRes?.data?.id ?? "";

  const { data: projectsRes, isLoading } = useClientProjects(clientId);

  if (isClientLoading || isLoading)
    return <p className="text-muted-foreground">Loading projects...</p>;

  const projects = projectsRes?.data ?? [];

  return (
    <div>
      <PageHeader
        title="Your Projects"
        description="Track the progress of work being done for you"
      />

      {projects.length === 0 && (
        <EmptyState
          icon={FolderKanban}
          title="No projects yet"
          description="Your projects will appear here once started."
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((project) => (
          <Link key={project.id} href={`/portal/projects/${project.id}`}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardContent className="pt-6 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{project.name}</p>
                  <StatusBadge status={project.status} />
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {project.description ?? "No description"}
                </p>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} />
                </div>
                {project.deadline && (
                  <p className="text-xs text-muted-foreground">
                    Deadline: {new Date(project.deadline).toLocaleDateString()}
                  </p>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
