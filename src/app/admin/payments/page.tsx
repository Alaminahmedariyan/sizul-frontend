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

import { usePayments } from "@/hooks/use-payments";

import type { Payment, PaymentStatus } from "@/lib/api/payments";

const STATUS_OPTIONS: PaymentStatus[] = [
  "PENDING",
  "PROCESSING",
  "SUCCEEDED",
  "FAILED",
  "REFUNDED",
  "CANCELLED",
];

export default function AdminPaymentsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<PaymentStatus | "all">("all");

  const { data, isLoading, isError, error } = usePayments({
    page,
    limit: 10,
    ...(status !== "all" ? { status } : {}),
  });

  const payments = data?.data ?? [];

  const columns: Column<Payment>[] = [
    { header: "Provider", cell: (p) => p.provider },
    { header: "Amount", cell: (p) => `${p.amount} ${p.currency}` },
    { header: "Status", cell: (p) => <StatusBadge status={p.status} /> },
    { header: "Method", cell: (p) => p.method ?? "-" },
    {
      header: "Paid At",
      cell: (p) => (p.paidAt ? new Date(p.paidAt).toLocaleDateString() : "-"),
    },
  ];

  if (isError) return <ErrorAlert message={error?.message} />;

  return (
    <div>
      <PageHeader
        title="Payments"
        description="All incoming payments across providers"
      />

      <FilterBar>
        <Select
          value={status}
          onValueChange={(v) => {
            setStatus(v as PaymentStatus | "all");
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[160px]">
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
        data={payments}
        isLoading={isLoading}
        emptyMessage="No payments found."
        getRowKey={(p) => p.id}
        onRowClick={(p) => router.push(`/admin/payments/${p.id}`)}
      />

      <Pagination meta={data?.meta} page={page} onPageChange={setPage} />
    </div>
  );
}
