"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { type Column, DataTable } from "@/components/shared/data-table";
import { ErrorAlert } from "@/components/shared/error-alert";
import { PageHeader } from "@/components/shared/page-header";
import { Pagination } from "@/components/shared/pagination";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useCreateStaff, useStaffList } from "@/hooks/use-staff";

import type { Staff, StaffRole } from "@/lib/api/staff";

const ROLE_OPTIONS: StaffRole[] = [
  "OWNER",
  "MANAGER",
  "DEVELOPER",
  "DESIGNER",
  "MARKETING",
  "SALES",
  "SUPPORT",
];

export default function StaffPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);

  const { data, isLoading, isError, error } = useStaffList({ page, limit: 10 });
  const createStaff = useCreateStaff();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<StaffRole>("SUPPORT");
  const [designation, setDesignation] = useState("");

  const staffList = data?.data ?? [];

  const columns: Column<Staff>[] = [
    {
      header: "Name",
      cell: (s) => <span className="font-medium">{s.fullName}</span>,
    },
    { header: "Email", cell: (s) => s.email },
    { header: "Role", cell: (s) => s.role },
    { header: "Designation", cell: (s) => s.designation ?? "-" },
    { header: "Status", cell: (s) => <StatusBadge status={s.status} /> },
  ];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) return;

    createStaff.mutate(
      {
        fullName,
        email,
        phone: phone || undefined,
        role,
        designation: designation || undefined,
      },
      {
        onSuccess: () => {
          setFullName("");
          setEmail("");
          setPhone("");
          setDesignation("");
          setRole("SUPPORT");
          setOpen(false);
          toast.success("Staff member added");
        },
        onError: (err) => toast.error(err.message),
      },
    );
  };

  if (isError) return <ErrorAlert message={error?.message} />;

  return (
    <div>
      <PageHeader
        title="Staff"
        description="Manage your team members"
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>Add Staff</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Staff Member</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-1">
                  <Label>Full Name</Label>
                  <Input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label>Phone (optional)</Label>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Role</Label>
                  <Select
                    value={role}
                    onValueChange={(v) => setRole(v as StaffRole)}
                  >
                    <SelectTrigger>
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
                </div>
                <div className="space-y-1">
                  <Label>Designation (optional)</Label>
                  <Input
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="Senior Developer"
                  />
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={createStaff.isPending}>
                    {createStaff.isPending ? "Adding..." : "Add Staff"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <DataTable
        columns={columns}
        data={staffList}
        isLoading={isLoading}
        emptyMessage="No staff members found."
        getRowKey={(s) => s.id}
        onRowClick={(s) => router.push(`/admin/staff/${s.id}`)}
      />

      <Pagination meta={data?.meta} page={page} onPageChange={setPage} />
    </div>
  );
}
