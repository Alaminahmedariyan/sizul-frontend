"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import {
  useStaffMember,
  useUpdateStaff,
  useUpdateStaffStatus,
} from "@/hooks/use-staff";

import type { StaffStatus } from "@/lib/api/staff";

const STATUS_OPTIONS: StaffStatus[] = [
  "ACTIVE",
  "INACTIVE",
  "ON_LEAVE",
  "TERMINATED",
];

export default function StaffDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: staffRes, isLoading } = useStaffMember(id);
  const updateStaff = useUpdateStaff(id);
  const updateStatus = useUpdateStaffStatus(id);

  const [designation, setDesignation] = useState("");
  const [bio, setBio] = useState("");

  if (isLoading)
    return <p className="text-muted-foreground">Loading staff member...</p>;

  const staff = staffRes?.data;
  if (!staff)
    return <p className="text-muted-foreground">Staff member not found.</p>;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateStaff.mutate(
      { designation: designation || undefined, bio: bio || undefined },
      {
        onSuccess: () => toast.success("Updated"),
        onError: (err) => toast.error(err.message),
      },
    );
  };

  return (
    <div>
      <PageHeader
        title={staff.fullName}
        description={`${staff.email} · ${staff.role}`}
        action={<StatusBadge status={staff.status} />}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1">
                <Label>Designation</Label>
                <Input
                  defaultValue={staff.designation ?? ""}
                  onChange={(e) => setDesignation(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label>Bio</Label>
                <Textarea
                  defaultValue={staff.bio ?? ""}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>
              <Button type="submit" size="sm" disabled={updateStaff.isPending}>
                Save
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              value={staff.status}
              disabled={updateStatus.isPending}
              onValueChange={(v) =>
                updateStatus.mutate(v as StaffStatus, {
                  onSuccess: () => toast.success("Status updated"),
                  onError: (err) => toast.error(err.message),
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s.replace(/_/g, " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
