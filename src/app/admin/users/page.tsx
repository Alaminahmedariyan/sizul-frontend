"use client";

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

import {
  useUpdateUserRole,
  useUpdateUserStatus,
  useUsers,
} from "@/hooks/use-users";

import type { AppUser } from "@/lib/api/users";
import type { UserRole } from "@/types/auth";

const ROLE_OPTIONS: UserRole[] = ["ADMIN", "STAFF", "CLIENT"];

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, isLoading, isError, error } = useUsers({
    page,
    limit: 10,
    ...(search ? { search } : {}),
  });
  const updateRole = useUpdateUserRole();
  const updateStatus = useUpdateUserStatus();

  const users = data?.data ?? [];

  const columns: Column<AppUser>[] = [
    { header: "Email", cell: (u) => u.email },
    { header: "Name", cell: (u) => u.name ?? "-" },
    {
      header: "Role",
      cell: (u) => (
        <Select
          value={u.role}
          onValueChange={(v) =>
            updateRole.mutate({ id: u.id, role: v as UserRole })
          }
        >
          <SelectTrigger className="w-[110px] h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ROLE_OPTIONS.map((r) => (
              <SelectItem key={r} value={r}>
                {r}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ),
    },
    {
      header: "Status",
      cell: (u) => (
        <Select
          value={u.status}
          onValueChange={(v) =>
            updateStatus.mutate({ id: u.id, status: v as AppUser["status"] })
          }
        >
          <SelectTrigger className="w-[110px] h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ACTIVE">ACTIVE</SelectItem>
            <SelectItem value="INACTIVE">INACTIVE</SelectItem>
            <SelectItem value="SUSPENDED">SUSPENDED</SelectItem>
          </SelectContent>
        </Select>
      ),
    },
    {
      header: "Verified",
      cell: (u) => (u.emailVerified ? <StatusBadge status="ACTIVE" /> : "-"),
    },
  ];

  if (isError) return <ErrorAlert message={error?.message} />;

  return (
    <div>
      <PageHeader
        title="Users"
        description="Manage user accounts, roles, and access"
      />

      <FilterBar
        search={search}
        onSearchChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
        searchPlaceholder="Search by email..."
      />

      <DataTable
        columns={columns}
        data={users}
        isLoading={isLoading}
        emptyMessage="No users found."
        getRowKey={(u) => u.id}
      />

      <Pagination meta={data?.meta} page={page} onPageChange={setPage} />
    </div>
  );
}
