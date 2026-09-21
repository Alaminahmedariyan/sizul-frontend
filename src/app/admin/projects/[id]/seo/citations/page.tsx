"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { SeoTabs } from "@/components/admin/seo-tabs";
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  useCitations,
  useCreateCitation,
  useDeleteCitation,
  useUpdateCitationStatus,
} from "@/hooks/use-seo-citations";

import type { CitationStatus } from "@/lib/api/seo-citations";

const STATUS_OPTIONS: CitationStatus[] = [
  "PENDING",
  "SUBMITTED",
  "LIVE",
  "REJECTED",
];

export default function SeoCitationsPage() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading } = useCitations(id);
  const createCitation = useCreateCitation(id);
  const updateStatus = useUpdateCitationStatus(id);
  const deleteCitation = useDeleteCitation(id);

  const [directoryName, setDirectoryName] = useState("");
  const [url, setUrl] = useState("");

  const citations = data?.data ?? [];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!directoryName.trim()) return;

    createCitation.mutate(
      { directoryName, url: url || undefined },
      {
        onSuccess: () => {
          setDirectoryName("");
          setUrl("");
          toast.success("Citation added");
        },
        onError: (err) => toast.error(err.message),
      },
    );
  };

  return (
    <div>
      <PageHeader title="Citations" />
      <SeoTabs projectId={id} />

      <form onSubmit={handleCreate} className="flex gap-2 mb-4">
        <Input
          placeholder="Directory name"
          value={directoryName}
          onChange={(e) => setDirectoryName(e.target.value)}
          required
          className="max-w-xs"
        />
        <Input
          placeholder="URL (optional)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" disabled={createCitation.isPending}>
          Add
        </Button>
      </form>

      {isLoading && (
        <p className="text-muted-foreground">Loading citations...</p>
      )}
      {!isLoading && citations.length === 0 && (
        <EmptyState title="No citations tracked yet" />
      )}

      {!isLoading && citations.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Directory</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Status</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {citations.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.directoryName}</TableCell>
                <TableCell className="max-w-xs truncate">
                  {c.url ? (
                    <a
                      href={c.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {c.url}
                    </a>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>
                  <Select
                    value={c.status}
                    onValueChange={(v) =>
                      updateStatus.mutate({
                        id: c.id,
                        status: v as CitationStatus,
                      })
                    }
                  >
                    <SelectTrigger className="w-[130px] h-8">
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
                </TableCell>
                <TableCell>
                  <ConfirmDeleteDialog
                    trigger={
                      <Button variant="ghost" size="sm">
                        Delete
                      </Button>
                    }
                    onConfirm={() => deleteCitation.mutate(c.id)}
                    isPending={deleteCitation.isPending}
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
