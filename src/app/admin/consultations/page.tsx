"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
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

import { useConsultations } from "@/hooks/use-consultations";

import type { Consultation, ConsultationStatus } from "@/lib/api/consultations";

const STATUS_OPTIONS: ConsultationStatus[] = [
  "PENDING",
  "CONFIRMED",
  "COMPLETED",
  "CANCELLED",
  "NO_SHOW",
];

export default function ConsultationsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<ConsultationStatus | "all">("all");

  const { data, isLoading, isError, error } = useConsultations({
    page,
    limit: 10,
    ...(status !== "all" ? { status } : {}),
  });

  const consultations = data?.data ?? [];

  const columns: Column<Consultation>[] = [
    {
      header: "Preferred Date",
      cell: (c) =>
        c.preferredDate ? new Date(c.preferredDate).toLocaleDateString() : "-",
    },
    { header: "Preferred Time", cell: (c) => c.preferredTime ?? "-" },
    { header: "Status", cell: (c) => <StatusBadge status={c.status} /> },
  ];

  if (isError) return <ErrorAlert message={error?.message} />;

  return (
    <div>
      <PageHeader
        title="Consultations"
        description="Scheduled calls and meetings with leads"
      />

      <FilterBar>
        <Select
          value={status}
          onValueChange={(v) => {
            setStatus(v as ConsultationStatus | "all");
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
        data={consultations}
        isLoading={isLoading}
        emptyMessage="No consultations found."
        getRowKey={(c) => c.id}
        onRowClick={(c) => router.push(`/admin/consultations/${c.id}`)}
      />

      <Pagination meta={data?.meta} page={page} onPageChange={setPage} />
    </div>
  );
}
