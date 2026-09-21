"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { type Column, DataTable } from "@/components/shared/data-table";
import { ErrorAlert } from "@/components/shared/error-alert";
import { FilterBar } from "@/components/shared/filter-bar";
import { PageHeader } from "@/components/shared/page-header";
import { Pagination } from "@/components/shared/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useClients } from "@/hooks/use-clients";

import type { Client } from "@/lib/api/clients";

export default function ClientsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isActive, setIsActive] = useState<"all" | "true" | "false">("all");

  const { data, isLoading, isError, error } = useClients({
    page,
    limit: 10,
    ...(search ? { search } : {}),
    ...(isActive !== "all" ? { isActive } : {}),
  });

  const clients = data?.data ?? [];

  const columns: Column<Client>[] = [
    {
      header: "Name",
      cell: (c) => <span className="font-medium">{c.name}</span>,
    },
    { header: "Email", cell: (c) => c.email },
    { header: "Company", cell: (c) => c.company ?? "-" },
    { header: "Phone", cell: (c) => c.phone ?? "-" },
    {
      header: "Status",
      cell: (c) => (
        <span
          className={c.isActive ? "text-green-600" : "text-muted-foreground"}
        >
          {c.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
  ];

  if (isError) return <ErrorAlert message={error?.message} />;

  return (
    <div>
      <PageHeader
        title="Clients"
        description="Manage client accounts and their profiles"
      />

      <FilterBar
        search={search}
        onSearchChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
        searchPlaceholder="Search by name, email, company..."
      >
        <Select
          value={isActive}
          onValueChange={(v) => {
            setIsActive(v as "all" | "true" | "false");
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="true">Active</SelectItem>
            <SelectItem value="false">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </FilterBar>

      <DataTable
        columns={columns}
        data={clients}
        isLoading={isLoading}
        emptyMessage="No clients found."
        getRowKey={(c) => c.id}
        onRowClick={(c) => router.push(`/admin/clients/${c.id}`)}
      />

      <Pagination meta={data?.meta} page={page} onPageChange={setPage} />
    </div>
  );
}
