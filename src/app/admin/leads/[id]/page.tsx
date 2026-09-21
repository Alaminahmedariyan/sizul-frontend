"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";

import {
  useAddLeadNote,
  useAssignLead,
  useConvertLead,
  useLead,
  useLeadActivities,
  useLeadNotes,
  useUpdateLeadStatus,
} from "@/hooks/use-leads";
import { useStaffList } from "@/hooks/use-staff";

import type { LeadStatus } from "@/lib/api/leads";

const STATUS_OPTIONS: LeadStatus[] = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "PROPOSAL_SENT",
  "NEGOTIATING",
  "CONVERTED",
  "LOST",
];

// Leads in these statuses can no longer change state or be reassigned.
const FINAL_STATUSES: LeadStatus[] = ["CONVERTED", "LOST"];

export default function LeadDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: leadRes, isLoading } = useLead(id);
  const { data: notesRes } = useLeadNotes(id);
  const { data: activitiesRes } = useLeadActivities(id);
  const { data: staffRes } = useStaffList();

  const updateStatus = useUpdateLeadStatus(id);
  const assignLead = useAssignLead(id);
  const addNote = useAddLeadNote(id);
  const convertLead = useConvertLead(id);

  const [noteContent, setNoteContent] = useState("");
  const [selectedStaffId, setSelectedStaffId] = useState("");

  const lead = leadRes?.data;

  // Sync the assigned staff dropdown with whatever the lead already has.
  useEffect(() => {
    if (lead?.assignedStaffId) {
      setSelectedStaffId(lead.assignedStaffId);
    }
  }, [lead?.assignedStaffId]);

  if (isLoading)
    return <p className="text-muted-foreground">Loading lead...</p>;

  if (!lead) return <p className="text-muted-foreground">Lead not found.</p>;

  const notes = notesRes?.data ?? [];
  const activities = activitiesRes?.data ?? [];
  const staffList = staffRes?.data ?? [];

  const isFinalized = FINAL_STATUSES.includes(lead.status);

  const handleStatusChange = (value: string) => {
    updateStatus.mutate(value as LeadStatus, {
      onSuccess: () => toast.success("Status updated"),
      onError: (err) => toast.error(err.message),
    });
  };

  const handleAssign = () => {
    if (!selectedStaffId) return;
    assignLead.mutate(selectedStaffId, {
      onSuccess: () => toast.success("Lead assigned"),
      onError: (err) => toast.error(err.message),
    });
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) return;
    addNote.mutate(noteContent, {
      onSuccess: () => {
        setNoteContent("");
        toast.success("Note added");
      },
      onError: (err) => toast.error(err.message),
    });
  };

  const handleConvert = () => {
    convertLead.mutate(undefined, {
      onSuccess: () => toast.success("Converted to client"),
      onError: (err) => toast.error(err.message),
    });
  };

  return (
    <div>
      <PageHeader
        title={lead.name}
        description={`${lead.email} · ${lead.phone ?? "No phone"}`}
        action={<StatusBadge status={lead.status} />}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <span className="text-muted-foreground">Company:</span>{" "}
              {lead.company ?? "-"}
            </p>
            <p>
              <span className="text-muted-foreground">Message:</span>{" "}
              {lead.message ?? "No message"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Status */}
            <div className="space-y-1">
              <p className="text-sm font-medium">Status</p>
              <Select
                value={lead.status}
                onValueChange={handleStatusChange}
                disabled={updateStatus.isPending || isFinalized}
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
              {isFinalized && (
                <p className="text-xs text-muted-foreground">
                  Status is locked because this lead is{" "}
                  {lead.status.toLowerCase()}.
                </p>
              )}
            </div>

            {/* Assign staff */}
            <div className="space-y-1">
              <p className="text-sm font-medium">Assign to staff</p>
              <Select
                value={selectedStaffId}
                onValueChange={setSelectedStaffId}
                disabled={isFinalized}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select staff" />
                </SelectTrigger>
                <SelectContent>
                  {staffList.length === 0 && (
                    <SelectItem value="__none" disabled>
                      No staff available
                    </SelectItem>
                  )}
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
                disabled={
                  !selectedStaffId ||
                  assignLead.isPending ||
                  isFinalized ||
                  selectedStaffId === lead.assignedStaffId
                }
                onClick={handleAssign}
              >
                {lead.assignedStaffId === selectedStaffId
                  ? "Assigned"
                  : "Assign"}
              </Button>
            </div>

            {/* Convert */}
            {lead.status === "CONVERTED" ? (
              <Button size="sm" variant="secondary" className="w-full" disabled>
                Already Converted
              </Button>
            ) : lead.status === "LOST" ? (
              <Button size="sm" variant="secondary" className="w-full" disabled>
                Lead Lost
              </Button>
            ) : (
              <Button
                size="sm"
                variant="secondary"
                className="w-full"
                disabled={convertLead.isPending}
                onClick={handleConvert}
              >
                {convertLead.isPending ? "Converting..." : "Convert to Client"}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddNote} className="mb-4 space-y-2">
              <Textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Add an internal note..."
              />
              <Button
                type="submit"
                size="sm"
                disabled={addNote.isPending || !noteContent.trim()}
              >
                {addNote.isPending ? "Adding..." : "Add note"}
              </Button>
            </form>

            <div className="space-y-3">
              {notes.length === 0 && (
                <p className="text-sm text-muted-foreground">No notes yet.</p>
              )}
              {notes.map((note) => (
                <div key={note.id} className="border-b pb-2 last:border-0">
                  <p className="text-sm">{note.content}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(note.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Log</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {activities.length === 0 && (
              <p className="text-sm text-muted-foreground">No activity yet.</p>
            )}
            {activities.map((activity) => (
              <div key={activity.id} className="border-b pb-2 last:border-0">
                <p className="text-sm">
                  <span className="font-medium">
                    {activity.type.replace(/_/g, " ")}
                  </span>{" "}
                  — {activity.description}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(activity.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
