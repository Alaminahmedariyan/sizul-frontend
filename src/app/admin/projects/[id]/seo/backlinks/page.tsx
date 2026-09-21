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
  useBacklinks,
  useCreateBacklink,
  useDeleteBacklink,
  useUpdateBacklinkStatus,
} from "@/hooks/use-seo-backlinks";

import type { BacklinkStatus } from "@/lib/api/seo-backlinks";

const STATUS_OPTIONS: BacklinkStatus[] = [
  "LIVE",
  "LOST",
  "PENDING",
  "DISAVOWED",
];

export default function SeoBacklinksPage() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading } = useBacklinks(id);
  const createBacklink = useCreateBacklink(id);
  const updateStatus = useUpdateBacklinkStatus(id);
  const deleteBacklink = useDeleteBacklink(id);

  const [sourceUrl, setSourceUrl] = useState("");
  const [targetUrl, setTargetUrl] = useState("");

  const backlinks = data?.data ?? [];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceUrl.trim() || !targetUrl.trim()) return;

    createBacklink.mutate(
      { sourceUrl, targetUrl },
      {
        onSuccess: () => {
          setSourceUrl("");
          setTargetUrl("");
          toast.success("Backlink added");
        },
        onError: (err) => toast.error(err.message),
      },
    );
  };

  return (
    <div>
      <PageHeader title="Backlinks" />
      <SeoTabs projectId={id} />

      <form onSubmit={handleCreate} className="flex gap-2 mb-4">
        <Input
          placeholder="Source URL"
          value={sourceUrl}
          onChange={(e) => setSourceUrl(e.target.value)}
          required
          className="flex-1"
        />
        <Input
          placeholder="Target URL"
          value={targetUrl}
          onChange={(e) => setTargetUrl(e.target.value)}
          required
          className="flex-1"
        />
        <Button type="submit" disabled={createBacklink.isPending}>
          Add
        </Button>
      </form>

      {isLoading && (
        <p className="text-muted-foreground">Loading backlinks...</p>
      )}
      {!isLoading && backlinks.length === 0 && (
        <EmptyState title="No backlinks tracked yet" />
      )}

      {!isLoading && backlinks.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Source</TableHead>
              <TableHead>DA</TableHead>
              <TableHead>Status</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {backlinks.map((b) => (
              <TableRow key={b.id}>
                <TableCell className="max-w-xs truncate">
                  <a
                    href={b.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {b.sourceUrl}
                  </a>
                </TableCell>
                <TableCell>{b.domainAuthority ?? "-"}</TableCell>
                <TableCell>
                  <Select
                    value={b.status}
                    onValueChange={(v) =>
                      updateStatus.mutate({
                        id: b.id,
                        status: v as BacklinkStatus,
                      })
                    }
                  >
                    <SelectTrigger className="w-[150px] h-8">
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
                </TableCell>
                <TableCell>
                  <ConfirmDeleteDialog
                    trigger={
                      <Button variant="ghost" size="sm">
                        Delete
                      </Button>
                    }
                    onConfirm={() => deleteBacklink.mutate(b.id)}
                    isPending={deleteBacklink.isPending}
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
