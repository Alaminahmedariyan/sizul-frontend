"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { type Column, DataTable } from "@/components/shared/data-table";
import { ErrorAlert } from "@/components/shared/error-alert";
import { FilterBar } from "@/components/shared/filter-bar";
import { PageHeader } from "@/components/shared/page-header";
import { Pagination } from "@/components/shared/pagination";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useLeads } from "@/hooks/use-leads";

import type { Lead, LeadStatus } from "@/lib/api/leads";

const STATUS_OPTIONS: LeadStatus[] = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "PROPOSAL_SENT",
  "NEGOTIATING",
  "CONVERTED",
  "LOST",
];

export default function LeadsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<LeadStatus | "all">("all");

  const { data, isLoading, isError, error } = useLeads({
    page,
    limit: 10,
    ...(search ? { search } : {}),
    ...(status !== "all" ? { status } : {}),
  });

  const leads = data?.data ?? [];

  const columns: Column<Lead>[] = [
    {
      header: "Name",
      cell: (lead) => <span className="font-medium">{lead.name}</span>,
    },
    { header: "Email", cell: (lead) => lead.email },
    { header: "Company", cell: (lead) => lead.company ?? "-" },
    { header: "Status", cell: (lead) => <StatusBadge status={lead.status} /> },
    {
      header: "Priority",
      cell: (lead) => <StatusBadge status={lead.priority} />,
    },
    { header: "Source", cell: (lead) => lead.source.replace(/_/g, " ") },
    {
      header: "Created",
      cell: (lead) => new Date(lead.createdAt).toLocaleDateString(),
    },
  ];

  if (isError) {
    toast.error("Failed to load leads");
    return <ErrorAlert message={error?.message} />;
  }

  return (
    <div>
      <PageHeader
        title="Leads"
        description="Manage incoming leads and track their progress"
      />

      <FilterBar
        search={search}
        onSearchChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
        searchPlaceholder="Search leads..."
      >
        <Select
          value={status}
          onValueChange={(v) => {
            setStatus(v as LeadStatus | "all");
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All statuses" />
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
        data={leads}
        isLoading={isLoading}
        emptyMessage="No leads found."
        getRowKey={(lead) => lead.id}
        onRowClick={(lead) => router.push(`/admin/leads/${lead.id}`)}
      />

      <Pagination meta={data?.meta} page={page} onPageChange={setPage} />
    </div>
  );
}
