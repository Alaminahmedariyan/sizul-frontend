"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { type Column, DataTable } from "@/components/shared/data-table";
import { ErrorAlert } from "@/components/shared/error-alert";
import { FilterBar } from "@/components/shared/filter-bar";
import { PageHeader } from "@/components/shared/page-header";
import { Pagination } from "@/components/shared/pagination";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useProjects } from "@/hooks/use-projects";

import type { Project, ProjectStatus } from "@/lib/api/projects";

const STATUS_OPTIONS: ProjectStatus[] = [
  "PLANNING",
  "IN_PROGRESS",
  "ON_HOLD",
  "REVIEW",
  "COMPLETED",
  "CANCELLED",
];

export default function ProjectsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<ProjectStatus | "all">("all");

  const { data, isLoading, isError, error } = useProjects({
    page,
    limit: 10,
    ...(status !== "all" ? { status } : {}),
  });

  const projects = data?.data ?? [];

  const columns: Column<Project>[] = [
    {
      header: "Name",
      cell: (p) => <span className="font-medium">{p.name}</span>,
    },
    {
      header: "Type",
      cell: (p) => p.projectType.replace(/_/g, " "),
    },
    {
      header: "Status",
      cell: (p) => <StatusBadge status={p.status} />,
    },
    {
      header: "Progress",
      cell: (p) => `${p.progress}%`,
    },
    {
      header: "Deadline",
      cell: (p) =>
        p.deadline ? new Date(p.deadline).toLocaleDateString() : "-",
    },
  ];

  if (isError) return <ErrorAlert message={error?.message} />;

  return (
    <div>
      <PageHeader
        title="Projects"
        description="Track project delivery and progress"
        action={
          <Button asChild>
            <Link href="/admin/projects/new">Add Project</Link>
          </Button>
        }
      />

      <FilterBar>
        <Select
          value={status}
          onValueChange={(v) => {
            setStatus(v as ProjectStatus | "all");
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {STATUS_OPTIONS.map((s) => (
              <SelectItem key={s} value={s}>
                {s.replace(/_/g, " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FilterBar>

      <DataTable
        columns={columns}
        data={projects}
        isLoading={isLoading}
        emptyMessage="No projects found."
        getRowKey={(p) => p.id}
        onRowClick={(p) => router.push(`/admin/projects/${p.id}`)}
      />

      <Pagination meta={data?.meta} page={page} onPageChange={setPage} />
    </div>
  );
}
