"use client";

import { Plus } from "lucide-react";
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

import { useProposals } from "@/hooks/use-proposals";

import type { Proposal, ProposalStatus } from "@/lib/api/proposals";

const STATUS_OPTIONS: ProposalStatus[] = [
  "DRAFT",
  "SENT",
  "VIEWED",
  "ACCEPTED",
  "REJECTED",
  "EXPIRED",
];

export default function ProposalsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<ProposalStatus | "all">("all");

  const { data, isLoading, isError, error } = useProposals({
    page,
    limit: 10,
    ...(status !== "all" ? { status } : {}),
  });

  const proposals = data?.data ?? [];

  const columns: Column<Proposal>[] = [
    {
      header: "Number",
      cell: (p) => (
        <span className="font-mono text-xs">{p.proposalNumber}</span>
      ),
    },
    {
      header: "Title",
      cell: (p) => <span className="font-medium">{p.title}</span>,
    },
    { header: "Status", cell: (p) => <StatusBadge status={p.status} /> },
    { header: "Total", cell: (p) => `${p.total} ${p.currency}` },
    {
      header: "Valid Until",
      cell: (p) =>
        p.validUntil ? new Date(p.validUntil).toLocaleDateString() : "-",
    },
  ];

  if (isError) return <ErrorAlert message={error?.message} />;

  return (
    <div>
      <PageHeader
        title="Proposals"
        description="Create and track client proposals"
        action={
          <Button asChild>
            <Link href="/admin/proposals/new">
              <Plus className="size-4" />
              New Proposal
            </Link>
          </Button>
        }
      />

      <FilterBar>
        <Select
          value={status}
          onValueChange={(v) => {
            setStatus(v as ProposalStatus | "all");
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
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FilterBar>

      <DataTable
        columns={columns}
        data={proposals}
        isLoading={isLoading}
        emptyMessage="No proposals found."
        getRowKey={(p) => p.id}
        onRowClick={(p) => router.push(`/admin/proposals/${p.id}`)}
      />

      <Pagination meta={data?.meta} page={page} onPageChange={setPage} />
    </div>
  );
}
