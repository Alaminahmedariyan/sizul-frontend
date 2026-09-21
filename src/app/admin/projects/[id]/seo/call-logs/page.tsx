"use client";

import { useParams } from "next/navigation";
import { SeoTabs } from "@/components/admin/seo-tabs";
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useCallLogs, useDeleteCallLog } from "@/hooks/use-seo-call-logs";

export default function SeoCallLogsPage() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading } = useCallLogs(id);
  const deleteCallLog = useDeleteCallLog(id);

  const callLogs = data?.data ?? [];

  return (
    <div>
      <PageHeader
        title="Call Logs"
        description="Calls received via tracking numbers (synced automatically)"
      />
      <SeoTabs projectId={id} />

      {isLoading && (
        <p className="text-muted-foreground">Loading call logs...</p>
      )}
      {!isLoading && callLogs.length === 0 && (
        <EmptyState title="No calls recorded yet" />
      )}

      {!isLoading && callLogs.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>From</TableHead>
              <TableHead>To</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Received</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {callLogs.map((call) => (
              <TableRow key={call.id}>
                <TableCell>{call.fromNumber}</TableCell>
                <TableCell>{call.toNumber ?? "-"}</TableCell>
                <TableCell>
                  {call.duration ? `${call.duration}s` : "-"}
                </TableCell>
                <TableCell>
                  <StatusBadge status={call.status} />
                </TableCell>
                <TableCell>
                  {new Date(call.receivedAt).toLocaleString()}
                </TableCell>
                <TableCell>
                  <ConfirmDeleteDialog
                    trigger={
                      <Button variant="ghost" size="sm">
                        Delete
                      </Button>
                    }
                    onConfirm={() => deleteCallLog.mutate(call.id)}
                    isPending={deleteCallLog.isPending}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
