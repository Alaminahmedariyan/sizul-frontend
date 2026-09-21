"use client";

import { Briefcase, FileText } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/state-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useClientProjects,
  useClientProposals,
  useMyClientProfile,
} from "@/hooks/use-clients";

export default function PortalDashboardPage() {
  const { data: clientRes, isLoading } = useMyClientProfile();
  const clientId = clientRes?.data?.id ?? "";

  const { data: projectsRes } = useClientProjects(clientId);
  const { data: proposalsRes } = useClientProposals(clientId);

  if (isLoading)
    return <p className="text-muted-foreground">Loading your dashboard...</p>;

  const projects = projectsRes?.data ?? [];
  const proposals = proposalsRes?.data ?? [];

  const activeProjectsCount = projects.filter(
    (p) => p.status === "IN_PROGRESS",
  ).length;
  const pendingProposalsCount = proposals.filter(
    (p) => p.status === "SENT" || p.status === "VIEWED",
  ).length;

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${clientRes?.data?.name ?? ""}`}
        description="Here's what's happening with your projects"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <StatCard
          label="Active Projects"
          value={activeProjectsCount}
          icon={Briefcase}
        />
        <StatCard
          label="Pending Proposals"
          value={pendingProposalsCount}
          icon={FileText}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Your Projects</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {projects.length === 0 && (
              <p className="text-sm text-muted-foreground">No projects yet.</p>
            )}
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/portal/projects/${project.id}`}
                className="flex items-center justify-between border-b pb-2 last:border-0 hover:bg-muted/50 -mx-2 px-2 rounded"
              >
                <span className="text-sm">{project.name}</span>
                <StatusBadge status={project.status} />
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Proposals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {proposals.length === 0 && (
              <p className="text-sm text-muted-foreground">No proposals yet.</p>
            )}
            {proposals.map((proposal) => (
              <Link
                key={proposal.id}
                href={`/portal/proposals/${proposal.id}`}
                className="flex items-center justify-between border-b pb-2 last:border-0 hover:bg-muted/50 -mx-2 px-2 rounded"
              >
                <span className="text-sm">{proposal.title}</span>
                <StatusBadge status={proposal.status} />
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
