"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  useAssignConsultation,
  useConsultation,
  useUpdateConsultationStatus,
} from "@/hooks/use-consultations";
import { useStaffList } from "@/hooks/use-staff";

import type { ConsultationStatus } from "@/lib/api/consultations";

const STATUS_OPTIONS: ConsultationStatus[] = [
  "PENDING",
  "CONFIRMED",
  "COMPLETED",
  "CANCELLED",
  "NO_SHOW",
];

export default function ConsultationDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: consultationRes, isLoading } = useConsultation(id);
  const { data: staffRes } = useStaffList();

  const updateStatus = useUpdateConsultationStatus(id);
  const assignConsultation = useAssignConsultation(id);

  const [selectedStaffId, setSelectedStaffId] = useState("");

  if (isLoading)
    return <p className="text-muted-foreground">Loading consultation...</p>;

  const consultation = consultationRes?.data;
  if (!consultation)
    return <p className="text-muted-foreground">Consultation not found.</p>;

  const staffList = staffRes?.data ?? [];

  return (
    <div>
      <PageHeader
        title="Consultation"
        description={`${consultation.preferredDate ? new Date(consultation.preferredDate).toLocaleDateString() : "-"} · ${consultation.preferredTime ?? "-"}`}
        action={<StatusBadge status={consultation.status} />}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            {consultation.notes ?? "No notes"}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">Status</p>
              <Select
                value={consultation.status}
                disabled={updateStatus.isPending}
                onValueChange={(v) =>
                  updateStatus.mutate(v as ConsultationStatus, {
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
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium">Assign to staff</p>
              <Select
                value={selectedStaffId}
                onValueChange={setSelectedStaffId}
              >
                <SelectTrigger>
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
              <Button
                size="sm"
                className="w-full"
                disabled={!selectedStaffId || assignConsultation.isPending}
                onClick={() =>
                  assignConsultation.mutate(selectedStaffId, {
                    onSuccess: () => toast.success("Assigned"),
                    onError: (err) => toast.error(err.message),
                  })
                }
              >
                Assign
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
