"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { type Column, DataTable } from "@/components/shared/data-table";
import { ErrorAlert } from "@/components/shared/error-alert";
import { PageHeader } from "@/components/shared/page-header";
import { Pagination } from "@/components/shared/pagination";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  useContactMessages,
  useDeleteContactMessage,
  useUpdateContactMessageStatus,
} from "@/hooks/use-contact-messages";

import type {
  ContactMessage,
  ContactMessageStatus,
} from "@/lib/api/contact-messages";

const STATUS_OPTIONS: ContactMessageStatus[] = [
  "UNREAD",
  "READ",
  "REPLIED",
  "ARCHIVED",
  "SPAM",
];

export default function ContactMessagesPage() {
  const [page, setPage] = useState(1);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(
    null,
  );

  const { data, isLoading, isError, error } = useContactMessages({
    page,
    limit: 10,
  });
  const updateStatus = useUpdateContactMessageStatus(selectedMessage?.id ?? "");
  const deleteMessage = useDeleteContactMessage();

  const messages = data?.data ?? [];

  const columns: Column<ContactMessage>[] = [
    {
      header: "Name",
      cell: (m) => <span className="font-medium">{m.name}</span>,
    },
    { header: "Email", cell: (m) => m.email },
    { header: "Subject", cell: (m) => m.subject ?? "-" },
    { header: "Status", cell: (m) => <StatusBadge status={m.status} /> },
    {
      header: "Received",
      cell: (m) => new Date(m.createdAt).toLocaleDateString(),
    },
    {
      header: "",
      cell: (m) => (
        <ConfirmDeleteDialog
          trigger={
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => e.stopPropagation()}
            >
              Delete
            </Button>
          }
          onConfirm={() => deleteMessage.mutate(m.id)}
          isPending={deleteMessage.isPending}
        />
      ),
    },
  ];

  if (isError) return <ErrorAlert message={error?.message} />;

  return (
    <div>
      <PageHeader
        title="Contact Messages"
        description="Messages submitted via the public contact form"
      />

      <DataTable
        columns={columns}
        data={messages}
        isLoading={isLoading}
        emptyMessage="No messages found."
        getRowKey={(m) => m.id}
        onRowClick={setSelectedMessage}
      />

      <Pagination meta={data?.meta} page={page} onPageChange={setPage} />

      <Dialog
        open={!!selectedMessage}
        onOpenChange={(open) => !open && setSelectedMessage(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedMessage?.subject ?? "Message"}</DialogTitle>
            <DialogDescription>
              {selectedMessage?.name} · {selectedMessage?.email}
            </DialogDescription>
          </DialogHeader>
          <p className="text-sm">{selectedMessage?.message}</p>

          {selectedMessage && (
            <Select
              value={selectedMessage.status}
              onValueChange={(v) =>
                updateStatus.mutate(v as ContactMessageStatus, {
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
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
