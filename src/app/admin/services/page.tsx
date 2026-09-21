"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { type Column, DataTable } from "@/components/shared/data-table";
import { ErrorAlert } from "@/components/shared/error-alert";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";

import { useServicesForManage } from "@/hooks/use-service";
import type { Service } from "@/lib/api/services";

export default function AdminServicesPage() {
  const router = useRouter();
  const { data, isLoading, isError, error } = useServicesForManage();

  const services = data?.data ?? [];

  const columns: Column<Service>[] = [
    {
      header: "Name",
      cell: (s) => <span className="font-medium">{s.name}</span>,
    },
    {
      header: "Starting Price",
      cell: (s) => `${s.startingPrice ?? "-"} ${s.currency}`,
    },
    { header: "Active", cell: (s) => (s.isActive ? "Yes" : "No") },
    { header: "Featured", cell: (s) => (s.isFeatured ? "Yes" : "No") },
  ];

  if (isError) return <ErrorAlert message={error?.message} />;

  return (
    <div>
      <PageHeader
        title="Services"
        description="Manage service offerings and pricing"
        action={
          <Button asChild>
            <Link href="/admin/services/new">Add Service</Link>
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={services}
        isLoading={isLoading}
        emptyMessage="No services found."
        getRowKey={(s) => s.id}
        onRowClick={(s) => router.push(`/admin/services/${s.id}`)}
      />
    </div>
  );
}
