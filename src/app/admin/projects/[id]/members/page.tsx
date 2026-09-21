"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ProjectTabs } from "@/components/admin/project-tabs";
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { PageHeader } from "@/components/shared/page-header";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  useAddProjectMember,
  useProjectMembers,
  useRemoveProjectMember,
  useUpdateProjectMemberRole,
} from "@/hooks/use-project-members";
import { useStaffList } from "@/hooks/use-staff";

import type { ProjectMemberRole } from "@/lib/api/project-members";

const ROLE_OPTIONS: ProjectMemberRole[] = [
  "LEAD",
  "MEMBER",
  "REVIEWER",
  "OBSERVER",
];

export default function ProjectMembersPage() {
  const { id } = useParams<{ id: string }>();

  const { data: membersRes, isLoading } = useProjectMembers(id);
  const { data: staffRes } = useStaffList();

  const addMember = useAddProjectMember(id);
  const updateRole = useUpdateProjectMemberRole(id);
  const removeMember = useRemoveProjectMember(id);

  const [selectedStaffId, setSelectedStaffId] = useState("");
  const [selectedRole, setSelectedRole] = useState<ProjectMemberRole>("MEMBER");

  const members = membersRes?.data ?? [];
  const staffList = staffRes?.data ?? [];

  const handleAdd = () => {
    if (!selectedStaffId) return;
    addMember.mutate(
      { staffId: selectedStaffId, role: selectedRole },
      {
        onSuccess: () => {
          setSelectedStaffId("");
          toast.success("Member added");
        },
        onError: (err) => toast.error(err.message),
      },
    );
  };

  return (
    <div>
      <PageHeader title="Members" />
      <ProjectTabs projectId={id} />

      <div className="flex gap-2 mb-4">
        <Select value={selectedStaffId} onValueChange={setSelectedStaffId}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select staff" />
          </SelectTrigger>
          <SelectContent>
            {staffList.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.fullName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={selectedRole}
          onValueChange={(v) => setSelectedRole(v as ProjectMemberRole)}
        >
          <SelectTrigger className="w-[140px]">
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
        <Button
          disabled={!selectedStaffId || addMember.isPending}
          onClick={handleAdd}
        >
          Add member
        </Button>
      </div>

      {isLoading && <p className="text-muted-foreground">Loading members...</p>}

      <div className="space-y-2">
        {!isLoading && members.length === 0 && (
          <p className="text-muted-foreground">No members yet.</p>
        )}
        {members.map((member) => {
          const staff = staffList.find((s) => s.id === member.staffId);

          return (
            <div
              key={member.id}
              className="flex items-center justify-between border rounded-md p-3"
            >
              <div className="flex items-center gap-3">
                <Avatar className="size-8">
                  <AvatarFallback>
                    {staff?.fullName?.charAt(0) ?? "?"}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">
                  {staff?.fullName ?? member.staffId}
                </span>
              </div>

              <div className="flex gap-2">
                <Select
                  value={member.role}
                  onValueChange={(v) =>
                    updateRole.mutate({
                      id: member.id,
                      role: v as ProjectMemberRole,
                    })
                  }
                >
                  <SelectTrigger className="w-[130px] h-8">
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
                <ConfirmDeleteDialog
                  trigger={
                    <Button variant="ghost" size="sm">
                      Remove
                    </Button>
                  }
                  onConfirm={() => removeMember.mutate(member.id)}
                  isPending={removeMember.isPending}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
